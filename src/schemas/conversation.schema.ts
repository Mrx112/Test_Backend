import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class ParticipantInfo {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    default: Date.now,
  })
  joinedAt: Date;

  @Prop({
    default: false,
  })
  isMuted: boolean;
}

const ParticipantInfoSchema = SchemaFactory.createForClass(ParticipantInfo);

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: [ParticipantInfoSchema],
    required: true,
    validate: {
      validator: function (v: ParticipantInfo[]) {
        return v.length === 2;
      },
      message: 'A conversation must have exactly 2 participants',
    },
  })
  participants: ParticipantInfo[];

  @Prop({
    default: null,
  })
  lastMessage: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Message',
    default: null,
  })
  lastMessageId: Types.ObjectId;

  @Prop({
    type: Date,
    default: Date.now,
  })
  lastMessageAt: Date;

  @Prop({
    type: String,
    enum: ['ACTIVE', 'ARCHIVED', 'DELETED'],
    default: 'ACTIVE',
  })
  status: string;

  @Prop({
    default: 0,
  })
  messageCount: number;

  @Prop({
    default: false,
  })
  isBlocked: boolean;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
ConversationSchema.index({ 'participants.userId': 1 });
ConversationSchema.index({ lastMessageAt: -1 });
