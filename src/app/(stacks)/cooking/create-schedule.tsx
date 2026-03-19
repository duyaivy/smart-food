import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function CreateScheduleScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Tạo lịch nấu ăn</Text>
      <Text className="mt-2 text-gray-500">
        Lên kế hoạch bữa ăn theo ngày/tuần của bạn
      </Text>
    </View>
  );
}
