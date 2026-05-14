import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useMemo } from 'react';
import { Platform, TouchableOpacity } from 'react-native';

import { ActivityIndicator, ScrollView, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';
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
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) router.back();
            else router.push(ROUTE.TAB.FRIDGE);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ paddingHorizontal: Platform.OS === 'ios' ? 0 : 4 }}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ChevronLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
      ),
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
