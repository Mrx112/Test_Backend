import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  Query,
  Param,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from '../dtos/message.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Chat Controller
 *
 * Handles messaging operations between users.
 * All endpoints require JWT authentication.
 */
@Controller('api')
export class ChatController {
  constructor(private chatService: ChatService) {}

  /**
   * POST /api/sendMessage
   *
   * Send a message to another user
   * Requires JWT authentication
   * Sends notification via RabbitMQ to receiver
   *
   * @param sendMessageDto - Message details (receiverId, content, etc.)
   * @param req - Request object containing authenticated user
   * @returns Confirmation with sent message details
   *
   * @example
   * POST /api/sendMessage
   * Headers: Authorization: Bearer <JWT_TOKEN>
   * {
   *   "receiverId": "507f1f77bcf86cd799439013",
   *   "content": "Hey, how are you?",
   *   "messageType": "TEXT",
   *   "attachments": []
   * }
   *
   * Response 201:
   * {
   *   "message": "Message sent successfully",
   *   "data": {
   *     "_id": "507f1f77bcf86cd799439014",
   *     "senderId": "507f1f77bcf86cd799439012",
   *     "receiverId": "507f1f77bcf86cd799439013",
   *     "content": "Hey, how are you?",
   *     "messageType": "TEXT",
   *     "status": "SENT",
   *     "attachments": [],
   *     "createdAt": "2024-01-01T00:00:00Z"
   *   }
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Post('sendMessage')
  async sendMessage(
    @Body() sendMessageDto: SendMessageDto,
    @Request() req: any,
  ) {
    return this.chatService.sendMessage(req.user.sub, sendMessageDto);
  }

  /**
   * GET /api/viewMessages/:conversationId
   *
   * Retrieve all messages from a conversation
   * Requires JWT authentication
   * Marks messages as read automatically
   *
   * @param conversationId - ID of the conversation to fetch messages from
   * @param limit - Number of messages to fetch (default: 50)
   * @param offset - Number of messages to skip for pagination (default: 0)
   * @param req - Request object containing authenticated user
   * @returns Array of messages in the conversation
   *
   * @example
   * GET /api/viewMessages/507f1f77bcf86cd799439014?limit=20&offset=0
   * Headers: Authorization: Bearer <JWT_TOKEN>
   *
   * Response 200:
   * {
   *   "message": "Messages retrieved successfully",
   *   "data": {
   *     "conversationId": "507f1f77bcf86cd799439014",
   *     "totalMessages": 45,
   *     "messages": [
   *       {
   *         "_id": "507f1f77bcf86cd799439020",
   *         "senderId": "507f1f77bcf86cd799439012",
   *         "receiverId": "507f1f77bcf86cd799439013",
   *         "content": "Hey, how are you?",
   *         "messageType": "TEXT",
   *         "status": "READ",
   *         "attachments": [],
   *         "reactions": [],
   *         "createdAt": "2024-01-01T00:00:00Z"
   *       }
   *     ]
   *   }
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Get('viewMessages/:conversationId')
  async viewMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Request() req?: any,
  ) {
    return this.chatService.viewMessages(
      req.user.sub,
      conversationId,
      limit ? parseInt(limit) : 50,
      offset ? parseInt(offset) : 0,
    );
  }

  /**
   * GET /api/conversations
   *
   * Get all conversations for the authenticated user
   * Requires JWT authentication
   * Sorted by most recent message
   *
   * @param limit - Number of conversations to fetch (default: 20)
   * @param offset - Number of conversations to skip (default: 0)
   * @param req - Request object containing authenticated user
   * @returns List of conversations with basic information
   *
   * @example
   * GET /api/conversations?limit=10&offset=0
   * Headers: Authorization: Bearer <JWT_TOKEN>
   *
   * Response 200:
   * {
   *   "message": "Conversations retrieved successfully",
   *   "data": {
   *     "total": 5,
   *     "conversations": [
   *       {
   *         "_id": "507f1f77bcf86cd799439014",
   *         "participants": [...],
   *         "lastMessage": "See you soon!",
   *         "lastMessageAt": "2024-01-01T15:30:00Z",
   *         "messageCount": 45,
   *         "status": "ACTIVE"
   *       }
   *     ]
   *   }
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Get('conversations')
  async getConversations(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Request() req?: any,
  ) {
    return this.chatService.getConversations(
      req.user.sub,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }

  /**
   * POST /api/messages/:messageId/reaction
   *
   * Add a reaction (emoji) to a message
   * Requires JWT authentication
   *
   * @param messageId - ID of the message to react to
   * @param emoji - Emoji to add (string)
   * @param req - Request object containing authenticated user
   * @returns Updated reactions list
   *
   * @example
   * POST /api/messages/507f1f77bcf86cd799439020/reaction
   * Headers: Authorization: Bearer <JWT_TOKEN>
   * {
   *   "emoji": "👍"
   * }
   *
   * Response 200:
   * {
   *   "message": "Reaction added successfully",
   *   "data": [
   *     {
   *       "userId": "507f1f77bcf86cd799439012",
   *       "emoji": "👍",
   *       "createdAt": "2024-01-01T00:00:00Z"
   *     }
   *   ]
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Post('messages/:messageId/reaction')
  async addReaction(
    @Param('messageId') messageId: string,
    @Body('emoji') emoji: string,
    @Request() req: any,
  ) {
    return this.chatService.addReaction(req.user.sub, messageId, emoji);
  }

  /**
   * DELETE /api/messages/:messageId/reaction
   *
   * Remove a reaction from a message
   * Requires JWT authentication
   *
   * @param messageId - ID of the message
   * @param emoji - Emoji to remove (string)
   * @param req - Request object containing authenticated user
   * @returns Updated reactions list
   */
  @UseGuards(JwtAuthGuard)
  @Delete('messages/:messageId/reaction')
  async removeReaction(
    @Param('messageId') messageId: string,
    @Query('emoji') emoji: string,
    @Request() req: any,
  ) {
    return this.chatService.removeReaction(req.user.sub, messageId, emoji);
  }

