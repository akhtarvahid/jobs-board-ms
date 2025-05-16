import { UserEntity } from '../user.entity';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: UserEntity;
}
