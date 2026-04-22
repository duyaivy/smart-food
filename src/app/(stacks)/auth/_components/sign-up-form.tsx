import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';
import { z } from 'zod';

import { SocialConnections } from '@/app/(stacks)/auth/_components/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { ROUTE } from '@/constants/route';
import { useSignUpMutation } from '@/lib/hooks/queries/auth.query';
import { signupSchema } from '@/schemas/signup.schema';

const ICON_SIZE_SMALL = 14;

const signupWithLegalSchema = z.object({
  name: signupSchema.innerType().shape.name,
  email: signupSchema.innerType().shape.email,
  password: signupSchema.innerType().shape.password,
  confirmPassword: signupSchema.innerType().shape.confirmPassword,
  acceptedLegal: z.literal(true, {
    errorMap: () => ({
      message: 'Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật.',
    }),
  }),
});

type SignupWithLegalSchemaType = z.infer<typeof signupWithLegalSchema>;

export function SignUpForm() {
  const router = useRouter();
  const passwordInputRef = React.useRef<TextInput>(null);
  const confirmPasswordInputRef = React.useRef<TextInput>(null);

  const signUpMutation = useSignUpMutation(router);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupWithLegalSchemaType>({
    resolver: zodResolver(signupWithLegalSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptedLegal: undefined,
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

  function handleOpenLegal() {
    router.push(ROUTE.STACK.PROFILE.PRIVACY as never);
  }

  function onSubmit(values: SignupWithLegalSchemaType) {
    signUpMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
    });
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-200 bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-zinc-900 sm:text-left">
            Tạo tài khoản
          </CardTitle>
          <CardDescription className="text-center text-zinc-500 sm:text-left">
            Nhập thông tin bên dưới để tạo tài khoản mới
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="name" className="text-zinc-700">
                Họ và tên
              </Label>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="name"
                    className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400"
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
              <Label htmlFor="email" className="text-zinc-700">
                Email
              </Label>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    id="email"
                    className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400"
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
              <Label htmlFor="password" className="text-zinc-700">
                Mật khẩu
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    className="border-zinc-300 bg-white text-zinc-900"
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
              <Label htmlFor="confirmPassword" className="text-zinc-700">
                Xác nhận mật khẩu
              </Label>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    ref={confirmPasswordInputRef}
                    id="confirmPassword"
                    className="border-zinc-300 bg-white text-zinc-900"
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

            <View className="gap-2">
              <Controller
                control={control}
                name="acceptedLegal"
                render={({ field: { onChange, value } }) => (
                  <Pressable
                    onPress={() => onChange(value ? undefined : true)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: !!value }}
                    className="flex-row items-start gap-3 rounded-xl p-3"
                  >
                    <View
                      className={`mt-0.5 size-5 items-center justify-center rounded border ${
                        value
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-zinc-300 bg-white'
                      }`}
                    >
                      {value ? (
                        <Icon
                          as={Check}
                          size={ICON_SIZE_SMALL}
                          className="text-white"
                        />
                      ) : null}
                    </View>

                    <Text className="flex-1 text-sm leading-5 text-zinc-700">
                      Tôi đồng ý với{' '}
                      <Text
                        onPress={handleOpenLegal}
                        className="text-orange-500 underline"
                      >
                        Điều khoản sử dụng và Chính sách bảo mật
                      </Text>
                    </Text>
                  </Pressable>
                )}
              />

              {errors.acceptedLegal?.message ? (
                <Text className="text-destructive text-sm">
                  {errors.acceptedLegal.message}
                </Text>
              ) : null}
            </View>

            <Button
              className="w-full bg-orange-500"
              onPress={handleSubmit(onSubmit)}
              loading={signUpMutation.isPending}
            >
              <Text className="font-medium text-white">
                {signUpMutation.isPending
                  ? 'Đang tạo tài khoản...'
                  : 'Tạo tài khoản'}
              </Text>
            </Button>
          </View>

          <View className="flex flex-row items-center justify-center">
            <Text className="text-center text-sm text-zinc-500">
              Đã có tài khoản?{' '}
            </Text>
            <Pressable onPress={() => router.push(ROUTE.AUTH.SIGNIN)}>
              <Text className="text-sm text-orange-500 underline underline-offset-4">
                Đăng nhập
              </Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <Separator className="flex-1 bg-zinc-200" />
            <Text className="px-4 text-sm text-zinc-400">hoặc</Text>
            <Separator className="flex-1 bg-zinc-200" />
          </View>

          <SocialConnections />
        </CardContent>
      </Card>
    </View>
  );
}
