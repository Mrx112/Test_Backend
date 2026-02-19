import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  IsEnum,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FavouriteGameDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image_url: string;
}

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Height must be greater than 0' })
  @Max(300, { message: 'Height must be less than 300cm' })
  height?: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Weight must be greater than 0' })
  @Max(500, { message: 'Weight must be less than 500kg' })
  weight?: number;

  @IsEnum(
    [
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
    { message: 'Invalid zodiac sign' },
  )
  @IsOptional()
  zodiacSign?: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImageUrls?: string[];

  @IsEnum(['MALE', 'FEMALE', 'OTHER'], { message: 'Invalid gender' })
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  occupation?: string;

  @IsString()
  @IsOptional()
  education?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @IsArray()
  @Type(() => FavouriteGameDto)
  @IsOptional()
  favouriteGames?: FavouriteGameDto[];
}

export class UpdateProfileDto extends CreateProfileDto {}

export class ProfileResponseDto {
  _id: string;
  userId: string;
  displayName: string;
  bio: string;
  height: number;
  weight: number;
  zodiacSign: string;
  dateOfBirth: Date;
  horoscope: string;
  profileImageUrl: string;
  galleryImageUrls: string[];
  gender: string;
  location: string;
  occupation: string;
  education: string;
  interests: string[];
  favouriteGames: FavouriteGameDto[];
  createdAt: Date;
  updatedAt: Date;
}
