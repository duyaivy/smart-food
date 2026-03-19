import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function IngredientDetailScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chi tiết nguyên liệu</Text>
      <Text className="mt-2 text-gray-500">
        Thông tin chi tiết về nguyên liệu này
      </Text>
    </View>
  );
}
