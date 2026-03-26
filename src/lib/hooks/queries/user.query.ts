import { useMutation, useQuery } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';

import { queryClient } from '@/api';
import { userApi } from '@/api/user.api';

export const useGetMeQuery = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: userApi.getMe,
    staleTime: Infinity,
    retry: 3,
  });
export const useUpdateMeMutation = () =>
  useMutation({
    mutationKey: ['updateMe'],
    mutationFn: userApi.updateMe,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      showMessage({
        message: 'Cập nhật thông tin thành công',
        type: 'success',
      });
    },
  });
