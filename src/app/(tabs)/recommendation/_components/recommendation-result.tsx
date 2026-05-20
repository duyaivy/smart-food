import { Moon, Sun, Sunrise } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';

import { DailySummary } from '@/components/recommendation/daily-summary';
import colors from '@/constants/colors';
import { useIngredientStore } from '@/lib/stores/use-ingredient-store';
import { useRecommendationStore } from '@/lib/stores/use-recommendation-store';
import { type RecommendationOutput } from '@/models/interfaces/recommendation';

import { EmptyDayState } from './empty-day-state';
import { MealSection } from './meal-section';
import { NutritionSummary } from './nutrition-summary';
import { RecommendationIntro } from './recommendation-intro';
import { RecommendationResetButton } from './recommendation-reset-button';
import { buildWeekDays, WeeklyCalendar } from './weekly-calendar';

type RecommendationResultProps = {
  result: RecommendationOutput;
  isRefreshing: boolean;
  onRefresh: () => void;
};

export const RecommendationResult = ({
  result,
  isRefreshing,
  onRefresh,
}: RecommendationResultProps) => {
  const reset = useRecommendationStore.use.reset();
  const ingredientList = useIngredientStore.use.ingredientList();
  const ingredientsById = useMemo(
    () =>
      Object.fromEntries(
        ingredientList.map((ingredient) => [ingredient.id, ingredient])
      ),
    [ingredientList]
  );

  const weekDays = useMemo(
    () => buildWeekDays(result.output.plan, result.input.startDate),
    [result.input.startDate, result.output.plan]
  );
  const firstAvailableDayKey = weekDays.find((day) => day.dayPlan)?.key;
  const [selectedDayKey, setSelectedDayKey] = useState(
    firstAvailableDayKey ?? weekDays[0]?.key
  );

  useEffect(() => {
    if (!selectedDayKey || weekDays.some((day) => day.key === selectedDayKey)) {
      return;
    }

    setSelectedDayKey(firstAvailableDayKey ?? weekDays[0]?.key);
  }, [firstAvailableDayKey, selectedDayKey, weekDays]);

  const selectedWeekDay =
    weekDays.find((day) => day.key === selectedDayKey) ?? weekDays[0];
  const selectedDayPlan = selectedWeekDay?.dayPlan ?? null;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={colors.voca.green}
          />
        }
      >
        <RecommendationIntro planLength={result.output.plan.length} />

        <WeeklyCalendar
          weekDays={weekDays}
          selectedDayKey={selectedDayKey}
          onSelectDay={setSelectedDayKey}
        />

        <View className="mt-4 px-6">
          <NutritionSummary summary={result.output.summary} />
        </View>

        {selectedDayPlan ? (
          <>
            <View className="mt-4 px-6">
              <DailySummary
                dayLabel={`Ngày ${selectedDayPlan.day}`}
                date={new Date(selectedDayPlan.date).toLocaleDateString(
                  'vi-VN'
                )}
                nutrition={selectedDayPlan.nutrition}
              />
            </View>

            <View className="mt-6 gap-4 px-6">
              <MealSection
                title="Bữa sáng"
                Icon={Sunrise}
                iconColor={colors.voca.yellow}
                meals={selectedDayPlan.meals.breakfast}
                ingredientsById={ingredientsById}
                day={selectedDayPlan.day}
                mealType="BREAKFAST"
              />
              <MealSection
                title="Bữa trưa"
                Icon={Sun}
                iconColor={colors.voca.red}
                meals={selectedDayPlan.meals.lunch}
                ingredientsById={ingredientsById}
                backgroundColor="#fffdf1"
                borderColor="#F8D558"
                day={selectedDayPlan.day}
                mealType="LUNCH"
              />
              <MealSection
                title="Bữa tối"
                Icon={Moon}
                iconColor={colors.voca.blue}
                meals={selectedDayPlan.meals.dinner}
                ingredientsById={ingredientsById}
                backgroundColor="#f0f9ff"
                borderColor="#0563B5"
                day={selectedDayPlan.day}
                mealType="DINNER"
              />
            </View>
          </>
        ) : (
          <EmptyDayState />
        )}

        <View className="mb-10 mt-8 px-6">
          <RecommendationResetButton onPress={reset} />
        </View>
      </ScrollView>
    </View>
  );
};
