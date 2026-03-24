import {
  forgotPassword,
  getMyProfile,
  logout,
  refreshTokens,
  resetPassword,
  sendVerificationEmail,
  signIn,
  signUp,
  type AuthPayload,
  type AuthTokens,
  type ForgotPasswordInput,
  type MyProfile,
  type RefreshTokenInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
  type UpdateMyProfileInput,
  updateMyProfile,
} from '@/api/auth.api';
import {
  useMutation,
  type UseMutationResult,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
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

export function useSignInMutation(): UseMutationResult<AuthPayload, unknown, SignInInput> {
  return useMutation({
    mutationFn: signIn,
  });
}

export function useSignUpMutation(): UseMutationResult<AuthPayload, unknown, SignUpInput> {
  return useMutation({
    mutationFn: signUp,
  });
}

export function useLogoutMutation(): UseMutationResult<void, unknown, { refreshToken: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
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
  AuthTokens,
  unknown,
  RefreshTokenInput
> {
  return useMutation({
    mutationFn: refreshTokens,
  });
}

export function useForgotPasswordMutation(): UseMutationResult<
  void,
  unknown,
  ForgotPasswordInput
> {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export function useResetPasswordMutation(): UseMutationResult<
  void,
  unknown,
  ResetPasswordInput
> {
  return useMutation({
    mutationFn: resetPassword,
  });
}

export function useSendVerificationEmailMutation(): UseMutationResult<void, unknown, void> {
  return useMutation({
    mutationFn: sendVerificationEmail,
  });
}