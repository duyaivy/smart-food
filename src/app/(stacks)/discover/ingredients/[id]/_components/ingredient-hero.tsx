import React from 'react';

import { getCategoryConfig } from '@/app/(stacks)/discover/ingredients/_components/ingredient-item';
import { Image, Text, View } from '@/components/ui';
import { type IIngredient } from '@/models/interfaces/ingredient';

type Props = {
  ingredient: IIngredient;
};

export function IngredientHero({ ingredient }: Props) {
  const categoryConfig = getCategoryConfig(ingredient.categoryId);
  const CategoryIcon = categoryConfig.Icon;

  return (
    <View className="relative h-72 w-full overflow-hidden">
      {ingredient.images?.[0] ? (
        <Image
          source={{ uri: ingredient.images[0] }}
          className="size-full"
          contentFit="cover"
          cachePolicy="memory-disk"
        />
      ) : (
        <View className="size-full items-center justify-center bg-neutral-100">
          <CategoryIcon size={64} className="text-neutral-500" />
        </View>
      )}

      <View className="absolute inset-x-0 bottom-0 bg-black/35 p-6">
        <View className="mb-2 flex-row items-center gap-1.5 self-start rounded-full bg-white/90 px-3 py-1">
          <CategoryIcon size={12} className="text-neutral-700" />
          <Text className="text-xs font-bold text-neutral-700">
            {categoryConfig.label}
          </Text>
        </View>
        <Text className="text-3xl font-bold text-white">{ingredient.name}</Text>
      </View>
    </View>
  );
}
