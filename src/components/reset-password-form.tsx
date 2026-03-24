import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { ROUTE } from '@/constants/route';
import { useResetPasswordMutation } from '@/lib/hooks/queries/auth.query';
import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from '@/schemas/reset-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, type TextInput, View } from 'react-native';

export function ResetPasswordForm() {
  const router = useRouter();
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const resetPasswordMutation = useResetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onTokenSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  async function onSubmit(values: ResetPasswordSchemaType) {
    try {
      await resetPasswordMutation.mutateAsync({
        token: values.token,
        password: values.password,
      });

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
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đặt lại mật khẩu. Vui lòng kiểm tra token và thử lại.';
      Alert.alert('Đặt lại mật khẩu thất bại', message);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-800 bg-zinc-900 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white sm:text-left">
            Đặt lại mật khẩu
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 sm:text-left">
            Nhập mã đặt lại mật khẩu từ email và chọn mật khẩu mới
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="token" className="text-zinc-200">
                Mã đặt lại mật khẩu
              </Label>
              <Controller
                control={control}
                name="token"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="token"
                    className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                    placeholder="Dán mã đặt lại mật khẩu"
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="next"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onTokenSubmitEditing}
                  />
                )}
              />
              {errors.token?.message ? (
                <Text className="text-destructive text-sm">{errors.token.message}</Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password" className="text-zinc-200">
                Mật khẩu mới
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    className="border-zinc-700 bg-zinc-800 text-white"
                    secureTextEntry
                    returnKeyType="next"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onPasswordSubmitEditing}
                  />
                )}
              />
              {errors.password?.message ? (
                <Text className="text-destructive text-sm">{errors.password.message}</Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="confirmPassword" className="text-zinc-200">
                Xác nhận mật khẩu mới
              </Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={confirmPasswordInputRef}
                    id="confirmPassword"
                    className="border-zinc-700 bg-zinc-800 text-white"
                    secureTextEntry
                    returnKeyType="send"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              {errors.confirmPassword?.message ? (
                <Text className="text-destructive text-sm">
                  {errors.confirmPassword.message}
                </Text>
              ) : null}
            </View>

            <Button
              className="w-full bg-white"
              onPress={handleSubmit(onSubmit)}
              disabled={resetPasswordMutation.isPending}
            >
              <Text className="font-medium text-black">
                {resetPasswordMutation.isPending
                  ? 'Đang cập nhật mật khẩu...'
                  : 'Cập nhật mật khẩu'}
              </Text>
            </Button>

            <Button
              variant="link"
              className="mx-auto"
              onPress={() => router.push(ROUTE.AUTH.SIGNIN)}
            >
              <Text className="text-blue-400">Quay lại đăng nhập</Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}