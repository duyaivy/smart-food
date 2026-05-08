import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';

interface MealCounterProps {
  label: string;
  subLabel: string;
  icon: string;
  value: number;
  onChange: (v: number) => void;
  color: string;
}

export const MealCounter = ({
  label,
  subLabel,
  icon,
  value,
  onChange,
  color,
}: MealCounterProps) => {
  return (
    <View
      style={{ backgroundColor: color }}
      className="flex-row items-center justify-between rounded-2xl p-4"
    >
      <View className="flex-row items-center gap-3">
        <View className="size-12 items-center justify-center rounded-full bg-white">
          <Text style={{ fontSize: 24 }}>{icon}</Text>
        </View>
        <View>
          <Text className="text-base font-bold text-[#202124]">{label}</Text>
          <Text className="text-xs text-[#5F6368]">{subLabel}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4 rounded-full bg-white px-2 py-1">
        <Pressable
          onPress={() => onChange(Math.max(0, value - 1))}
          className="p-1"
        >
          <Text className="text-2xl text-[#BDC1C6]">−</Text>
        </Pressable>
        <Text className="min-w-[20px] text-center text-lg font-bold text-[#202124]">
          {value}
        </Text>
        <Pressable onPress={() => onChange(value + 1)} className="p-1">
          <Text className="text-2xl text-[#34A853]">+</Text>
        </Pressable>
      </View>
    </View>
  );
};
