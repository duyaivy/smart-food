import { useRouter } from 'expo-router';
import { ChevronDown, type LucideIcon } from 'lucide-react-native';
import React, { memo, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { Image } from '@/components/ui';
import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import { ICON_SIZE_MEDIUM } from '@/constants/common';
import { ROUTE } from '@/constants/route';
import { showMessage } from '@/lib/common/show-message';
import { useCreateMealMutation } from '@/lib/hooks/queries/meal.query';
import { useDishDetail } from '@/lib/hooks/use-dish-detail';
import {
  type IIngredient,
  type IMissingIngredient,
} from '@/models/interfaces/ingredient';
import { type RecommendationMeal } from '@/models/interfaces/recommendation';

import { DishSwapModal } from './dish-swap-modal';

interface MealSectionProps {
  title: string;
  Icon: LucideIcon;
  iconColor: string;
  meals: RecommendationMeal[];
  ingredientsById: Record<number, IIngredient>;
  backgroundColor?: string;
  borderColor?: string;
  day: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
}

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

export const MealSection = ({
  title,
  Icon,
  iconColor,
  meals,
  ingredientsById,
  borderColor = colors.voca.green,
  backgroundColor = '#F3FBF4',
  day,
  mealType,
}: MealSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState(false);
  const { mutateAsync: createMeal, isPending: isCreating } =
    useCreateMealMutation();

  const handleCookNow = async () => {
    if (meals.length === 0) return;
    try {
      await Promise.all(
        meals.map((m) =>
          createMeal({
            dishId: Number(m.dishId),
            mealType,
            eatenAt: new Date(),
            missingIngredientIds: m.missingIngredient?.map(
              (i) => i.ingredientId
            ),
          })
        )
      );
      showMessage({
        message: 'Đã ghi lại bữa ăn thành công!',
        type: 'success',
      });
    } catch {
      showMessage({
        message: 'Không thể ghi lại bữa ăn. Thử lại sau.',
        type: 'error',
      });
    }
  };

  return (
    <View
      className="overflow-hidden rounded-2xl border"
      style={{
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
    >
      <Pressable
        onPress={() => setIsExpanded((current) => !current)}
        className="flex-row items-center justify-between px-4 py-3"
      >
        <View className="flex-row items-center gap-3">
          <Icon size={ICON_SIZE_MEDIUM} color={iconColor} />
          <Text
            className="text-base font-bold"
            style={{ color: colors.voca.black }}
          >
            {title}
          </Text>
        </View>
        <ChevronDown
          size={ICON_SIZE_MEDIUM}
          color={colors.voca.grey}
          style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}
        />
      </Pressable>

      {isExpanded ? (
        <View className="gap-3 px-3 pb-3">
          {meals.length > 0 ? (
            meals.map((meal, index) => (
              <MealItem
                key={`${meal.role}-${meal.dishId}-${index}`}
                meal={meal}
                ingredientsById={ingredientsById}
              />
            ))
          ) : (
            <Text className="text-sm" style={{ color: colors.voca.grey }}>
              Chưa có món ăn cho bữa này.
            </Text>
          )}

          <View className="flex-row gap-3 pt-1">
            <Pressable
              onPress={() => setIsSwapModalVisible(true)}
              className="flex-1 items-center rounded-xl border py-3"
              style={{ borderColor: colors.voca.red }}
            >
              <Text className="font-bold" style={{ color: colors.voca.red }}>
                Món khác
              </Text>
            </Pressable>
            <Pressable
              onPress={handleCookNow}
              disabled={isCreating}
              className="flex-1 items-center rounded-xl py-3"
              style={{
                backgroundColor: colors.voca.secondary,
                opacity: isCreating ? 0.7 : 1,
              }}
            >
              {isCreating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="font-bold text-white">Nấu ăn ngay</Text>
              )}
            </Pressable>
          </View>
        </View>
      ) : null}

      <DishSwapModal
        visible={isSwapModalVisible}
        onClose={() => setIsSwapModalVisible(false)}
        meals={meals}
        day={day}
        mealType={mealType}
        ingredientsById={ingredientsById}
      />
    </View>
  );
};

const MealItem = memo(
  ({
    meal,
    ingredientsById,
  }: {
    meal: RecommendationMeal;
    ingredientsById: Record<number, IIngredient>;
  }) => {
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
          ingredientsById[missing.ingredientId]?.name ??
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
      <View
        className="rounded-xl border p-3"
        style={{
          backgroundColor: colors.white,
          borderColor: hasMissingIngredients ? '#FCA5A5' : '#E5E7EB',
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
      </View>
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
