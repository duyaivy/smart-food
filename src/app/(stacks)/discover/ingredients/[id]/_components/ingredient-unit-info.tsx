import { Scale } from 'lucide-react-native';
import React from 'react';

import { Text, View } from '@/components/ui';
import { type UnitType } from '@/models/types/dish';

type Props = {
  unit?: UnitType;
};

export function IngredientUnitInfo({ unit }: Props) {
  if (!unit) return null;

  return (
    <View className="flex-row items-center gap-3 rounded-xl  px-4 py-3">
      <Scale size={18} className="text-primary-700" />
      <Text className="text-sm text-primary-700">
        Đơn vị tính: <Text className="font-semibold">{unit}</Text>
      </Text>
    </View>
  );
}
