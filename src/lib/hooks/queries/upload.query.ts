import { useMutation } from '@tanstack/react-query';

import { uploadApi } from '@/api/upload.api';

export const useUploadAvatarMutation = () =>
  useMutation({
    mutationKey: ['uploadAvatar'],
    mutationFn: uploadApi.uploadAvatar,
  });

export const useUploadMediaMutation = () =>
  useMutation({
    mutationKey: ['uploadMedia'],
    mutationFn: uploadApi.uploadMedia,
  });
