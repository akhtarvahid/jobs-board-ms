import { Injectable, NestMiddleware } from '@nestjs/common';
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

  async use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = this.extractToken(req);

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
      const currentUser = await this.userService.findByEmail(payload.email); // get loggedin user to attach in request
      req.user = currentUser;
      next();
    } catch (err) {
      console.error('Token Verification Error:', err.message); // Log the error
      return res.status(401).json({ message: 'Invalid token' });
    }
  }

  private extractToken(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
