import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from '../dtos/profile.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * Profile Controller
 *
 * Handles user profile management operations.
 * All endpoints require JWT authentication.
 */
@Controller('api')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  /**
   * POST /api/createProfile
   *
   * Create a new user profile
   * Requires JWT authentication
   *
   * @param createProfileDto - Profile details to create
   * @param req - Request object containing authenticated user
   * @returns Created profile object with zodiac and horoscope information
   *
   * @example
   * POST /api/createProfile
   * Headers: Authorization: Bearer <JWT_TOKEN>
   * {
   *   "displayName": "John Doe",
   *   "bio": "Love gaming and outdoor activities",
   *   "height": 180,
   *   "weight": 75,
   *   "dateOfBirth": "1995-05-15T00:00:00Z",
   *   "gender": "MALE",
   *   "location": "New York",
   *   "occupation": "Software Engineer",
   *   "interests": ["gaming", "sports", "music"],
   *   "favouriteGames": [
   *     {
   *       "id": "1",
   *       "name": "The Witcher 3",
   *       "image_url": "https://example.com/witcher3.jpg"
   *     }
   *   ]
   * }
   *
   * Response 201:
   * {
   *   "_id": "507f1f77bcf86cd799439011",
   *   "userId": "507f1f77bcf86cd799439012",
   *   "displayName": "John Doe",
   *   "bio": "Love gaming and outdoor activities",
   *   "height": 180,
   *   "weight": 75,
   *   "zodiacSign": "TAURUS",
   *   "dateOfBirth": "1995-05-15T00:00:00Z",
   *   "horoscope": "As a Taurus, you are known for being reliable, patient...",
   *   "gender": "MALE",
   *   "location": "New York",
   *   "occupation": "Software Engineer",
   *   "interests": ["gaming", "sports", "music"],
   *   "favouriteGames": [...],
   *   "createdAt": "2024-01-01T00:00:00Z",
   *   "updatedAt": "2024-01-01T00:00:00Z"
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Post('createProfile')
  async createProfile(
    @Body() createProfileDto: CreateProfileDto,
    @Request() req: any,
  ) {
    return this.profileService.createProfile(req.user.sub, createProfileDto);
  }

  /**
   * GET /api/getProfile
   *
   * Retrieve the authenticated user's profile
   * Requires JWT authentication
   *
   * @param req - Request object containing authenticated user
   * @returns User's complete profile information including zodiac sign and horoscope
   *
   * @example
   * GET /api/getProfile
   * Headers: Authorization: Bearer <JWT_TOKEN>
   *
   * Response 200:
   * {
   *   "_id": "507f1f77bcf86cd799439011",
   *   "userId": "507f1f77bcf86cd799439012",
   *   "displayName": "John Doe",
   *   "bio": "Love gaming and outdoor activities",
   *   "height": 180,
   *   "weight": 75,
   *   "zodiacSign": "TAURUS",
   *   "dateOfBirth": "1995-05-15T00:00:00Z",
   *   "horoscope": "As a Taurus, you are known for being reliable...",
   *   "gender": "MALE",
   *   "location": "New York",
   *   "occupation": "Software Engineer",
   *   "interests": ["gaming", "sports", "music"],
   *   "createdAt": "2024-01-01T00:00:00Z",
   *   "updatedAt": "2024-01-01T00:00:00Z"
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Get('getProfile')
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.sub);
  }

  /**
   * PUT /api/updateProfile
   *
   * Update the authenticated user's profile
   * Requires JWT authentication
   *
   * @param updateProfileDto - Fields to update (all optional)
   * @param req - Request object containing authenticated user
   * @returns Updated profile object
   *
   * @example
   * PUT /api/updateProfile
   * Headers: Authorization: Bearer <JWT_TOKEN>
   * {
   *   "displayName": "Jane Doe",
   *   "bio": "Updated bio",
   *   "location": "Los Angeles",
   *   "interests": ["gaming", "reading", "travel"]
   * }
   *
   * Response 200:
   * {
   *   "_id": "507f1f77bcf86cd799439011",
   *   "userId": "507f1f77bcf86cd799439012",
   *   "displayName": "Jane Doe",
   *   "bio": "Updated bio",
   *   ...updated fields...
   * }
   */
  @UseGuards(JwtAuthGuard)
  @Put('updateProfile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req: any,
  ) {
    return this.profileService.updateProfile(req.user.sub, updateProfileDto);
  }
}
