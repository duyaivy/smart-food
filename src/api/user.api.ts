import http from '@api/common/axios.config';

import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser, type IUserPushToken } from '@/models/interfaces/user';

const GET_ME_URL = '/users/me';
const PUSH_TOKEN_URL = '/users/push-tokens';
export const userApi = {
  getMe: () => http<SuccessResponse<IUser>>(GET_ME_URL),
  updateMe: (data: Partial<IUser>) =>
    http.patch<SuccessResponse<IUser>>(GET_ME_URL, data),
  pushToken: ({ token, deviceName }: IUserPushToken) =>
    http.post<SuccessResponse<void>>(PUSH_TOKEN_URL, {
      token,
      deviceName,
    }),
};
