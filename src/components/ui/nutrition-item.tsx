import React from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/common/utils';

import { Text } from './text';

type MacroItem = {
  label: string;
  value: number;
  toneClassName: string;
};

type Props = {
  protein: number;
  carb: number;
  fat: number;
  className?: string;
};

function getProgress(value: number, maxValue: number): number {
  if (maxValue <= 0) return 0;
  return Math.min((value / maxValue) * 100, 100);
}

export function NutritionItem({ protein, carb, fat, className }: Props) {
  const maxValue = Math.max(protein, carb, fat, 1);

  const items: MacroItem[] = [
    { label: 'Chất đạm', value: protein, toneClassName: 'bg-secondary-600' },
    { label: 'Chất béo', value: fat, toneClassName: 'bg-primary' },
    { label: 'Tinh bột', value: carb, toneClassName: 'bg-warning-600' },
  ];

  return (
    <View className={cn('flex-row gap-4 rounded-2xl bg-white p-3', className)}>
      {items.map((item) => {
        const progress = getProgress(item.value, maxValue);

        return (
          <View key={item.label} className="flex-1">
            <Text className="text-body-s font-medium text-neutral-700">
              {item.label}
            </Text>
            <View className="mt-1 h-2 w-full overflow-hidden rounded-full bg-neutral-200">
              <View
                className={cn('h-full rounded-full', item.toneClassName)}
                style={{ width: `${progress}%` }}
              />
            </View>
            <Text className="mt-1 text-label text-neutral-500">
              {item.value}g
            </Text>
          </View>
        );
      })}
    </View>
  );
}
