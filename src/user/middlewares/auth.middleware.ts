import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedRequest } from '../types/request.type';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async use(req: AuthenticatedRequest, _: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      throw new HttpException(
        'Unauthorized: No token provided',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const currentUser = await this.userService.findByEmail(payload.email); // get loggedin user to attach in request
      req.user = currentUser;
      next();
    } catch (err) {
      console.error('Token Verification Error:', err.message);
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
