import { useMutation } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

import { uploadApi } from '@/api/upload.api';
import { showMessage } from '@/lib/common/show-message';
import { type ErrorResponse } from '@/models/interfaces/common';

export const useUploadAvatarMutation = () =>
  useMutation({
    mutationKey: ['uploadAvatar'],
    mutationFn: uploadApi.uploadAvatar,
    onError: (error: ErrorResponse<{ message: string }>) => {
      showMessage({
        type: 'error',
        message:
          error?.data?.message ||
          error?.message ||
          'Đã có lỗi xảy ra khi tải lên',
      });
    },
  });

export const useUploadMediaMutation = () =>
  useMutation({
    mutationKey: ['uploadMedia'],
    mutationFn: uploadApi.uploadMedia,
    onError: (error: AxiosError<ErrorResponse>) => {
      showMessage({
        type: 'error',
        message:
          error.response?.data?.message || 'Đã có lỗi xảy ra khi tải lên',
      });
    },
  });
