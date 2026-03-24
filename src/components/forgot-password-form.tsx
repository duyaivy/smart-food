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
import { useForgotPasswordMutation } from '@/lib/hooks/queries/auth.query';
import {
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from '@/schemas/forgot-password.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, View } from 'react-native';

export function ForgotPasswordForm() {
  const router = useRouter();
  const forgotPasswordMutation = useForgotPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotPasswordSchemaType) {
    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.email,
      });

      Alert.alert(
        'Đã gửi email đặt lại mật khẩu',
        'Vui lòng kiểm tra email của bạn để lấy token đặt lại mật khẩu.'
      );

      router.push(ROUTE.AUTH.RESET_PASSWORD);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.';
      Alert.alert('Gửi yêu cầu thất bại', message);
    }
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-800 bg-zinc-900 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white sm:text-left">
            Quên mật khẩu?
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 sm:text-left">
            Nhập email để nhận hướng dẫn đặt lại mật khẩu
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email" className="text-zinc-200">
                Email
              </Label>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="email"
                    className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoComplete="email"
                    autoCapitalize="none"
                    returnKeyType="send"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={handleSubmit(onSubmit)}
                  />
                )}
              />

              {errors.email?.message ? (
                <Text className="text-destructive text-sm">{errors.email.message}</Text>
              ) : null}
            </View>

            <Button
              className="w-full bg-white"
              onPress={handleSubmit(onSubmit)}
              disabled={forgotPasswordMutation.isPending}
            >
              <Text className="font-medium text-black">
                {forgotPasswordMutation.isPending
                  ? 'Đang gửi email...'
                  : 'Gửi yêu cầu đặt lại mật khẩu'}
              </Text>
            </Button>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}