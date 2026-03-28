import { useMutation, useQuery } from '@tanstack/react-query';
import { showMessage } from 'react-native-flash-message';

import { queryClient } from '@/api';
import { userApi } from '@/api/user.api';
import { useAuth } from '@/lib/auth';

export const useGetMeQuery = () => {
  const userInfor = useAuth((state) => state.userInfor);
  return useQuery({
    queryKey: ['me'],
    queryFn: () => {
      return userInfor ? { data: { data: userInfor } } : userApi.getMe();
    },
    staleTime: Infinity,
    retry: 3,
  });
};
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
