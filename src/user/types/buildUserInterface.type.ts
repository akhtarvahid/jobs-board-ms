import { UserEntity } from '../user.entity';

export interface BuildUserInterface {
  user: UserEntity & { token: { access_token: string } };
}
