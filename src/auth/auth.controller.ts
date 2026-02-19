import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

/**
 * Authentication Controller
 *
 * Handles user registration and login operations.
 * Provides JWT tokens for authenticated requests.
 */
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/register
   *
   * Register a new user
   *
   * @param registerDto - User registration details (email, username, password)
   * @returns Object containing user info and JWT token
   *
   * @example
   * POST /api/register
   * {
   *   "email": "user@example.com",
   *   "username": "john_doe",
   *   "password": "SecurePass123"
   * }
   *
   * Response 201:
   * {
   *   "message": "User registered successfully",
   *   "user": {
   *     "id": "507f1f77bcf86cd799439011",
   *     "email": "user@example.com",
   *     "username": "john_doe"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * POST /api/login
   *
   * Login an existing user
   *
   * @param loginDto - User login credentials (email, password)
   * @returns Object containing user info and JWT token
   *
   * @example
   * POST /api/login
   * {
   *   "email": "user@example.com",
   *   "password": "SecurePass123"
   * }
   *
   * Response 200:
   * {
   *   "message": "Login successful",
   *   "user": {
   *     "id": "507f1f77bcf86cd799439011",
   *     "email": "user@example.com",
   *     "username": "john_doe"
   *   },
   *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   * }
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
