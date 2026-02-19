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
  IsUrl,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FavouriteGameDto {
  @ApiProperty({
    example: 'game-123',
    description: 'Unique game identifier',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'The Witcher 3: Wild Hunt',
    description: 'Game title',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://cdn.example.com/witcher3.jpg',
    description: 'Game cover image URL',
    format: 'uri',
  })
  @IsString()
  @IsNotEmpty()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  image_url: string;
}

export class CreateProfileDto {
  @ApiPropertyOptional({
    example: 'John Doe',
    description: 'Display name (visible to other users)',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  displayName?: string;

  @ApiPropertyOptional({
    example: 'Software engineer, gamer, and outdoor enthusiast',
    description: 'User biography',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional({
    example: 180,
    description: 'Height in centimeters',
    minimum: 1,
    maximum: 300,
  })
  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Height must be greater than 0' })
  @Max(300, { message: 'Height must be less than 300cm' })
  height?: number;

  @ApiPropertyOptional({
    example: 75,
    description: 'Weight in kilograms',
    minimum: 1,
    maximum: 500,
  })
  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Weight must be greater than 0' })
  @Max(500, { message: 'Weight must be less than 500kg' })
  weight?: number;

  @ApiPropertyOptional({
    example: 'TAURUS',
    description: 'Zodiac sign (auto-calculated from dateOfBirth if not provided)',
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
  })
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

  @ApiPropertyOptional({
    example: '1995-05-15T00:00:00Z',
    description: 'Date of birth (used to calculate zodiac sign)',
    format: 'date-time',
  })
  @IsDate({ message: 'dateOfBirth must be a valid date' })
  @Type(() => Date)
  @IsOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/profile-pic.jpg',
    description: 'Profile picture URL',
    format: 'uri',
  })
  @IsString()
  @IsOptional()
  @IsUrl({}, { message: 'Profile image URL must be a valid URL' })
  profileImageUrl?: string;

  @ApiPropertyOptional({
    example: [
      'https://cdn.example.com/gallery1.jpg',
      'https://cdn.example.com/gallery2.jpg',
    ],
    description: 'Array of gallery image URLs',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  galleryImageUrls?: string[];

  @ApiPropertyOptional({
    example: 'MALE',
    description: 'Gender',
    enum: ['MALE', 'FEMALE', 'OTHER'],
  })
  @IsEnum(['MALE', 'FEMALE', 'OTHER'], { message: 'Invalid gender' })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    example: 'New York, USA',
    description: 'User location',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({
    example: 'Senior Software Engineer at TechCorp',
    description: 'Job title and company',
    maxLength: 200,
  })
  @IsString()
  @IsOptional()
  occupation?: string;

  @ApiPropertyOptional({
    example: 'BS Computer Science, Stanford University',
    description: 'Education information',
    maxLength: 300,
  })
  @IsString()
  @IsOptional()
  education?: string;

  @ApiPropertyOptional({
    example: ['gaming', 'hiking', 'reading', 'cooking'],
    description: 'Array of user interests/hobbies',
    isArray: true,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  interests?: string[];

  @ApiPropertyOptional({
    example: [
      {
        id: '1',
        name: 'The Witcher 3',
        image_url: 'https://example.com/witcher3.jpg',
      },
    ],
    description: 'Array of favourite games',
    type: [FavouriteGameDto],
    isArray: true,
  })
  @IsArray()
  @Type(() => FavouriteGameDto)
  @IsOptional()
  favouriteGames?: FavouriteGameDto[];
}

export class UpdateProfileDto extends CreateProfileDto {}

export class ProfileResponseDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'Profile ID',
  })
  _id: string;

  @ApiProperty({
    example: '507f1f77bcf86cd799439012',
    description: 'Associated user ID',
  })
  userId: string;

  @ApiPropertyOptional()
  displayName?: string;

  @ApiPropertyOptional()
  bio?: string;

  @ApiPropertyOptional()
  height?: number;

  @ApiPropertyOptional()
  weight?: number;

  @ApiPropertyOptional()
  zodiacSign?: string;

  @ApiPropertyOptional()
  dateOfBirth?: Date;

  @ApiPropertyOptional()
  horoscope?: string;

  @ApiPropertyOptional()
  profileImageUrl?: string;

  @ApiPropertyOptional({ isArray: true })
  galleryImageUrls?: string[];

  @ApiPropertyOptional()
  gender?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  occupation?: string;

  @ApiPropertyOptional()
  education?: string;

  @ApiPropertyOptional({ isArray: true })
  interests?: string[];

  @ApiPropertyOptional({ type: [FavouriteGameDto] })
  favouriteGames?: FavouriteGameDto[];

  @ApiProperty({
    example: false,
    description: 'Whether profile is public',
  })
  isPublic: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00Z',
    description: 'Profile creation timestamp',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-15T12:30:00Z',
    description: 'Profile last update timestamp',
    format: 'date-time',
  })
  updatedAt: Date;
}
