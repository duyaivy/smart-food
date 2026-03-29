import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser } from '@/models/interfaces/user';

import http from './common/axios.config';

const UPLOAD_URL = '/uploads';

export const uploadApi = {
  uploadMedia: (data: FormData) =>
    http.post<SuccessResponse<string>>(`${UPLOAD_URL}/media`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadAvatar: (data: Partial<IUser>) =>
    http.patch<SuccessResponse<IUser>>(`${UPLOAD_URL}/avatar`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
