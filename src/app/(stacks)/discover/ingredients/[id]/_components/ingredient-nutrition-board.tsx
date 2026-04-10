import React from 'react';

import { Text, View } from '@/components/ui';
import { calcKcal } from '@/lib/utils/caculator';
import { type IIngredient } from '@/models/interfaces/ingredient';

type MacroRow = {
  label: string;
  value: number;
  unit: string;
  color: string;
  barColor: string;
  barWidth: `${number}%`;
};

type Props = {
  ingredient: IIngredient;
};

function toPercent(value: number): `${number}%` {
  return `${value}%`;
}

function toMacroRows(ingredient: IIngredient): MacroRow[] {
  const protein = ingredient.protein ?? 0;
  const fat = ingredient.fat ?? 0;
  const carb = ingredient.carb ?? 0;

  return [
    {
      label: 'Calories',
      value: calcKcal(carb, protein, fat),
      unit: 'kcal',
      color: 'text-danger-600',
      barColor: 'bg-danger-500',
      barWidth: '66%',
    },
    {
      label: 'Protein',
      value: protein,
      unit: 'g',
      color: 'text-secondary',
      barColor: 'bg-secondary',
      barWidth: toPercent(Math.min((protein / 30) * 100, 100)),
    },
    {
      label: 'Fat',
      value: fat,
      unit: 'g',
      color: 'text-primary',
      barColor: 'bg-primary',
      barWidth: toPercent(Math.min((fat / 30) * 100, 100)),
    },
    {
      label: 'Carbs',
      value: carb,
      unit: 'g',
      color: 'text-yellow-500',
      barColor: 'bg-yellow-500',
      barWidth: toPercent(Math.min((carb / 60) * 100, 100)),
    },
  ];
}

export function IngredientNutritionBoard({ ingredient }: Props) {
  const macros = toMacroRows(ingredient);

  return (
    <View className="-mt-5 mb-6 rounded-2xl bg-white p-5 shadow-sm shadow-black/5">
      <Text className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
        Dinh dưỡng / 100g
      </Text>
      <View className="gap-4">
        {macros.map((macro) => (
          <View key={macro.label} className="gap-1.5">
            <View className="flex-row items-baseline justify-between">
              <Text className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {macro.label}
              </Text>
              <Text className={`text-xl font-bold ${macro.color}`}>
                {macro.value}
                <Text className="text-sm font-normal text-neutral-400">
                  {' '}
                  {macro.unit}
                </Text>
              </Text>
            </View>
            <View className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
              <View
                className={`h-full rounded-full ${macro.barColor}`}
                style={{ width: macro.barWidth }}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
