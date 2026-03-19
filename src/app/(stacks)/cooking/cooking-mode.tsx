import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function CookingModeScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chế độ nấu ăn</Text>
      <Text className="mt-2 text-gray-500">
        Hướng dẫn từng bước để nấu món ăn của bạn
      </Text>
    </View>
  );
}
