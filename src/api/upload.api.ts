import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser } from '@/models/interfaces/user';

const UPLOAD_URL = '/uploads';

export const uploadApi = {
  uploadMedia: (data: FormData) =>
    http.post<SuccessResponse<string>>(
      generatePath(`${UPLOAD_URL}/media`),
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    ),
  uploadAvatar: (data: Partial<IUser>) =>
    http.patch<SuccessResponse<IUser>>(
      generatePath(`${UPLOAD_URL}/avatar`),
      data,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    ),
};
