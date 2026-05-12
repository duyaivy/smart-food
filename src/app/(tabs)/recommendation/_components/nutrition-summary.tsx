import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import { type Summary } from '@/models/interfaces/recommendation';

const WEEK_LENGTH = 10;

type Props = {
  summary: Summary;
};

export const NutritionSummary = ({ summary }: Props) => {
  const calorieProgress =
    summary.targetCalories > 0
      ? Math.min(
          (summary.avgDailyCalories / (summary.targetCalories / WEEK_LENGTH)) *
            100,
          100
        )
      : 0;

  return (
    <View
      className="gap-4 rounded-2xl p-4"
      style={{ backgroundColor: colors.white }}
    >
      <View className="flex-row items-center justify-between">
        <Text
          className="text-base font-bold"
          style={{ color: colors.voca.black }}
        >
          Tổng quan dinh dưỡng
        </Text>
        <View
          className="rounded-full px-3 py-1"
          style={{
            backgroundColor:
              summary.deviation >= 0
                ? colors.voca.yellowLight
                : colors.voca.greenLight,
          }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: colors.voca.grey }}
          >
            Độ lệch {summary.deviation}
          </Text>
        </View>
      </View>

      <View className="gap-2">
        <View className="flex-row justify-between">
          <Text className="text-xs" style={{ color: colors.voca.grey }}>
            Calo trung bình
          </Text>
          <Text
            className="text-xs font-bold"
            style={{ color: colors.voca.black }}
          >
            {Math.round(summary.avgDailyCalories)} /{' '}
            {Math.round(summary.targetCalories / WEEK_LENGTH)} kcal
          </Text>
        </View>
        <View
          className="h-2 overflow-hidden rounded-full"
          style={{ backgroundColor: colors.voca.greyLight }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${calorieProgress}%`,
              backgroundColor: colors.voca.green,
            }}
          />
        </View>
      </View>

      <View className="flex-row gap-2">
        <SummaryMetric label="Chất béo" value={summary.avgDailyFat} unit="g" />
        <SummaryMetric
          label="Tinh bột"
          value={summary.avgDailyCarbs}
          unit="g"
        />
        <SummaryMetric
          label="Chất đạm"
          value={summary.avgDailyProtein}
          unit="g"
        />
      </View>

      <View className="flex-row gap-2">
        <SummaryMetric
          label="Mục tiêu calo"
          value={summary.targetCalories}
          unit="kcal"
        />
        <SummaryMetric
          label="Trung bình"
          value={summary.avgDailyCalories}
          unit="kcal"
        />
      </View>
    </View>
  );
};

const SummaryMetric = ({
  label,
  value,
  unit,
}: {
  label: string;
  value: number;
  unit: string;
}) => (
  <View
    className="flex-1 rounded-xl p-3"
    style={{ backgroundColor: colors.voca.greyLight }}
  >
    <Text className="text-xs" style={{ color: colors.voca.grey }}>
      {label}
    </Text>
    <Text
      className="mt-1 text-base font-bold"
      style={{ color: colors.voca.black }}
    >
      {Number.isFinite(value) ? Number(value).toFixed(1) : '0'} {unit}
    </Text>
  </View>
);
