import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ _id: false })
class FavouriteGame {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  image_url: string;
}

const FavouriteGameSchema = SchemaFactory.createForClass(FavouriteGame);

@Schema({ timestamps: true })
export class Profile extends Document {
  @Prop({
    required: true,
    unique: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: Types.ObjectId;

  @Prop({
    default: null,
  })
  displayName: string;

  @Prop({
    default: null,
  })
  bio: string;

  @Prop({
    default: null,
  })
  height: number;

  @Prop({
    default: null,
  })
  weight: number;

  // Zodiac and Horoscope fields
  @Prop({
    type: String,
    enum: [
      'ARIES',
      'TAURUS',
      'GEMINI',
      'CANCER',
      'LEO',
      'VIRGO',
      'LIBRA',
      'SCORPIO',
      'SAGITTARIUS',
      'CAPRICORN',
      'AQUARIUS',
      'PISCES',
    ],
    default: null,
  })
  zodiacSign: string;

  @Prop({
    type: Date,
    default: null,
  })
  dateOfBirth: Date;

  @Prop({
    default: null,
  })
  horoscope: string;

  @Prop({
    default: null,
  })
  profileImageUrl: string;

  @Prop({
    type: [String],
    default: [],
  })
  galleryImageUrls: string[];

  @Prop({
    type: [FavouriteGameSchema],
    default: [],
  })
  favouriteGames: FavouriteGame[];

  @Prop({
    type: String,
    enum: ['MALE', 'FEMALE', 'OTHER'],
    default: null,
  })
  gender: string;

  @Prop({
    default: null,
  })
  location: string;

  @Prop({
    default: null,
  })
  occupation: string;

  @Prop({
    default: null,
  })
  education: string;

  @Prop({
    type: [String],
    default: [],
  })
  interests: string[];

  @Prop({
    default: false,
  })
  isPublic: boolean;

  @Prop({
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    default: Date.now,
  })
  updatedAt: Date;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ userId: 1 });
