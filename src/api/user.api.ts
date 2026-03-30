import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser, type IUserPushToken } from '@/models/interfaces/user';

import http from './common/axios.config';

const USER_URL = '/users';

export const userApi = {
  getMe: () => http<SuccessResponse<IUser>>(`${USER_URL}/me`),
  updateMe: (data: Partial<IUser>) =>
    http.patch<SuccessResponse<IUser>>(`${USER_URL}/me`, data),
  pushToken: ({ token, deviceName }: IUserPushToken) =>
    http.post<SuccessResponse<void>>(`${USER_URL}/push-tokens`, {
      token,
      deviceName,
    }),
};
