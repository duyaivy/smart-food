import { type IUser } from './user';

export interface ISuccessResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IAuthTokenItem {
  token: string;
  expires: string | Date;
}

export interface IAuthTokens {
  access: IAuthTokenItem;
  refresh: IAuthTokenItem;
}

export interface IAuthPayload {
  user: IUser;
  tokens: IAuthTokens;
}

export interface ISignInInput {
  email: string;
  password: string;
}

export interface ISignUpInput {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  height?: number | null;
  weight?: number | null;
  age?: number | null;
}

export interface ILogoutInput {
  refreshToken: string;
}

export interface IRefreshTokenInput {
  refreshToken: string;
}

export interface IForgotPasswordInput {
  email: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}

export interface IMyProfile {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  avatar?: string | null;
  role?: string;
  isEmailVerified?: boolean;
}

export interface IUpdateMyProfileInput {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
}
