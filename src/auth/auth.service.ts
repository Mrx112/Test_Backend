import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
nimport { User } from '../schemas/user.schema';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { JwtService } from './jwt.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, username, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new BadRequestException('Email already registered');
      }
      throw new BadRequestException('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await this.userModel.create({
      email,
      username,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      username: user.username,
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      username: user.username,
    });

    return {
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      token,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserById(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }
}
