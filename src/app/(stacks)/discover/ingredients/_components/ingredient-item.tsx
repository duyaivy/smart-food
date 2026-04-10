import { router } from 'expo-router';
import {
  Apple,
  Bean,
  Beef,
  Egg,
  Fish,
  Flame,
  Heart,
  Leaf,
  Shell,
  Wheat,
} from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Image, Text } from '@/components/ui';
import { MacroBadge } from '@/components/ui/macro-badge';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import { ICON_SIZE_MEDIUM } from '@/constants/common';
import { ROUTE } from '@/constants/route';
import { calcKcal } from '@/lib/utils/caculator';
import { type IIngredient } from '@/models/interfaces/ingredient';

const CATEGORY_CONFIG: Record<
  number,
  {
    label: string;
    Icon: React.FC<{ size: number; className?: string }>;
    color: string;
  }
> = {
  1: { label: 'Rau củ', Icon: Leaf, color: '#22c55e' },
  2: { label: 'Thịt tươi', Icon: Beef, color: '#ef4444' },
  3: { label: 'Hải sản', Icon: Fish, color: '#3b82f6' },
  4: { label: 'Trứng & sữa', Icon: Egg, color: '#eab308' },
  5: { label: 'Đậu & ngũ cốc', Icon: Bean, color: '#f97316' },
  6: { label: 'Gia vị', Icon: Flame, color: '#8b5cf6' },
  7: { label: 'Tinh bột', Icon: Wheat, color: '#fec76f' },
  8: { label: 'Trái cây', Icon: Apple, color: '#ef4444' },
};

const DEFAULT_CATEGORY = { label: 'Khác', Icon: Shell, color: '#6b7280' };

export const getCategoryConfig = (categoryId?: number) =>
  categoryId != null
    ? (CATEGORY_CONFIG[categoryId] ?? DEFAULT_CATEGORY)
    : DEFAULT_CATEGORY;

type Props = {
  ingredient: IIngredient;
};

const IngredientItem = ({ ingredient }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { color, Icon } = getCategoryConfig(ingredient.categoryId);

  const handlePress = () => {
    router.push({
      pathname: ROUTE.STACK.DISCOVER.INGREDIENT_DETAIL,
      params: { id: ingredient.id.toString() },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mx-1 mb-3 flex-1 overflow-hidden rounded-xl border border-secondary-200 bg-white"
    >
      {/* Image */}
      <View className="relative h-36 w-full">
        <Image
          source={{ uri: ingredient.images?.[0] }}
          className="size-full"
          cachePolicy="memory-disk"
        />
        {/* Calories badge */}
        <View className="absolute left-2 top-2 flex-row items-center gap-1 rounded-full bg-black/50 px-2 py-0.5">
          <Flame size={10} className="text-orange-300" />
          <Text className="text-sm font-medium text-white">
            {calcKcal(ingredient.carb, ingredient.protein, ingredient.fat) ??
              '—'}{' '}
            kcal
          </Text>
        </View>
        <Toggle
          pressed={isFavorite}
          onPressedChange={setIsFavorite}
          size="sm"
          className="absolute right-2.5 top-3 flex items-center justify-center rounded-full bg-white/80 "
        >
          <ToggleIcon
            as={Heart}
            className={
              isFavorite
                ? 'size-4 fill-red-500 text-red-500'
                : 'size-4 text-neutral-400'
            }
          />
        </Toggle>
      </View>

      {/* Content */}
      <View className="gap-2 p-2.5">
        <View className="flex-row items-start justify-between gap-1">
          <Text
            className="flex-1 text-sm font-semibold leading-[18px] text-neutral-800"
            numberOfLines={2}
          >
            {ingredient.name}
          </Text>
          <View className=" flex-row items-center gap-0.5 rounded-full px-1.5 py-0.5">
            <Icon size={ICON_SIZE_MEDIUM} fill={color} />
          </View>
        </View>

        {/* Description */}
        {ingredient.description ? (
          <Text
            className="text-xs leading-16 text-neutral-600"
            numberOfLines={2}
          >
            {ingredient.description}
          </Text>
        ) : null}

        {/* Macro row */}
        <View className="flex-row gap-1">
          <MacroBadge
            label="Protein"
            value={ingredient.protein}
            color="text-secondary"
          />
          <MacroBadge
            label="Fat"
            value={ingredient.fat}
            color="text-yellow-500"
          />
          <MacroBadge
            label="Carbs"
            value={ingredient.carb}
            color="text-primary"
          />
        </View>
      </View>
    </Pressable>
  );
};

export default memo(IngredientItem);
