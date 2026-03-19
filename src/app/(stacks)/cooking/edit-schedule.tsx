import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function EditScheduleScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chỉnh sửa lịch nấu ăn</Text>
      <Text className="mt-2 text-gray-500">
        Thay đổi kế hoạch bữa ăn của bạn
      </Text>
    </View>
  );
}