  /**
   * PUT /api/messages/:messageId
   *
   * Edit a message (only by sender)
   * Requires JWT authentication
   *
   * @param messageId - ID of the message to edit
   * @param newContent - Updated message content
   * @param req - Request object containing authenticated user
   * @returns Updated message
   *
   * @example
   * PUT /api/messages/507f1f77bcf86cd799439020
   * Headers: Authorization: Bearer <JWT_TOKEN>
   * {
   *   "content": "Hey, how are you doing?"
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Put('messages/:messageId')
  async editMessage(
    @Param('messageId') messageId: string,
    @Body('content') newContent: string,
    @Request() req: any,
  ) {
    return this.chatService.editMessage(req.user.sub, messageId, newContent);
  }

  /**
   * DELETE /api/messages/:messageId
   *
   * Delete a message (only by sender)
   * Requires JWT authentication
   *
   * @param messageId - ID of the message to delete
   * @param req - Request object containing authenticated user
   */
  @UseGuards(JwtAuthGuard)
  @Delete('messages/:messageId')
  async deleteMessage(
    @Param('messageId') messageId: string,
    @Request() req: any,
  ) {
    return this.chatService.deleteMessage(req.user.sub, messageId);
  }

  /**
   * POST /api/block-user/:blockedUserId
   *
   * Block a user from sending messages
   * Requires JWT authentication
   *
   * @param blockedUserId - ID of user to block
   * @param req - Request object containing authenticated user
   */
  @UseGuards(JwtAuthGuard)
  @Post('block-user/:blockedUserId')
  async blockUser(
    @Param('blockedUserId') blockedUserId: string,
    @Request() req: any,
  ) {
    return this.chatService.blockUser(req.user.sub, blockedUserId);
  }

  /**
   * POST /api/unblock-user/:blockedUserId
   *
   * Unblock a user
   * Requires JWT authentication
   *
   * @param blockedUserId - ID of user to unblock
   * @param req - Request object containing authenticated user
   */
  @UseGuards(JwtAuthGuard)
  @Post('unblock-user/:blockedUserId')
  async unblockUser(
    @Param('blockedUserId') blockedUserId: string,
    @Request() req: any,
  ) {
    return this.chatService.unblockUser(req.user.sub, blockedUserId);
  }
}
