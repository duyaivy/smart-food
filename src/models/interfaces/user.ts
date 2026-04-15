import { type Role } from '../types/user';

export interface IUser {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
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
export interface IUserPushToken {
  token: string;
  deviceName: string;
}
