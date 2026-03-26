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
import { useRouter } from 'expo-router';
import * as React from 'react';
import { Alert, type TextStyle, View } from 'react-native';

const RESEND_CODE_INTERVAL_SECONDS = 30;
const TABULAR_NUMBERS_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

export function VerifyEmailForm() {
  const router = useRouter();
  const user = useAuth((state) => state.user);
  const sendVerificationEmailMutation = useSendVerificationEmailMutation();
  const { countdown, restartCountdown } = useCountdown(RESEND_CODE_INTERVAL_SECONDS);

  const isResendDisabled = countdown > 0 || sendVerificationEmailMutation.isPending;

  async function onResendEmail() {
    try {
      await sendVerificationEmailMutation.mutateAsync();
      restartCountdown();

      Alert.alert(
        'Đã gửi lại email',
        'Vui lòng kiểm tra hộp thư của bạn và nhấn vào liên kết xác thực email.'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể gửi lại email xác thực. Vui lòng thử lại.';
      Alert.alert('Gửi lại email thất bại', message);
    }
  }

  function onContinue() {
    router.replace(ROUTE.AUTH.ONBOARDING);
  }

  function onCancel() {
    router.replace(ROUTE.AUTH.SIGNIN);
  }

  return (
    <View className="gap-6">
      <Card className="border-zinc-800 bg-zinc-900 pb-4 shadow-none">
        <CardHeader>
          <CardTitle className="text-center text-xl text-white sm:text-left">
            Xác thực email
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 sm:text-left">
            Chúng tôi đã gửi liên kết xác thực đến{' '}
            <Text className="font-medium text-white">
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
                className="w-full border-zinc-700 bg-zinc-800"
                disabled={isResendDisabled}
                onPress={onResendEmail}
              >
                <Text className="text-white">
                  {sendVerificationEmailMutation.isPending
                    ? 'Đang gửi...'
                    : `Gửi lại email xác thực${countdown > 0 ? ` (${countdown})` : ''}`}
                </Text>
              </Button>

              <Text className="text-center text-xs text-zinc-500">
                Không nhận được email? Hãy kiểm tra thư mục spam hoặc gửi lại email mới.
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
              <Button className="w-full bg-white" onPress={onContinue}>
                <Text className="font-medium text-black">Tiếp tục</Text>
              </Button>

              <Button variant="link" className="mx-auto" onPress={onCancel}>
                <Text className="text-blue-400">Quay lại đăng nhập</Text>
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