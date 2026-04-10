import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useMemo } from 'react';

import { ActivityIndicator, ScrollView, View } from '@/components/ui';
import { useIngredient } from '@/lib/hooks/use-ingredient';

import { IngredientDescription } from './_components/ingredient-description';
import { IngredientHero } from './_components/ingredient-hero';
import { IngredientNutritionBoard } from './_components/ingredient-nutrition-board';
import { IngredientUnitInfo } from './_components/ingredient-unit-info';

export default function IngredientDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string | string[] }>();

  const normalizedId = useMemo(() => {
    const raw = Array.isArray(id) ? (id[0] ?? '') : (id ?? '');
    return parseInt(raw, 10);
  }, [id]);

  const { ingredient } = useIngredient(normalizedId);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: ingredient?.name ?? 'Chi tiết nguyên liệu',
      headerTitleAlign: 'center',
      headerShadowVisible: false,
      headerTitleStyle: { fontSize: 18, fontWeight: '600' },
    });
  }, [ingredient?.name, navigation]);

  if (!ingredient) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <IngredientHero ingredient={ingredient} />

        <View className="px-4">
          <IngredientNutritionBoard ingredient={ingredient} />
          <IngredientDescription description={ingredient.description} />
          <IngredientUnitInfo unit={ingredient.unit} />
        </View>
      </ScrollView>
    </View>
  );
}
