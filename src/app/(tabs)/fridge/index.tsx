import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function FridgeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold text-caption text-config-orange">Tủ lạnh Ảo</Text>
      <Text className="mt-2 text-gray-500">Chứa thực phẩm, siu</Text>
    </View>
  );
}
