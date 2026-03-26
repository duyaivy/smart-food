import { authApi } from '@/api/auth.api';
import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import type {
  IAuthPayload,
  IAuthTokens,
  IForgotPasswordInput,
  IMyProfile,
  IRefreshTokenInput,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  IUpdateMyProfileInput,
} from '@/interfaces/auth';

export const authQueryKeys = {
  all: ['auth'] as const,
  myProfile: () => [...authQueryKeys.all, 'my-profile'] as const,
};

export function useMyProfileQuery(): UseQueryResult<IMyProfile, unknown> {
  return useQuery({
    queryKey: authQueryKeys.myProfile(),
    queryFn: authApi.getMyProfile,
  });
}

export function useUpdateProfileMutation(): UseMutationResult<
  IMyProfile,
  unknown,
  IUpdateMyProfileInput
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.updateMyProfile,
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

export function useSignInMutation(): UseMutationResult<IAuthPayload, unknown, ISignInInput> {
  return useMutation({
    mutationFn: authApi.signIn,
  });
}

export function useSignUpMutation(): UseMutationResult<IAuthPayload, unknown, ISignUpInput> {
  return useMutation({
    mutationFn: authApi.signUp,
  });
}

export function useLogoutMutation(): UseMutationResult<null, unknown, { refreshToken: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      useAuth.getState().signOut();
      await queryClient.clear();
    },
    onError: () => {
      useAuth.getState().signOut();
    },
  });
}

export function useRefreshTokensMutation(): UseMutationResult<
  IAuthTokens,
  unknown,
  IRefreshTokenInput
> {
  return useMutation({
    mutationFn: authApi.refreshTokens,
  });
}

export function useForgotPasswordMutation(): UseMutationResult<
  null,
  unknown,
  IForgotPasswordInput
> {
  return useMutation({
    mutationFn: authApi.forgotPassword,
  });
}

export function useResetPasswordMutation(): UseMutationResult<
  null,
  unknown,
  IResetPasswordInput
> {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}

export function useSendVerificationEmailMutation(): UseMutationResult<null, unknown, void> {
  return useMutation({
    mutationFn: authApi.sendVerificationEmail,
  });
}