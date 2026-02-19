import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RabbitMqService } from '../config/rabbitmq.service';

describe('ChatService', () => {
  let service: ChatService;
  let mockMessageModel: any;
  let mockConversationModel: any;
  let mockRabbitMqService: any;

  beforeEach(async () => {
    mockMessageModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      updateMany: jest.fn(),
      countDocuments: jest.fn(),
    };

    mockConversationModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };

    mockRabbitMqService = {
      sendMessage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken('Message'),
          useValue: mockMessageModel,
        },
        {
          provide: getModelToken('Conversation'),
          useValue: mockConversationModel,
        },
        {
          provide: RabbitMqService,
          useValue: mockRabbitMqService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  describe('sendMessage', () => {
    it('should send a message successfully', async () => {
      const senderId = 'user-123';
      const sendMessageDto = {
        receiverId: 'user-456',
        content: 'Hello!',
        messageType: 'TEXT',
        attachments: [],
      };

      const mockMessage = {
        _id: 'msg-123',
        senderId,
        receiverId: sendMessageDto.receiverId,
        content: 'Hello!',
        status: 'SENT',
        createdAt: new Date(),
      };

      mockConversationModel.findOne.mockResolvedValue(null);
      mockConversationModel.create.mockResolvedValue({
        _id: 'conv-123',
        save: jest.fn(),
      });
      mockMessageModel.create.mockResolvedValue(mockMessage);

      const result = await service.sendMessage(senderId, sendMessageDto);

      expect(result.message).toBe('Message sent successfully');
      expect(result.data.content).toBe('Hello!');
      expect(mockRabbitMqService.sendMessage).toHaveBeenCalled();
    });

    it('should throw error if sender sends message to themselves', async () => {
      const senderId = 'user-123';
      const sendMessageDto = {
        receiverId: 'user-123',
        content: 'Hello!',
      };

      await expect(service.sendMessage(senderId, sendMessageDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('viewMessages', () => {
    it('should retrieve messages from conversation', async () => {
      const userId = 'user-123';
      const conversationId = 'conv-123';

      const mockConversation = {
        _id: conversationId,
        participants: [
          { userId: 'user-123' },
          { userId: 'user-456' },
        ],
      };

      const mockMessages = [
        {
          _id: 'msg-123',
          senderId: 'user-123',
          receiverId: 'user-456',
          content: 'Hello!',
          status: 'SENT',
        },
      ];

      mockConversationModel.findById.mockResolvedValue(mockConversation);
      const chainedMethods = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockMessages),
      };
      mockMessageModel.find.mockReturnValue(chainedMethods);
      mockMessageModel.updateMany.mockResolvedValue({ modifiedCount: 1 });

      const result = await service.viewMessages(userId, conversationId);

      expect(result.message).toBe('Messages retrieved successfully');
      expect(result.data.messages).toHaveLength(1);
    });

    it('should throw error if conversation not found', async () => {
      const userId = 'user-123';
      const conversationId = 'conv-123';

      mockConversationModel.findById.mockResolvedValue(null);

      await expect(
        service.viewMessages(userId, conversationId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('addReaction', () => {
    it('should add reaction to message', async () => {
      const userId = 'user-123';
      const messageId = 'msg-123';
      const emoji = '👍';

      const mockMessage = {
        _id: messageId,
        reactions: [],
        save: jest.fn().mockResolvedValue(true),
      };

      mockMessageModel.findById.mockResolvedValue(mockMessage);

      const result = await service.addReaction(userId, messageId, emoji);

      expect(result.message).toBe('Reaction added successfully');
      expect(mockMessage.save).toHaveBeenCalled();
    });

    it('should throw error if message not found', async () => {
      const userId = 'user-123';
      const messageId = 'msg-123';
      const emoji = '👍';

      mockMessageModel.findById.mockResolvedValue(null);

      await expect(
        service.addReaction(userId, messageId, emoji),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
