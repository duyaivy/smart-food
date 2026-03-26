import http from './common/axios.config';
import type {
  IAuthPayload,
  IAuthTokens,
  IForgotPasswordInput,
  ILogoutInput,
  IMyProfile,
  IRefreshTokenInput,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  ISuccessResponse,
  IUpdateMyProfileInput,
} from '@/interfaces/auth';

const MY_PROFILE_URL = '/users/me';
const LOGIN_URL = 'v1/auth/login';
const REGISTER_URL = 'v1/auth/register';
const LOGOUT_URL = 'v1/auth/logout';
const REFRESH_TOKENS_URL = 'v1/auth/refresh-tokens';
const FORGOT_PASSWORD_URL = 'v1/auth/forgot-password';
const RESET_PASSWORD_URL = 'v1/auth/reset-password';
const SEND_VERIFICATION_EMAIL_URL = 'v1/auth/send-verification-email';

export const authApi = {
  signIn: async (data: ISignInInput) => {
    const response = await http.post<ISuccessResponse<IAuthPayload>>(LOGIN_URL, data);
    return response.data.data;
  },

  signUp: async (data: ISignUpInput) => {
    const response = await http.post<ISuccessResponse<IAuthPayload>>(REGISTER_URL, {
      ...data,
      avatar: data.avatar ?? null,
      height: data.height ?? null,
      weight: data.weight ?? null,
      age: data.age ?? null,
    });
    return response.data.data;
  },

  logout: async (data: ILogoutInput) => {
    const response = await http.post<ISuccessResponse<null>>(LOGOUT_URL, data);
    return response.data.data;
  },

  refreshTokens: async (data: IRefreshTokenInput) => {
    const response = await http.post<ISuccessResponse<IAuthTokens>>(REFRESH_TOKENS_URL, data);
    return response.data.data;
  },

  forgotPassword: async (data: IForgotPasswordInput) => {
    const response = await http.post<ISuccessResponse<null>>(FORGOT_PASSWORD_URL, data);
    return response.data.data;
  },

  resetPassword: async (data: IResetPasswordInput) => {
    const response = await http.post<ISuccessResponse<null>>(RESET_PASSWORD_URL, data);
    return response.data.data;
  },

  sendVerificationEmail: async () => {
    const response = await http.post<ISuccessResponse<null>>(SEND_VERIFICATION_EMAIL_URL);
    return response.data.data;
  },

  getMyProfile: async () => {
    const response = await http.get<ISuccessResponse<IMyProfile>>(MY_PROFILE_URL);
    return response.data.data;
  },

  updateMyProfile: async (data: IUpdateMyProfileInput) => {
    const response = await http.put<ISuccessResponse<IMyProfile>>(MY_PROFILE_URL, {
      name: data.name,
      email: data.email,
      age: data.age,
      height: data.heightCm,
      weight: data.weightKg,
    });
    return response.data.data;
  },
};