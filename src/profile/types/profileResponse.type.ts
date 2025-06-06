import { UserEntity } from '@app/user/user.entity';

type Profile = Omit<UserEntity, 'comparePassword' | 'hashPassword'>;
export type ProfileType = Profile  & { following: boolean };
export interface ProfileResponseInterface {
  profile: ProfileType;
}
