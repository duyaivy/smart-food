import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import { cn } from '@/lib/common/utils';
import { type DailyPlan } from '@/models/interfaces/recommendation';

const WEEK_LENGTH = 7;

export type WeekDay = {
  date: Date;
  key: string;
  dayPlan: DailyPlan | null;
};

const formatDateKey = (date: Date): string => date.toISOString().slice(0, 10);

const toValidDate = (value?: string): Date | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getMondayOfWeek = (date: Date): Date => {
  const monday = new Date(date);
  const day = monday.getDay();
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

export const buildWeekDays = (
  plan: DailyPlan[],
  startDateValue?: string
): WeekDay[] => {
  const planByDate = new Map(
    plan
      .map((dayPlan) => {
        const date = toValidDate(dayPlan.date);
        return date ? ([formatDateKey(date), dayPlan] as const) : null;
      })
      .filter((entry): entry is readonly [string, DailyPlan] => entry !== null)
  );

  const inputStartDate = toValidDate(startDateValue);
  const firstPlanDate = toValidDate(plan[0]?.date);
  const startDate = getMondayOfWeek(
    firstPlanDate ?? inputStartDate ?? new Date()
  );

  return Array.from({ length: WEEK_LENGTH }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    const key = formatDateKey(date);

    return {
      date,
      key,
      dayPlan: planByDate.get(key) ?? null,
    };
  });
};

type Props = {
  weekDays: WeekDay[];
  selectedDayKey?: string;
  onSelectDay: (dayKey: string) => void;
};

export const WeeklyCalendar = ({
  weekDays,
  selectedDayKey,
  onSelectDay,
}: Props) => (
  <View className="py-2">
    <View className="flex-row px-4">
      {weekDays.map((day) => {
        const hasData = !!day.dayPlan;
        const isSelected = selectedDayKey === day.key;

        return (
          <Pressable
            key={day.key}
            onPress={() => onSelectDay(day.key)}
            className={cn(
              'mx-0.5 flex-1 items-center justify-center rounded-2xl border py-2'
            )}
            style={{
              backgroundColor: isSelected
                ? colors.voca.green
                : hasData
                  ? colors.voca.greenLight
                  : colors.white,
              borderColor: hasData ? colors.voca.green : '#DADCE0',
              opacity: hasData || isSelected ? 1 : 0.72,
            }}
          >
            <Text
              className="text-xs font-medium"
              style={{
                color: isSelected ? colors.white : colors.voca.grey,
              }}
            >
              {day.date.getDay() === 0 ? 'CN' : `T${day.date.getDay() + 1}`}
            </Text>
            <View
              className="mt-1 size-8 items-center justify-center overflow-hidden rounded-full"
              style={{
                backgroundColor: isSelected ? colors.white : 'transparent',
              }}
            >
              <Text
                className="text-sm font-bold"
                style={{
                  color: isSelected ? colors.voca.green : colors.voca.black,
                }}
              >
                {day.date.getDate()}
              </Text>
            </View>
            <View
              className="mt-1 size-1.5 rounded-full"
              style={{
                backgroundColor: hasData
                  ? isSelected
                    ? colors.voca.green
                    : colors.voca.secondary
                  : '#DADCE0',
              }}
            />
          </Pressable>
        );
      })}
    </View>
  </View>
);
