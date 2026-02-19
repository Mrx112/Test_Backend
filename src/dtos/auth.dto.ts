import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * RegisterDto - User registration request payload
 * Validates email uniqueness, username format, and password strength
 */
export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address (must be unique)',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format. Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'john_doe',
    description: 'Username for login (3-30 characters, alphanumeric and underscore only)',
    minLength: 3,
    maxLength: 30,
  })
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @MaxLength(30, { message: 'Username must not exceed 30 characters' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'Password (minimum 8 characters, must include uppercase, lowercase, number, and special char)',
    minLength: 8,
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

/**
 * LoginDto - User login request payload
 * Used for JWT authentication
 */
export class LoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
    format: 'email',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password',
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

/**
 * AuthResponseDto - Successful authentication response
 */
export class AuthResponseDto {
  @ApiProperty({
    example: 'User registered successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    example: {
      id: '507f1f77bcf86cd799439011',
      email: 'john.doe@example.com',
      username: 'john_doe',
    },
    description: 'User information (password excluded)',
  })
  user: {
    id: string;
    email: string;
    username: string;
  };

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT token for authenticated requests (valid for 24 hours)',
    format: 'jwt',
  })
  token: string;
}
