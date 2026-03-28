import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';

import { SocialConnections } from '@/app/(stacks)/auth/_components/social-connections';
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
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { ROUTE } from '@/constants/route';
import { useSignUpMutation } from '@/lib/hooks/queries/auth.query';
import { signupSchema, type SignupSchemaType } from '@/schemas/signup.schema';

export function SignUpForm() {
  const router = useRouter();
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const signUpMutation = useSignUpMutation(router);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaType>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onNameSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onPasswordSubmitEditing() {
    confirmPasswordInputRef.current?.focus();
  }

  function onSubmit(values: SignupSchemaType) {
    signUpMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-800 bg-zinc-900 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white sm:text-left">
            Tạo tài khoản
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 sm:text-left">
            Nhập thông tin bên dưới để tạo tài khoản mới
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="name" className="text-zinc-200">
                Họ và tên
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="name"
                    className="border-zinc-700 bg-zinc-800 text-white placeholder:text-zinc-500"
                    placeholder="Nguyễn Văn A"
                    autoCapitalize="words"
                    returnKeyType="next"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onNameSubmitEditing}
                  />
                )}
              />
              {errors.name?.message ? (
                <Text className="text-destructive text-sm">
                  {errors.name.message}
                </Text>
              ) : null}
            </View>

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
                    returnKeyType="next"
                    submitBehavior="submit"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onEmailSubmitEditing}
                  />
                )}
              />
              {errors.email?.message ? (
                <Text className="text-destructive text-sm">
                  {errors.email.message}
                </Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="password" className="text-zinc-200">
                Mật khẩu
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
                <Text className="text-destructive text-sm">
                  {errors.password.message}
                </Text>
              ) : null}
            </View>

            <View className="gap-1.5">
              <Label htmlFor="confirmPassword" className="text-zinc-200">
                Xác nhận mật khẩu
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
              loading={signUpMutation.isPending}
            >
              <Text className="font-medium text-black">
                {signUpMutation.isPending
                  ? 'Đang tạo tài khoản...'
                  : 'Tạo tài khoản'}
              </Text>
            </Button>
          </View>
          <View className="flex flex-row items-center justify-center">
            <Text className=" text-center text-sm text-zinc-400">
              Đã có tài khoản?{' '}
            </Text>
            <Pressable onPress={() => router.push(ROUTE.AUTH.SIGNIN)}>
              <Text className="text-sm text-blue-400 underline underline-offset-4">
                Đăng nhập
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <Separator className="flex-1 bg-zinc-700" />
            <Text className="px-4 text-sm text-zinc-500">hoặc</Text>
            <Separator className="flex-1 bg-zinc-700" />
          </View>

          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
