import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message } from '../schemas/message.schema';
import { Conversation } from '../schemas/conversation.schema';
import { SendMessageDto } from '../dtos/message.dto';
import { RabbitMqService } from '../config/rabbitmq.service';

interface MessageWithSender extends Message {
  sender?: {
    id: string;
    username: string;
  };
}

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<Conversation>,
    private rabbitMqService: RabbitMqService,
  ) {}

  /**
   * Send a message between two users
   */
  async sendMessage(
    senderId: string,
    sendMessageDto: SendMessageDto,
  ): Promise<any> {
    const { receiverId, content, messageType = 'TEXT', attachments = [], replyToId } =
      sendMessageDto;

    // Validate sender and receiver
    if (senderId === receiverId) {
      throw new BadRequestException('Cannot send message to yourself');
    }

    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    // Create or get conversation
    let conversation = await this.conversationModel.findOne({
      participants: {
        $all: [
          { $elemMatch: { userId: senderObjectId } },
          { $elemMatch: { userId: receiverObjectId } },
        ],
      },
    });

    if (!conversation) {
      conversation = await this.conversationModel.create({
        participants: [
          {
            userId: senderObjectId,
            joinedAt: new Date(),
            isMuted: false,
          },
          {
            userId: receiverObjectId,
            joinedAt: new Date(),
            isMuted: false,
          },
        ],
        status: 'ACTIVE',
        messageCount: 0,
      });
    }

    // Create message
    const message = await this.messageModel.create({
      senderId: senderObjectId,
      receiverId: receiverObjectId,
      content,
      messageType,
      attachments,
      status: 'SENT',
      replyToId: replyToId ? new Types.ObjectId(replyToId) : null,
    });

    // Update conversation
    conversation.lastMessage = content;
    conversation.lastMessageId = message._id;
    conversation.lastMessageAt = new Date();
    conversation.messageCount += 1;
    await conversation.save();

    // Send notification via RabbitMQ
    await this.rabbitMqService.sendMessage(`messages.${receiverId}`, {
      type: 'NEW_MESSAGE',
      senderId,
      receiverId,
      messageId: message._id,
      content,
      timestamp: new Date(),
    });

    return {
      message: 'Message sent successfully',
      data: {
        _id: message._id,
        senderId: message.senderId,
        receiverId: message.receiverId,
        content: message.content,
        messageType: message.messageType,
        status: message.status,
        attachments: message.attachments,
        createdAt: message.createdAt,
      },
    };
  }

  /**
   * Get messages between two users
   */
  async viewMessages(
    userId: string,
    conversationId: string,
    limit = 50,
    offset = 0,
  ): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const conversationObjectId = new Types.ObjectId(conversationId);

    // Verify conversation exists and user is participant
    const conversation = await this.conversationModel.findById(
      conversationObjectId,
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    const isParticipant = conversation.participants.some(
      (p: any) => p.userId.toString() === userId,
    );

    if (!isParticipant) {
      throw new BadRequestException(
        'You are not a participant in this conversation',
      );
    }

    // Fetch messages
    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: userObjectId, receiverId: { $in: conversation.participants.map((p: any) => p.userId).filter((id: any) => id.toString() !== userId) } },
          { receiverId: userObjectId, senderId: { $in: conversation.participants.map((p: any) => p.userId).filter((id: any) => id.toString() !== userId) } },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    // Mark messages as read
    await this.messageModel.updateMany(
      {
        receiverId: userObjectId,
        status: { $in: ['SENT', 'DELIVERED'] },
      },
      {
        status: 'READ',
        readAt: new Date(),
      },
    );

    return {
      message: 'Messages retrieved successfully',
      data: {
        conversationId,
        totalMessages: await this.messageModel.countDocuments({
          $or: [
            { senderId: userObjectId },
            { receiverId: userObjectId },
          ],
        }),
        messages: messages.map((msg: any) => ({
          _id: msg._id,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          content: msg.content,
          messageType: msg.messageType,
          status: msg.status,
          attachments: msg.attachments,
          reactions: msg.reactions,
          isEdited: msg.isEdited,
          editedAt: msg.editedAt,
          replyToId: msg.replyToId,
          createdAt: msg.createdAt,
        })),
      },
    };
  }

  /**
   * Get all conversations for a user with pagination and sorting
   */
  async getConversations(userId: string, limit = 20, offset = 0): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);

    const conversations = await this.conversationModel
      .find({
        'participants.userId': userObjectId,
        status: 'ACTIVE',
      })
      .populate('participants.userId', 'username email')
      .sort({ lastMessageAt: -1 })
      .skip(offset)
      .limit(limit)
      .exec();

    return {
      message: 'Conversations retrieved successfully',
      data: {
        total: await this.conversationModel.countDocuments({
          'participants.userId': userObjectId,
        }),
        conversations: conversations.map((conv: any) => ({
          _id: conv._id,
          participants: conv.participants,
          lastMessage: conv.lastMessage,
          lastMessageAt: conv.lastMessageAt,
          messageCount: conv.messageCount,
          status: conv.status,
        })),
      },
    };
  }

  /**
   * Add reaction to a message
   */
  async addReaction(
    userId: string,
    messageId: string,
    emoji: string,
  ): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const messageObjectId = new Types.ObjectId(messageId);

    const message = await this.messageModel.findById(messageObjectId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r: any) => r.userId.toString() === userId && r.emoji === emoji,
    );

    if (existingReaction) {
      throw new BadRequestException('You already reacted with this emoji');
    }

    message.reactions.push({
      userId: userObjectId,
      emoji,
      createdAt: new Date(),
    });

    await message.save();

    return {
      message: 'Reaction added successfully',
      data: message.reactions,
    };
  }

  /**
   * Remove reaction from a message
   */
  async removeReaction(
    userId: string,
    messageId: string,
    emoji: string,
  ): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const messageObjectId = new Types.ObjectId(messageId);

    const message = await this.messageModel.findByIdAndUpdate(
      messageObjectId,
      {
        $pull: {
          reactions: {
            userId: userObjectId,
            emoji,
          },
        },
      },
      { new: true },
    );

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    return {
      message: 'Reaction removed successfully',
      data: message.reactions,
    };
  }

  /**
   * Edit a message
   */
  async editMessage(
    userId: string,
    messageId: string,
    newContent: string,
  ): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const messageObjectId = new Types.ObjectId(messageId);

    const message = await this.messageModel.findById(messageObjectId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new BadRequestException('You can only edit your own messages');
    }

    message.content = newContent;
    message.isEdited = true;
    message.editedAt = new Date();

    await message.save();

    return {
      message: 'Message edited successfully',
      data: {
        _id: message._id,
        content: message.content,
        isEdited: message.isEdited,
        editedAt: message.editedAt,
      },
    };
  }

  /**
   * Delete a message
   */
  async deleteMessage(userId: string, messageId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const messageObjectId = new Types.ObjectId(messageId);

    const message = await this.messageModel.findById(messageObjectId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new BadRequestException('You can only delete your own messages');
    }

    await this.messageModel.findByIdAndDelete(messageObjectId);

    // Update conversation message count
    await this.conversationModel.findOneAndUpdate(
      {
        $or: [
          { senderId: userObjectId },
          { receiverId: userObjectId },
        ],
      },
      {
        $inc: { messageCount: -1 },
      },
    );

    return {
      message: 'Message deleted successfully',
    };
  }

  /**
   * Block a user
   */
  async blockUser(userId: string, blockedUserId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const blockedUserObjectId = new Types.ObjectId(blockedUserId);

    const conversation = await this.conversationModel.findOneAndUpdate(
      {
        participants: {
          $all: [
            { $elemMatch: { userId: userObjectId } },
            { $elemMatch: { userId: blockedUserObjectId } },
          ],
        },
      },
      {
        isBlocked: true,
        status: 'ACTIVE',
      },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      message: 'User blocked successfully',
    };
  }

  /**
   * Unblock a user
   */
  async unblockUser(userId: string, blockedUserId: string): Promise<any> {
    const userObjectId = new Types.ObjectId(userId);
    const blockedUserObjectId = new Types.ObjectId(blockedUserId);

    const conversation = await this.conversationModel.findOneAndUpdate(
      {
        participants: {
          $all: [
            { $elemMatch: { userId: userObjectId } },
            { $elemMatch: { userId: blockedUserObjectId } },
          ],
        },
      },
      {
        isBlocked: false,
      },
      { new: true },
    );

    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return {
      message: 'User unblocked successfully',
    };
  }
}
