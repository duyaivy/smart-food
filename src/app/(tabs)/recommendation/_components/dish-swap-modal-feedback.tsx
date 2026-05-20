import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Image, Text } from '@/components/ui';
import colors from '@/constants/colors';

const AVOCADO_LOADING = require('@assets/images/voca_loading.png');
const AVOCADO_FAILED = require('@assets/images/voca_failed.png');

const LOADING_DOT_DELAYS = [0, 200, 400] as const;
const SKELETON_ROW_KEYS = ['first-dish', 'second-dish'] as const;
const CONNECTION_ERROR_MESSAGE =
  'Kết nối đến máy chủ bị gián đoạn, vui lòng kiểm tra lại 4G/wifi và thử lại';
const UPDATE_ERROR_MESSAGE = 'Không thể cập nhật thực đơn, vui lòng thử lại';
const LOADING_DOT_FROM = {
  opacity: 0.3,
  scale: 0.8,
};
const LOADING_DOT_TO = {
  opacity: 1,
  scale: 1.5,
};

type ApiErrorLike = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

const getErrorMessage = (error: unknown, fallbackMessage: string): string => {
  if (!error || typeof error !== 'object') return fallbackMessage;

  const apiError = error as ApiErrorLike;
  return (
    apiError.response?.data?.message ?? apiError.message ?? fallbackMessage
  );
};

export const SwapModalLoadingState = memo(() => (
  <View className="flex-1 items-center justify-center px-6">
    <View className="w-full items-center gap-5">
      <Image
        source={AVOCADO_LOADING}
        contentFit="contain"
        style={styles.loadingMascot}
      />

      <Text
        className="text-center text-base font-semibold"
        style={styles.titleText}
      >
        Đang tìm món thay thế...
      </Text>

      <View className="mb-2 flex-row items-center justify-center gap-2">
        {LOADING_DOT_DELAYS.map((delay) => (
          <MotiView
            key={delay}
            from={LOADING_DOT_FROM}
            animate={LOADING_DOT_TO}
            transition={{
              type: 'timing',
              duration: 600,
              loop: true,
              repeatReverse: true,
              delay,
            }}
            className="size-2 rounded-full"
            style={styles.loadingDot}
          />
        ))}
      </View>

      <View className="w-full gap-3">
        {SKELETON_ROW_KEYS.map((rowKey) => (
          <View key={rowKey} className="w-full">
            <View
              className="flex-row items-center gap-3 rounded-xl p-3"
              style={styles.skeletonCard}
            >
              <Skeleton colorMode="light" width={40} height={40} radius={8} />
              <View className="flex-1 gap-2">
                <Skeleton
                  colorMode="light"
                  width="60%"
                  height={14}
                  radius={4}
                />
                <Skeleton
                  colorMode="light"
                  width="40%"
                  height={10}
                  radius={4}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  </View>
));

SwapModalLoadingState.displayName = 'SwapModalLoadingState';

interface SwapModalErrorStateProps {
  error: unknown;
}

export const SwapModalErrorState = memo(
  ({ error }: SwapModalErrorStateProps) => {
    const errorMessage = getErrorMessage(error, CONNECTION_ERROR_MESSAGE);

    return (
      <View className="flex-1 justify-center px-6">
        <View className="items-center gap-3">
          <Text
            className="text-center text-lg font-bold"
            style={styles.errorTitleText}
          >
            Không thể tải món thay thế
          </Text>

          <Image
            source={AVOCADO_FAILED}
            contentFit="contain"
            style={styles.errorMascot}
          />

          <Text
            className="text-center text-sm leading-5"
            style={styles.descriptionText}
          >
            {errorMessage}
          </Text>
        </View>
      </View>
    );
  }
);

SwapModalErrorState.displayName = 'SwapModalErrorState';

interface SwapUpdateErrorBannerProps {
  error: unknown;
}

export const SwapUpdateErrorBanner = memo(
  ({ error }: SwapUpdateErrorBannerProps) => {
    const errorMessage = getErrorMessage(error, UPDATE_ERROR_MESSAGE);

    return (
      <View className="border-t px-4 py-3" style={styles.footerBorder}>
        <View className="rounded-lg p-3" style={styles.updateErrorBox}>
          <Text
            className="text-center text-sm font-medium"
            style={styles.errorTitleText}
          >
            Lỗi cập nhật: {errorMessage}
          </Text>
        </View>
      </View>
    );
  }
);

SwapUpdateErrorBanner.displayName = 'SwapUpdateErrorBanner';

const styles = StyleSheet.create({
  loadingMascot: {
    width: 100,
    height: 120,
  },
  errorMascot: {
    width: 100,
    height: 100,
  },
  titleText: {
    color: colors.voca.black,
  },
  descriptionText: {
    color: colors.voca.grey,
  },
  errorTitleText: {
    color: colors.voca.red,
  },
  loadingDot: {
    backgroundColor: colors.voca.primary,
  },
  skeletonCard: {
    backgroundColor: `${colors.voca.grey}10`,
  },
  footerBorder: {
    borderTopColor: `${colors.voca.grey}20`,
  },
  updateErrorBox: {
    backgroundColor: `${colors.voca.red}10`,
  },
});
