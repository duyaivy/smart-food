import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Flame, Heart } from 'lucide-react-native';
import React, { memo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Image, Text } from '@/components/ui';
import { MacroBadge } from '@/components/ui/macro-badge';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import { getCategoryConfig, ICON_SIZE_MEDIUM } from '@/constants/common';
import { ROUTE } from '@/constants/route';
import { calcKcal } from '@/lib/utils/caculator';
import { type IIngredient } from '@/models/interfaces/ingredient';

type Props = {
  ingredient: IIngredient;
};

const IngredientItem = ({ ingredient }: Props) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { color, iconName } = getCategoryConfig(ingredient.categoryId);

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
            <MaterialIcons
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              name={iconName as any}
              size={ICON_SIZE_MEDIUM}
              color={color}
            />
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
