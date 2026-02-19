import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message, MessageSchema } from '../schemas/message.schema';
import { Conversation, ConversationSchema } from '../schemas/conversation.schema';
import { RabbitMqService } from '../config/rabbitmq.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
    ]),
    AuthModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, RabbitMqService],
  exports: [ChatService, RabbitMqService],
})
export class ChatModule implements OnModuleInit {
  constructor(private rabbitMqService: RabbitMqService) {}

  async onModuleInit() {
    // Skip connecting to RabbitMQ during tests or when URL not provided
    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl || process.env.NODE_ENV === 'test') {
      console.log('Skipping RabbitMQ connection (test or no URL)');
      return;
    }

    try {
      await this.rabbitMqService.connect();
    } catch (err) {
      // Do not crash the whole app if rabbitmq is unavailable on startup
      console.error('RabbitMQ connection failed on module init:', err);
    }
  }
}
