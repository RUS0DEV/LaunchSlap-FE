export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  email_confirmed: boolean;
  created_at: string;
}
