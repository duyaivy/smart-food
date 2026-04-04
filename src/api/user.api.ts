import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser } from '@/models/interfaces/user';

import http from './common/axios.config';

const USER_URL = '/users/me';

export const userApi = {
  getMe: () => http<SuccessResponse<IUser>>(USER_URL),
  updateMe: (data: Partial<IUser>) =>
    http.patch<SuccessResponse<IUser>>(USER_URL, data),
};
