import { UserRole } from '@/user/enums/user-role.enum';

export class AuthUser {
  _id: string;
  email: string;
  role: UserRole;
}
