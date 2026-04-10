import React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  description?: string;
};

export function IngredientDescription({ description }: Props) {
  if (!description) return null;

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center gap-3">
        <View className="h-0.5 w-6 bg-primary-600" />
        <Text className="text-lg font-bold text-foreground">Mô tả</Text>
      </View>
      <Text className="text-base leading-7 text-neutral-600">
        {description}
      </Text>
    </View>
  );
}
