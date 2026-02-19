import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION') || '24h';

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    return jwt.sign(payload, secret, { expiresIn });
  }

  verify(token: string): JwtPayload {
    const secret = this.configService.get<string>('JWT_SECRET') || 'your-secret-key';

    if (!secret) {
      throw new UnauthorizedException('JWT_SECRET is not configured');
    }

    try {
      return jwt.verify(token, secret) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  decode(token: string): JwtPayload | null {
    return jwt.decode(token) as JwtPayload | null;
  }
}
