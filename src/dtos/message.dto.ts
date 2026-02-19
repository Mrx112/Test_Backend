import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsEnum,
  IsMongoId,
} from 'class-validator';

export class SendMessageDto {
  @IsMongoId({ message: 'Invalid receiver ID' })
  @IsNotEmpty({ message: 'Receiver ID is required' })
  receiverId: string;

  @IsString({ message: 'Content must be a string' })
  @IsNotEmpty({ message: 'Message content is required' })
  content: string;

  @IsEnum(['TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO'], {
    message: 'Invalid message type',
  })
  @IsOptional()
  messageType?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attachments?: string[];

  @IsMongoId()
  @IsOptional()
  replyToId?: string;
}

export class ViewMessagesDto {
  @IsMongoId({ message: 'Invalid conversation ID' })
  @IsNotEmpty({ message: 'Conversation ID is required' })
  conversationId: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}

export class MessageResponseDto {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  status: string;
  attachments: string[];
  reactions: any[];
  isEdited: boolean;
  editedAt: Date;
  replyToId: string;
  createdAt: Date;
  updatedAt: Date;
}
