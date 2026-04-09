import { useRouter } from 'expo-router';
import * as React from 'react';
import { type TextStyle, View } from 'react-native';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { ROUTE } from '@/constants/route';
import { useAuth } from '@/lib/auth';
import { useSendVerificationEmailMutation } from '@/lib/hooks/queries/auth.query';

const RESEND_CODE_INTERVAL_SECONDS = 30;
const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const router = useRouter();
  const user = useAuth((state) => state.userInfor);
  const { countdown, restartCountdown } = useCountdown(
    RESEND_CODE_INTERVAL_SECONDS
  );

  const sendVerificationEmailMutation =
    useSendVerificationEmailMutation(restartCountdown);

  const isResendDisabled =
    countdown > 0 || sendVerificationEmailMutation.isPending;

  function onResendEmail() {
    sendVerificationEmailMutation.mutate();
  }

  function onContinue() {
    router.replace(ROUTE.AUTH.ONBOARDING);
  }

  function onCancel() {
    router.replace(ROUTE.AUTH.SIGNIN);
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-200 bg-white pb-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-zinc-900 sm:text-left">
            Xác thực email
          </CardTitle>
          <CardDescription className="text-center text-zinc-500 sm:text-left">
            Chúng tôi đã gửi liên kết xác thực đến{' '}
            <Text className="font-medium text-zinc-900">
              {user?.email ?? 'địa chỉ email của bạn'}
            </Text>
            . Vui lòng mở email và nhấn vào liên kết xác thực.
          </CardDescription>
        </CardHeader>

        <CardContent className="gap-6">
          <View className="gap-6">
            <View className="gap-3">
              <Button
                variant="outline"
                className="w-full border-zinc-300 bg-white"
                disabled={isResendDisabled}
                onPress={onResendEmail}
              >
                <Text className="text-zinc-900">
                  {sendVerificationEmailMutation.isPending
                    ? 'Đang gửi...'
                    : `Gửi lại email xác thực${countdown > 0 ? ` (${countdown})` : ''}`}
                </Text>
              </Button>

              <Text className="text-center text-xs text-zinc-500">
                Không nhận được email? Hãy kiểm tra thư mục spam hoặc gửi lại
                email mới.
              </Text>

              {countdown > 0 ? (
                <Text
                  className="text-center text-xs text-zinc-500"
                  style={TABULAR_NUMBERS_STYLE}
                >
                  Bạn có thể gửi lại sau {countdown} giây
                </Text>
              ) : null}
            </View>

            <View className="gap-3">
              <Button className="w-full bg-orange-500" onPress={onContinue}>
                <Text className="font-medium text-white">Tiếp tục</Text>
              </Button>

              <Button variant="link" className="mx-auto" onPress={onCancel}>
                <Text className="text-orange-500">Quay lại đăng nhập</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
  );
}

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}