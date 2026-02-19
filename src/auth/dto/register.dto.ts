import { IsEmail, IsString, MinLength, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
        format: 'email',
    })
    @IsEmail({}, { message: 'Please provide a valid email address' })
    email: string;

    @ApiProperty({
        example: 'john_doe',
        description: 'Username for the account',
        minLength: 3,
        maxLength: 30,
    })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 3 characters long' })
    @MaxLength(30, { message: 'Username must not exceed 30 characters' })
    username: string;
    
    @ApiProperty({
        example: 'SecurePass123!',
        description: 'Password with uppercase, lowercase, number, and special character',
        minLength: 8,
    })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        {
            message: 'Password must contain uppercase letter, lowercase letter, number, and special character (@$!%*?&)',
        },
    )
    password: string;
}