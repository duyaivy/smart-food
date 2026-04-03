import { FocusAwareStatusBar, Text, View } from '@/components/ui';

export default function IngredientList() {
  return (
    <View className="flex-1 p-4">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Danh sách nguyên liệu thô</Text>
      <Text className="mt-2 text-gray-500"></Text>
    </View>
  );
}
