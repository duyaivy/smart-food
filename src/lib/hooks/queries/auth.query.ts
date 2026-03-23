import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  getMyProfile,
  type MyProfile,
  updateMyProfile,
  type UpdateMyProfileInput,
} from '@/api/auth.api';
import { useAuth } from '@/lib/auth';

export const authQueryKeys = {
  all: ['auth'] as const,
  myProfile: () => [...authQueryKeys.all, 'my-profile'] as const,
};

export function useMyProfileQuery(): UseQueryResult<MyProfile, unknown> {
  return useQuery({
    queryKey: authQueryKeys.myProfile(),
    queryFn: getMyProfile,
  });
}

export function useUpdateProfileMutation(): UseMutationResult<
  MyProfile,
  unknown,
  UpdateMyProfileInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: async (profile) => {
      useAuth.getState().updateUser({
        name: profile.name,
        email: profile.email,
      });

      await queryClient.invalidateQueries({
        queryKey: authQueryKeys.myProfile(),
      });
    },
  });
}
