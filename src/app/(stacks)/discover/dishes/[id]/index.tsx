import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';

import {
  ActivityIndicator,
  NutritionItem,
  Pressable,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { fallbackIngredients } from '@/constants/common';
import { useDishDetail } from '@/lib/hooks/use-dish-detail';

import { DetailFooterActions } from './_components/detail-footer-actions';
import { DishImageCarousel } from './_components/dish-image-carousel';
import { DishInfoCards } from './_components/dish-info-cards';
import { IngredientSection } from './_components/ingredient-section';
import { InstructionSteps } from './_components/instruction-steps';

export default function DishDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const [hasExpanded, setHasExpanded] = useState(true);
  const [missingExpanded, setMissingExpanded] = useState(true);
  const normalizedDishId = useMemo(
    () => (Array.isArray(id) ? (id[0] ?? '') : (id ?? '')),
    [id]
  );
  const { dish, isLoading, error, refetch } = useDishDetail(normalizedDishId);

  const ingredientData = useMemo(() => {
    const apiIngredients = dish?.ingredients ?? [];
    const normalizedIngredients = apiIngredients
      .map((item) => {
        const name = item.name ?? item.ingredient?.name ?? '';
        const quantity = item.quantity ?? '';

        return {
          ...item,
          name,
          quantity,
          isAvailable: item.isAvailable ?? false,
        };
      })
      .filter(
        (item) => item.name.trim().length > 0 && item.quantity.trim().length > 0
      );

    if (normalizedIngredients.length > 0) {
      return normalizedIngredients;
    }

    return fallbackIngredients;
  }, [dish?.ingredients]);

  const { availableIngredients, missingIngredients } = useMemo(() => {
    const ingredients = ingredientData;
    const available = ingredients.filter((item) => item.isAvailable);
    const missing = ingredients.filter((item) => !item.isAvailable);

    return {
      availableIngredients: available,
      missingIngredients: missing,
    };
  }, [ingredientData]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: dish?.name ?? 'Chi tiết món ăn',
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
      },
    });
  }, [dish?.name, navigation]);

  if (isLoading && !dish) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!dish || error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-10">
        <Text className="text-center text-body-m text-danger-600">
          Không thế kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng và thử
          lại.
        </Text>
        <Pressable
          onPress={refetch}
          className="mt-4 rounded-xl bg-primary-700 px-6 py-3"
        >
          <Text className="text-body-L font-semibold text-white">Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 96 }}
      >
        <DishImageCarousel images={dish.images || []} />

        <Text className="mt-5 !text-h3 text-foreground">Tổng quan</Text>
        <Text className="mt-2 text-body-m text-neutral-700">
          {dish.description || 'Chưa có mô tả'}
        </Text>

        <View className="mt-4">
          <DishInfoCards
            prepTimeMin={dish.prepTimeMin}
            cookTimeMin={dish.cookTimeMin}
            difficulty={dish.difficulty}
          />
        </View>

        <Text className="mt-6 !text-h3 text-foreground">Dinh dưỡng</Text>
        <View className="mt-2 flex-row items-center justify-between rounded-xl bg-primary-50 px-3 py-2">
          <Text className="text-body-m font-medium text-primary-700">
            Calories
          </Text>
          <Text className="text-body-m font-semibold text-primary-700">
            {dish.calories ?? 0} kcal
          </Text>
        </View>
        <NutritionItem protein={28} carb={12} fat={18} className="mt-3" />
        <Text className="mt-2 text-label text-neutral-700">
          Lưu ý: Giá trị dinh dưỡng và calories được tính trên 100g thực phẩm.
        </Text>

        <Text className="mb-3 mt-6 !text-h3 text-foreground">Nguyên liệu</Text>
        <View className="gap-3">
          <IngredientSection
            title="Sẵn có"
            items={availableIngredients}
            expanded={hasExpanded}
            onToggle={() => setHasExpanded((prev) => !prev)}
            tone="secondary"
          />

          <IngredientSection
            title="Thiếu"
            items={missingIngredients}
            expanded={missingExpanded}
            onToggle={() => setMissingExpanded((prev) => !prev)}
            tone="danger"
          />
        </View>

        <Text className="mb-3 mt-6 !text-h3 text-foreground">Chi tiết</Text>
        <InstructionSteps instructions={dish.instructions || []} />
      </ScrollView>

      <DetailFooterActions />
    </View>
  );
}
