import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function EditIngredientScreen() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chỉnh sửa nguyên liệu</Text>
      <Text className="mt-2 text-gray-500">
        Cập nhật thông tin nguyên liệu trong tủ lạnh
      </Text>
    </View>
  );
}
