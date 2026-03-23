import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function AddIngredientScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Thêm nguyên liệu</Text>
      <Text className="mt-2 text-gray-500">
        Thêm nguyên liệu mới vào tủ lạnh của bạn
      </Text>
    </View>
  );
}
