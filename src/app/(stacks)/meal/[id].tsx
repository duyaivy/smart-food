import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: Replace with actual meal data fetching using `id`
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chi tiết món ăn</Text>
      <Text className="mt-2 text-gray-500">Meal ID: {id}</Text>
    </View>
  );
}
