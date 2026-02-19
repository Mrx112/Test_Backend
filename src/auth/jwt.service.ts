import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  sign(payload: any): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    const expiresIn = this.configService.get<string>('JWT_EXPIRATION') || '24h';

    return jwt.sign(payload, secret, { expiresIn });
  }

  verify(token: string): JwtPayload {
    const secret = this.configService.get<string>('JWT_SECRET');
    return jwt.verify(token, secret) as JwtPayload;
  }

  decode(token: string): JwtPayload {
    return jwt.decode(token) as JwtPayload;
  }
}
