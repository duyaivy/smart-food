import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';
import { type z } from 'zod';

import { SocialConnections } from '@/app/(stacks)/auth/_components/social-connections';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ControlledInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { ROUTE } from '@/constants/route';
import { useSignInMutation } from '@/lib/hooks/queries/auth.query';
import { LoginSchema } from '@/schemas/login.schema';

type SignInFormValues = z.infer<typeof LoginSchema>;

export function SignInForm() {
  const router = useRouter();
  const passwordInputRef = React.useRef<TextInput>(null);

  const signInMutation = useSignInMutation(router);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onEmailSubmitEditing() {
    passwordInputRef.current?.focus();
  }

  function onSubmit(values: SignInFormValues) {
    signInMutation.mutate({
      email: values.email,
      password: values.password,
    });
  }

  return (
    <View className="gap-6 bg-white">
      <Card className="border-zinc-200 bg-white shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-zinc-900 sm:text-left">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-zinc-500 sm:text-left">
            Chào mừng bạn quay lại. Vui lòng đăng nhập để tiếp tục
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email" className="!text-zinc-700">
                Email
              </Label>

              <ControlledInput
                control={control}
                name="email"
                id="email"
                className="border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400"
                placeholder="m@example.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={onEmailSubmitEditing}
                error={errors.email?.message}
              />
            </View>

            <View className="gap-1.5">
              <View className="flex-row items-center">
                <Label htmlFor="password" className="!text-zinc-700">
                  Mật khẩu
                </Label>
                <Button
                  variant="link"
                  size="sm"
                  className="ml-auto h-4 px-1 py-0 web:h-fit sm:h-4"
                  onPress={() => router.push(ROUTE.AUTH.FORGOT_PASSWORD)}
                >
                  <Text className="font-normal leading-4 text-orange-500">
                    Quên mật khẩu?
                  </Text>
                </Button>
              </View>

              <ControlledInput
                control={control}
                name="password"
                id="password"
                className="border-zinc-300 bg-white text-zinc-900"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
                error={errors.password?.message}
              />
            </View>

            <Button
              className="w-full bg-orange-500"
              onPress={handleSubmit(onSubmit)}
              loading={signInMutation.isPending}
            >
              <Text className="font-medium text-white">
                {signInMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </Button>
          </View>

          <View className="flex flex-row items-center justify-center">
            <Text className="text-center text-sm text-zinc-500">
              Chưa có tài khoản?{' '}
            </Text>
            <Pressable onPress={() => router.push(ROUTE.AUTH.SIGN_UP)}>
              <Text className="text-sm text-orange-500 underline underline-offset-4">
                Đăng ký
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