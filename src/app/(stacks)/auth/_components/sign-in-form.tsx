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
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, type TextInput, View } from 'react-native';
import { z } from 'zod';

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
    <View className="gap-6">
      <Card className="border-zinc-800 bg-zinc-900 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white sm:text-left">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 sm:text-left">
            Chào mừng bạn quay lại. Vui lòng đăng nhập để tiếp tục
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-1.5">
              <Label htmlFor="email" className="!text-zinc-200">
                Email
              </Label>

              <ControlledInput
                control={control}
                name="email"
                id="email"
                className="border-zinc-700 bg-zinc-800  text-white"
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
                <Label htmlFor="password" className="!text-zinc-200">
                  Mật khẩu
                </Label>
                <Button
                  variant="link"
                  size="sm"
                  className="web:h-fit ml-auto h-4 px-1 py-0 sm:h-4"
                  onPress={() => router.push(ROUTE.AUTH.FORGOT_PASSWORD)}
                >
                  <Text className="font-normal leading-4 text-blue-400">
                    Quên mật khẩu?
                  </Text>
                </Button>
              </View>

              <ControlledInput
                control={control}
                name="password"
                id="password"
                className="border-zinc-700 bg-zinc-800 text-white"
                secureTextEntry
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
                error={errors.password?.message}
              />
            </View>

            <Button
              className="w-full bg-white"
              onPress={handleSubmit(onSubmit)}
              loading={signInMutation.isPending}
            >
              <Text className="font-medium text-black">
                {signInMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </Text>
            </Button>
          </View>

          <Text className="text-center text-sm text-zinc-400">
            Chưa có tài khoản?{' '}
            <Pressable onPress={() => router.push(ROUTE.AUTH.SIGN_UP)}>
              <Text className="text-sm text-blue-400 underline underline-offset-4">
                Đăng ký
              </Text>
            </Pressable>
          </Text>

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
