import { useRouter } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { Image } from '@/components/ui';
import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import { ROUTE } from '@/constants/route';
import { useDishDetail } from '@/lib/hooks/use-dish-detail';
import {
  type IIngredient,
  type IMissingIngredient,
} from '@/models/interfaces/ingredient';
import { type RecommendationMeal } from '@/models/interfaces/recommendation';

type IngredientRow = {
  id: number;
  name: string;
  quantity?: string;
  isMissing: boolean;
};

const normalizeId = (value: string | number): number | null => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

const getMissingIngredients = (
  meal: RecommendationMeal
): IMissingIngredient[] => meal.missingIngredient ?? [];

enum Unit {
  GAM = 'gam',
  NUMBER = 'quả/củ',
}

const formatMissingQuantity = (ingredient: IMissingIngredient): string =>
  `${ingredient.quantity} ${Unit[ingredient.unit] ?? ''}`.trim();

interface MealItemProps {
  meal: RecommendationMeal;
  ingredientsById?: Record<number, IIngredient>;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const MealItem = memo(
  ({ meal, ingredientsById, isSelected, onSelect }: MealItemProps) => {
    const router = useRouter();
    const dishId = normalizeId(meal.dishId);
    const { dish, isLoading } = useDishDetail(dishId ?? meal.dishId);
    const missingIngredients = useMemo(
      () => getMissingIngredients(meal),
      [meal]
    );

    const ingredientRows = useMemo<IngredientRow[]>(() => {
      const rows = new Map<string, IngredientRow>(); // key = name

      for (const missing of missingIngredients) {
        const name =
          ingredientsById?.[missing.ingredientId]?.name ??
          `Nguyên liệu #${missing.ingredientId}`;
        if (!rows.has(name)) {
          rows.set(name, {
            id: missing.ingredientId,
            name,
            quantity: formatMissingQuantity(missing),
            isMissing: true,
          });
        }
      }

      for (const ingredient of dish?.ingredients ?? []) {
        const name =
          ingredient.ingredient?.name ?? `Nguyên liệu #${ingredient.id}`;
        if (rows.has(name)) continue;
        rows.set(name, {
          id: ingredient.id,
          name,
          quantity: ingredient.quantity,
          isMissing: false,
        });
      }

      return Array.from(rows.values());
    }, [dish?.ingredients, ingredientsById, missingIngredients]);

    const hasMissingIngredients = ingredientRows.some(
      (ingredient) => ingredient.isMissing
    );

    const availableIngredients = ingredientRows.filter(
      (ingredient) => !ingredient.isMissing
    );
    const missingIngredientRows = ingredientRows.filter(
      (ingredient) => ingredient.isMissing
    );

    return (
      <Pressable
        onPress={onSelect}
        disabled={!onSelect}
        className="rounded-xl border p-3"
        style={{
          backgroundColor: isSelected ? colors.success[50] : colors.white,
          borderColor: isSelected
            ? colors.voca.primary
            : hasMissingIngredients
              ? '#FCA5A5'
              : '#E5E7EB',
        }}
      >
        <View className="flex-row gap-3">
          <View
            className="size-12 items-center justify-center rounded-lg"
            style={{ backgroundColor: '#DADCE0' }}
          >
            <Image source={dish?.images} className="rounded-xs size-full" />
          </View>

          <View className="flex-1">
            <View className="flex-row items-start justify-between gap-2">
              <Pressable
                disabled={!dishId}
                onPress={() => {
                  if (!dishId) return;
                  router.push({
                    pathname: ROUTE.STACK.DISCOVER.DISH_DETAIL,
                    params: { id: String(dishId) },
                  });
                }}
                className="flex-1"
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color: colors.voca.black }}
                >
                  {dish?.name ??
                    (isLoading
                      ? 'Đang tải món ăn...'
                      : `Món ăn #${meal.dishId}`)}
                </Text>
              </Pressable>
              {typeof dish?.calories === 'number' ? (
                <Text
                  className="text-right text-xs"
                  style={{ color: colors.voca.black }}
                >
                  {Math.round(dish.calories)}
                  {'\n'}kcal
                </Text>
              ) : null}
            </View>

            <View className="mt-2 flex-row flex-wrap items-center gap-2">
              {availableIngredients.length > 0 ? (
                <Text
                  className="text-xs font-semibold"
                  style={{ color: colors.voca.green }}
                >
                  Sẵn có
                </Text>
              ) : null}

              {availableIngredients.map((ingredient) => (
                <IngredientChip
                  key={ingredient.id}
                  ingredient={ingredient}
                  onPress={() =>
                    router.push({
                      pathname: ROUTE.STACK.DISCOVER.INGREDIENT_DETAIL,
                      params: { id: String(ingredient.id) },
                    })
                  }
                />
              ))}
            </View>

            {hasMissingIngredients ? (
              <Text
                className="mt-1 text-xs font-semibold"
                style={{ color: colors.voca.red }}
              >
                Còn thiếu
              </Text>
            ) : null}
            {missingIngredientRows.length > 0 ? (
              <View className="mt-1 flex-row flex-wrap items-center gap-2">
                {missingIngredientRows.map((ingredient) => (
                  <IngredientChip
                    key={ingredient.id}
                    ingredient={ingredient}
                    onPress={() =>
                      router.push({
                        pathname: ROUTE.STACK.DISCOVER.INGREDIENT_DETAIL,
                        params: { id: String(ingredient.id) },
                      })
                    }
                  />
                ))}
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  }
);

MealItem.displayName = 'MealItem';

const IngredientChip = ({
  ingredient,
  onPress,
}: {
  ingredient: IngredientRow;
  onPress: () => void;
}) => {
  const color = ingredient.isMissing ? colors.voca.red : colors.voca.green;
  const backgroundColor = ingredient.isMissing
    ? colors.voca.redLight
    : colors.voca.greenLight;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center rounded-full px-2 py-0.5"
      style={{ backgroundColor }}
    >
      <Text className="ml-1 text-[10px] font-medium" style={{ color }}>
        {ingredient.name}
        {ingredient.quantity ? ` (${ingredient.quantity})` : ''}
      </Text>
    </Pressable>
  );
};
