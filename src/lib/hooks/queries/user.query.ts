import { useMutation, useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

import { queryClient } from '@/api';
import { userApi } from '@/api/user.api';
import { useAuth } from '@/lib/auth';
import { showMessage } from '@/lib/common/show-message';
import { type SuccessResponse } from '@/models/interfaces/common';
import { type IUser } from '@/models/interfaces/user';

export const useGetMeQuery = () => {
  const userInfor = useAuth((state) => state.userInfor);
  const userInforUpdatedAt = useAuth((state) => state.userInforUpdatedAt);

  return useQuery<SuccessResponse<IUser>>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await userApi.getMe();
      return response.data;
    },
    initialData: userInfor
      ? { message: 'local-cache', data: userInfor }
      : undefined,
    initialDataUpdatedAt: userInforUpdatedAt ?? undefined,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3,
  });
};
export const useUpdateMeMutation = () =>
  useMutation({
    mutationKey: ['updateMe'],
    mutationFn: userApi.updateMe,
    onSuccess: (response) => {
      const updatedUser = response.data.data;
      useAuth.getState().setUserInfor(updatedUser);
      queryClient.setQueryData(['me'], response.data);
      queryClient.invalidateQueries({ queryKey: ['me'] });
      showMessage({
        message: 'Cập nhật thông tin thành công',
        type: 'success',
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Cập nhật thông tin thất bại, vui lòng thử lại.';
      showMessage({
        message,
        type: 'error',
      });
    },
  });
