import { useLocalSearchParams } from 'expo-router';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function IngredientDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // TODO: Replace with actual meal data fetching using `id`
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Chi tiết nguyên liệu</Text>
      <Text className="mt-2 text-gray-500">Ingredient ID: {id}</Text>
    </View>
  );
}
