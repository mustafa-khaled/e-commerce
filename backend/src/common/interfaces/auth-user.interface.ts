import { UserRole } from '@/user/enums/user-role.enum';

export interface AuthUser {
  _id: string;
  role: UserRole;
}
