import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';

export const EmptyDayState = () => (
  <View className="mt-6 px-6">
    <View
      className="rounded-2xl border p-4"
      style={{
        borderColor: '#DADCE0',
        backgroundColor: colors.white,
      }}
    >
      <Text
        className="text-base font-bold"
        style={{ color: colors.voca.black }}
      >
        Chưa có thực đơn
      </Text>
      <Text className="mt-1 text-sm" style={{ color: colors.voca.grey }}>
        Hệ thống chưa tìm được thực đơn phù hợp cho ngày này. Vui lòng thử lại
        sau.
      </Text>
    </View>
  </View>
);
