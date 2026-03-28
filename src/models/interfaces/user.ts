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
  birthday?: Date;
  sex?: boolean;
  activivyLevel?: number;
  createdAt: Date;
  updatedAt: Date;
}
