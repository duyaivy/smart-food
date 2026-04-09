import React from 'react';

import { Text, View } from '@/components/ui';
import { formatRecordedAt } from '@/lib/utils/date-time';

type Props = {
  ingredientName: string | null;
  calories: number | null;
  protein: number | null;
  carb: number | null;
  fat: number | null;
  confidence: number | null;
  weight: number;
  status: 'DONE' | 'FAILED';
  recordedAt: number;
};

export function ScanRecordCard({
  ingredientName,
  calories,
  protein,
  carb,
  fat,
  confidence,
  weight,
  status,
  recordedAt,
}: Props) {
  const isDone = status === 'DONE';

  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-black">
            {ingredientName ?? 'Chưa nhận diện được'}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Độ chính xác: {confidence ?? 50}%
          </Text>
        </View>

        <View
          className={`rounded-full px-3 py-1 ${
            isDone ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isDone ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Khối lượng</Text>
          <Text className="font-medium text-black">{weight} g</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Calories</Text>
          <Text className="font-medium text-black">
            {calories ?? 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Protein</Text>
          <Text className="font-medium text-black">
            {protein ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Carb</Text>
          <Text className="font-medium text-black">
            {carb ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Fat</Text>
          <Text className="font-medium text-black">
            {fat ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Thời gian ghi nhận</Text>
          <Text className="max-w-[55%] text-right font-medium text-black">
            {formatRecordedAt(recordedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}