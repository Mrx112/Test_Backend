import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, AuthResponseDto } from '../dtos/auth.dto';

/**
 * Authentication Controller
 *
 * Handles user registration and login operations.
 * Provides JWT tokens for authenticated requests.
 */
@ApiTags('Authentication')
@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /api/register
   * Register a new user with email, username, and password
   */
  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Create a new user account with email, username, and secure password. Returns JWT token.',
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example1: {
        summary: 'Valid registration',
        value: {
          email: 'john.doe@example.com',
          username: 'john_doe',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
    example: {
      message: 'User registered successfully',
      user: {
        id: '507f1f77bcf86cd799439011',
        email: 'john.doe@example.com',
        username: 'john_doe',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error - invalid email, password, or username format',
    example: {
      statusCode: 400,
      message: [
        'email must be an email',
        'password must contain uppercase, lowercase, number, and special character',
      ],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 409,
    description: 'Email or username already registered',
    example: {
      statusCode: 409,
      message: 'Email already registered',
      error: 'Conflict',
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * POST /api/login
   * Login with email and password to receive JWT token
   */
  @Post('login')
  @ApiOperation({
    summary: 'Login user',
    description: 'Authenticate with email and password. Returns JWT token valid for 24 hours.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Valid login',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePass123!',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
    example: {
      message: 'Login successful',
      user: {
        id: '507f1f77bcf86cd799439011',
        email: 'john.doe@example.com',
        username: 'john_doe',
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid email or password',
    example: {
      statusCode: 401,
      message: 'Invalid email or password',
      error: 'Unauthorized',
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }
}
