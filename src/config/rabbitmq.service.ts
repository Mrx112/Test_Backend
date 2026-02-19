import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMqService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  /**
   * Connect to RabbitMQ
   */
  async connect(): Promise<void> {
    try {
      const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();

      // Setup exchange and queue
      const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE');
      const queue = this.configService.get<string>('RABBITMQ_QUEUE');

      await this.channel.assertExchange(exchange, 'topic', { durable: true });
      await this.channel.assertQueue(queue, { durable: true });
      await this.channel.bindQueue(queue, exchange, `${queue}.*`);

      this.isConnected = true;
      console.log('RabbitMQ connected successfully');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Send message to RabbitMQ
   */
  async sendMessage(
    routingKey: string,
    message: any,
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('RabbitMQ is not connected');
    }

    const exchange = this.configService.get<string>('RABBITMQ_EXCHANGE');
    const messageBuffer = Buffer.from(JSON.stringify(message));

    this.channel.publish(exchange, routingKey, messageBuffer, {
      persistent: true,
      contentType: 'application/json',
      timestamp: Date.now(),
    });
  }

  /**
   * Consume messages from RabbitMQ
   */
  async consumeMessages(
    callback: (message: any) => Promise<void>,
  ): Promise<void> {
    if (!this.isConnected) {
      throw new Error('RabbitMQ is not connected');
    }

    const queue = this.configService.get<string>('RABBITMQ_QUEUE');

    this.channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          this.channel.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel.nack(msg, false, true);
        }
      }
    });
  }

  /**
   * Close RabbitMQ connection
   */
  async close(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.isConnected = false;
  }

  /**
   * Get connection status
   */
  isReady(): boolean {
    return this.isConnected;
  }
}
