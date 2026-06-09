import { useLocalSearchParams } from 'expo-router';
import { Quote } from 'lucide-react-native';
import React from 'react';
import { Image, ScrollView, View } from 'react-native';

import { FocusAwareStatusBar, Text } from '@/components/ui';
import { Card, CardContent } from '@/components/ui/card';
import { MacroBadge } from '@/components/ui/macro-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMealHistoryDetailQuery } from '@/lib/hooks/queries/meal.query';

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: 'Sáng',
  LUNCH: 'Trưa',
  DINNER: 'Tối',
};

const mealTypeGradients: Record<string, string> = {
  BREAKFAST: 'bg-amber-500',
  LUNCH: 'bg-green-500',
  DINNER: 'bg-indigo-500',
};

const formatVietnameseDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const weekdays = [
    'Chủ nhật',
    'Thứ 2',
    'Thứ 3',
    'Thứ 4',
    'Thứ 5',
    'Thứ 6',
    'Thứ 7',
  ];
  const weekday = weekdays[date.getDay()];
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${weekday}, ${day}/${month}/${year} lúc ${hours}:${minutes}`;
};

export default function MealDetailScreen() {
  const { mealLogId } = useLocalSearchParams<{ mealLogId: string }>();
  const id = parseInt(mealLogId, 10);
  const { data, isLoading } = useGetMealHistoryDetailQuery(id);

  const meal = data?.data;

  if (isLoading) {
    return (
      <View className="flex-1 gap-4 p-4">
        <FocusAwareStatusBar />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Không tìm thấy bữa ăn</Text>
      </View>
    );
  }

  const mealType = meal.mealType || 'UNKNOWN';
  const typeLabel = mealTypeLabels[mealType] || 'Bữa ăn';
  const gradientColor = mealTypeGradients[mealType] || 'bg-neutral-500';
  const mealName = meal.dish?.name || meal.customName || 'Bữa ăn tự chọn';
  const firstImage = meal.dish?.images?.[0];
  const formattedDate = formatVietnameseDateTime(
    meal.eatenAt || meal.createdAt
  );

  return (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <FocusAwareStatusBar />

      {/* Hero section */}
      <View className="relative h-56 bg-neutral-200">
        {firstImage ? (
          <Image
            source={{ uri: firstImage }}
            className="size-full"
            resizeMode="cover"
          />
        ) : (
          <View className={`size-full ${gradientColor}`} />
        )}
        <View className="absolute inset-0 justify-end bg-black/40 p-5">
          <View className="mb-1 flex-row items-center gap-2">
            <View className="rounded-full bg-white/20 px-2 py-0.5">
              <Text className="text-xs font-medium text-white">
                {typeLabel}
              </Text>
            </View>
          </View>
          <Text className="text-2xl font-bold text-white">{mealName}</Text>
          <Text className="mt-1 text-sm text-white/80">{formattedDate}</Text>
        </View>
      </View>

      {/* Nutrition summary */}
      <Card className="mx-4 mt-4">
        <CardContent className="py-4">
          <View className="flex-row gap-2">
            <MacroBadge
              label="Calories"
              value={meal.totalKcal ? Math.round(meal.totalKcal) : undefined}
              color="text-orange-600"
            />
            <MacroBadge
              label="Protein"
              value={meal.totalProtein || undefined}
              color="text-blue-600"
            />
            <MacroBadge
              label="Carb"
              value={meal.totalCarb || undefined}
              color="text-green-600"
            />
            <MacroBadge
              label="Fat"
              value={meal.totalFat || undefined}
              color="text-yellow-600"
            />
          </View>
        </CardContent>
      </Card>

      {/* Note */}
      {meal.note && (
        <Card className="mx-4 mt-4">
          <CardContent className="flex-row items-start gap-3 py-3">
            <Quote size={20} className="text-muted-foreground mt-0.5" />
            <Text className="text-muted-foreground flex-1 italic">
              {meal.note}
            </Text>
          </CardContent>
        </Card>
      )}

      {/* Ingredients section */}
      <View className="mb-4 mt-6 px-4">
        <Text className="mb-3 text-lg font-semibold">Nguyên liệu đã dùng</Text>
        {meal.snapshots?.map((ingredient) => (
          <View
            key={ingredient.id}
            className="flex-row items-center justify-between border-b border-border py-2"
          >
            <View className="flex-1">
              <Text className="font-medium">{ingredient.ingredientName}</Text>
              <Text className="text-muted-foreground text-xs">
                {ingredient.amount} {ingredient.unit}
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm">
              {ingredient.kcal ? Math.round(ingredient.kcal) : 0} kcal
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
