import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Home</Text>
      <Text className="mt-2 text-gray-500">
        Chào mừng bạn đến với Smart Food
      </Text>
    </View>
  );
}
