import { type Role } from '../types/user';

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  password?: string;
  role: Role;
  isEmailVerified: boolean;
  height?: number;
  weight?: number;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}
