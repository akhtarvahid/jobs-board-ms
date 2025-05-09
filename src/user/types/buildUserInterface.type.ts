import { UserEntity } from '../user.entity';

type UserType = Omit<UserEntity, 'hashPassword'| 'comparePassword'>
export interface BuildUserInterface {
  user: UserType & { token: { access_token: string } };
}
