import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class MessageReaction {
  @Prop()
  userId: Types.ObjectId;

  @Prop()
  emoji: string;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;
}

const MessageReactionSchema = SchemaFactory.createForClass(MessageReaction);

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  senderId: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  receiverId: Types.ObjectId;

  @Prop({
    required: true,
    minlength: 1,
  })
  content: string;

  @Prop({
    type: [String],
    default: [],
  })
  attachments: string[];

  @Prop({
    type: String,
    enum: ['TEXT', 'IMAGE', 'FILE', 'AUDIO', 'VIDEO'],
    default: 'TEXT',
  })
  messageType: string;

  @Prop({
    type: String,
    enum: ['SENT', 'DELIVERED', 'READ'],
    default: 'SENT',
  })
  status: string;

  @Prop({
    type: Date,
    default: null,
  })
  readAt: Date;

  @Prop({
    type: [MessageReactionSchema],
    default: [],
  })
  reactions: MessageReaction[];

  @Prop({
    default: false,
  })
  isEdited: boolean;

  @Prop({
    type: Date,
    default: null,
  })
  editedAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'Message',
    default: null,
  })
  replyToId: Types.ObjectId;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
MessageSchema.index({ senderId: 1, receiverId: 1 });
MessageSchema.index({ senderId: 1 });
MessageSchema.index({ receiverId: 1 });
MessageSchema.index({ createdAt: -1 });
