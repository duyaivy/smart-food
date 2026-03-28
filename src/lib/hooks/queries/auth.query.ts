import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import type { Router } from 'expo-router';
import { Alert } from 'react-native';

import { authApi } from '@/api/auth.api';
import { ROUTE } from '@/constants/route';
import type {
  IAuthPayload,
  IAuthTokens,
  IForgotPasswordInput,
  IRefreshTokenInput,
  IResetPasswordInput,
  ISignInInput,
  ISignUpInput,
  IUser,
} from '@/interfaces/auth';
import { useAuth } from '@/lib/auth';

export const authQueryKeys = {
  all: ['auth'] as const,
  myProfile: () => [...authQueryKeys.all, 'my-profile'] as const,
};

export function useSignInMutation(
  router: Router
): UseMutationResult<IAuthPayload, unknown, ISignInInput> {
  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (result) => {
      useAuth.getState().setUserInfor(result.user);

      useAuth.getState().signIn({
        access: result.tokens.access.token,
        refresh: result.tokens.refresh.token,
      });

      if (result.user.isEmailVerified) {
        router.push(ROUTE.TAB.HOME);
        return;
      }

      router.replace(ROUTE.AUTH.VERIFY_EMAIL);
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Đăng nhập thất bại, vui lòng thử lại.';
      Alert.alert('Đăng nhập thất bại', message);
    },
  });
}

export function useSignUpMutation(
  _router: Router
): UseMutationResult<IAuthPayload, unknown, ISignUpInput> {
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: (result) => {
      useAuth.getState().signIn({
        access: result.tokens.access.token,
        refresh: result.tokens.refresh.token,
      });

      useAuth.getState().setUserInfor(result.user as IUser);
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Đăng ký thất bại, vui lòng thử lại.';
      Alert.alert('Đăng ký thất bại', message);
    },
  });
}

export function useLogoutMutation(
  router: Router
): UseMutationResult<null, unknown, { refreshToken: string }> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: async () => {
      useAuth.getState().signOut();
      await queryClient.clear();
      router.replace(ROUTE.AUTH.SIGNIN);
    },
    onError: () => {
      useAuth.getState().signOut();
      router.replace(ROUTE.AUTH.SIGNIN);
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

export function useForgotPasswordMutation(
  router: Router
): UseMutationResult<null, unknown, IForgotPasswordInput> {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: () => {
      Alert.alert(
        'Đã gửi email đặt lại mật khẩu',
        'Vui lòng kiểm tra email của bạn để lấy token đặt lại mật khẩu.'
      );
      router.push(ROUTE.AUTH.RESET_PASSWORD);
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.';
      Alert.alert('Gửi yêu cầu thất bại', message);
    },
  });
}

export function useResetPasswordMutation(
  router: Router
): UseMutationResult<null, unknown, IResetPasswordInput> {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => {
      Alert.alert(
        'Đặt lại mật khẩu thành công',
        'Bạn có thể đăng nhập lại bằng mật khẩu mới.',
        [
          {
            text: 'OK',
            onPress: () => router.replace(ROUTE.AUTH.SIGNIN),
          },
        ]
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra token và thử lại.';
      Alert.alert('Đặt lại mật khẩu thất bại', message);
    },
  });
}

export function useSendVerificationEmailMutation(
  restartCountdown: () => void
): UseMutationResult<null, unknown, void> {
  return useMutation({
    mutationFn: authApi.sendVerificationEmail,
    onSuccess: () => {
      restartCountdown();
      Alert.alert(
        'Đã gửi lại email',
        'Vui lòng kiểm tra hộp thư của bạn và nhấn vào liên kết xác thực email.'
      );
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể gửi lại email xác thực. Vui lòng thử lại.';
      Alert.alert('Gửi lại email thất bại', message);
    },
  });
}
