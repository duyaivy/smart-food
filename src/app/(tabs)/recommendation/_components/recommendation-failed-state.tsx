import React from 'react';
import { Image, View } from 'react-native';

import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';

import { RecommendationResetButton } from './recommendation-reset-button';

const AVOCADO_FAILED = require('@assets/images/voca_failed.png');
const FALLBACK_MESSAGE =
  'Kết nối đến máy chủ bị gián đoạn, vui lòng kiểm tra lại 4G/wifi và thử lại';

type Props = {
  message?: string | null;
  onReset: () => void;
};

export const RecommendationFailedState = ({ message, onReset }: Props) => (
  <View className="flex-1 justify-center px-6">
    <View className="items-center gap-4">
      <Text
        className="text-center text-2xl font-bold"
        style={{ color: colors.voca.red }}
      >
        Không thể tạo thực đơn
      </Text>
      <Image
        source={AVOCADO_FAILED}
        style={{ width: 150, height: 150 }}
        resizeMode="contain"
      />

      <Text
        className="mx-4 text-justify  leading-5"
        style={{ color: colors.voca.grey }}
      >
        Chi tiết: {message?.trim() ? message : FALLBACK_MESSAGE}
      </Text>

      <View className="w-full">
        <RecommendationResetButton onPress={onReset} />
      </View>
    </View>
  </View>
);
