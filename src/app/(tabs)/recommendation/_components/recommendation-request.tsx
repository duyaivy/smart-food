import { zodResolver } from '@hookform/resolvers/zod';
import Slider from '@react-native-community/slider';
import {
  ArrowDown,
  ArrowLeftRight,
  ArrowUp,
  Calendar as CalendarIcon,
  Check,
  LoaderCircle,
  Moon,
  Settings,
  Sparkles,
  Sun,
  Sunrise,
  Target,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, Pressable, ScrollView, View } from 'react-native';
import TypeWriterEffect from 'react-native-typewriter-effect';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import {
  ICON_SIZE_LARGE,
  ICON_SIZE_MEDIUM,
  ICON_SIZE_SMALL,
  MEAL_PERIODS,
} from '@/constants/common';
import { cn } from '@/lib/common/utils';
import { useSubmitRecommendationMutation } from '@/lib/hooks/queries/recommendation.query';
import { type RecommendationInput } from '@/models/interfaces/recommendation';
import {
  recommendationSchema,
  type RecommendationSchemaType,
} from '@/schemas/recommendation.schema';

import { GoalCard } from './goal-card';
import { MealCounter } from './meal-counter';

const AVOCADO_QUESTION = require('@assets/images/voca_question.png');

type MealPeriod = 'breakfast' | 'lunch' | 'dinner';

export const RecommendationRequest = () => {
  const { mutateAsync: submitRecommend, isPending } =
    useSubmitRecommendationMutation();
  const [canEditTarget, setCanEditTarget] = useState<boolean>(false);
  const { control, handleSubmit, setValue, watch } =
    useForm<RecommendationSchemaType>({
      resolver: zodResolver(recommendationSchema),
      defaultValues: {
        planDays: 3,
        avoidRepeats: true,
        mealGoal: 'CUSTOM',
        weightChange: 0,
        mealStructure: {
          breakfast: { mainDish: 1, soup: 0, vegetable: 0 },
          lunch: { mainDish: 1, soup: 1, vegetable: 1 },
          dinner: { mainDish: 1, soup: 1, vegetable: 1 },
        },
      },
      mode: 'onSubmit', // Ensure validation only triggers on submit
    });

  const selectedGoal = watch('mealGoal');
  const weightChange = watch('weightChange');
  const selectedPlanDays = watch('planDays');

  const [selectedMealPeriod, setSelectedMealPeriod] =
    useState<MealPeriod>('breakfast');

  const onSubmit = async (data: RecommendationSchemaType) => {
    const input: RecommendationInput = {
      planDays: data.planDays,
      startDate: new Date().toISOString(),
      goal: { targetKg: data.weightChange },
      mealStructure: data.mealStructure,
    };
    try {
      await submitRecommend(input);
    } catch (error) {
      // Error is handled in the mutation hook via showMessage
      console.log({ error });
    }
  };

  const handlePlanDaysChange = useCallback(
    (value: string) => {
      setValue('planDays', parseInt(value, 10));
    },
    [setValue]
  );

  const handleMealPeriodChange = useCallback((value: string) => {
    setSelectedMealPeriod(value as MealPeriod);
  }, []);

  const handleGoalChange = useCallback(
    (goal: 'REDUCE' | 'INCREASE' | 'MAINTAIN' | 'CUSTOM', weight: number) => {
      setValue('mealGoal', goal);
      if (goal !== 'CUSTOM') {
        setValue('weightChange', weight);
        setCanEditTarget(true);
      } else {
        setCanEditTarget(false);
      }
    },
    [setValue]
  );

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Avocado Intro */}
      <View className="flex-row items-start px-6 py-4">
        <Image
          source={AVOCADO_QUESTION}
          style={{ width: 100, height: 120 }}
          resizeMode="contain"
        />
        <View
          className="ml-2 flex-1 rounded-2xl px-4 py-3 shadow-sm"
          style={{ backgroundColor: colors.voca.greenLight }}
        >
          <TypeWriterEffect
            content="Cho AvocadoAI biết thêm thông tin để có thể đưa ra gợi ý tốt nhất dành cho bạn!"
            minDelay={10}
            maxDelay={20}
          />
        </View>
      </View>

      <View className="gap-6 px-6">
        {/* Section: Time */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <CalendarIcon size={24} color={colors.voca.grey} />
            <Text
              className="text-base font-bold"
              style={{ color: colors.voca.black }}
            >
              Thời gian
            </Text>
          </View>

          <Tabs
            value={selectedPlanDays.toString()}
            onValueChange={handlePlanDaysChange}
          >
            <TabsList
              className="h-14 w-full rounded-xl px-2"
              style={{ backgroundColor: colors.voca.greyLight }}
            >
              {[1, 3, 7].map((days) => (
                <TabsTrigger
                  key={days}
                  value={days.toString()}
                  className="h-12 flex-1"
                  style={
                    selectedPlanDays === days
                      ? { backgroundColor: colors.voca.primary }
                      : {}
                  }
                >
                  <Text
                    className={cn(
                      'font-bold text-sm',
                      selectedPlanDays === days ? 'text-white' : ''
                    )}
                    style={{
                      color:
                        selectedPlanDays === days
                          ? colors.white
                          : colors.voca.grey,
                    }}
                  >
                    {days} Ngày
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </View>

        {/* Avoid Repeats */}
        <Controller
          control={control}
          name="avoidRepeats"
          render={({ field: { onChange, value } }) => (
            <Pressable
              onPress={() => onChange(!value)}
              className="flex-row items-center gap-2"
            >
              <View
                className={cn(
                  'size-6 items-center justify-center rounded-md border-2'
                )}
                style={{
                  backgroundColor: value ? colors.voca.green : colors.white,
                  borderColor: value ? colors.voca.green : '#DADCE0',
                }}
              >
                {value && (
                  <Check size={16} color={colors.white} strokeWidth={3} />
                )}
              </View>
              <Text
                className="text-base font-medium"
                style={{ color: colors.voca.black }}
              >
                Hạn chế lặp lại bữa ăn
              </Text>
            </Pressable>
          )}
        />

        {/* Section: Goals */}
        <View className="gap-3">
          <View className="flex-row items-center gap-2">
            <Target size={ICON_SIZE_LARGE} color={colors.voca.red} />
            <Text
              className="text-base font-bold"
              style={{ color: colors.voca.black }}
            >
              Mục tiêu dinh dưỡng
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            <GoalCard
              goal={{
                label: 'Giảm cân',
                icon: (
                  <ArrowDown size={ICON_SIZE_MEDIUM} color={colors.voca.red} />
                ),
                color: colors.voca.red,
              }}
              isActive={selectedGoal === 'REDUCE'}
              onPress={() => handleGoalChange('REDUCE', -0.5)}
            />
            <GoalCard
              goal={{
                label: 'Tăng cân',
                icon: (
                  <ArrowUp size={ICON_SIZE_MEDIUM} color={colors.voca.green} />
                ),
                color: colors.voca.green,
              }}
              isActive={selectedGoal === 'INCREASE'}
              onPress={() => handleGoalChange('INCREASE', 0.5)}
            />
            <GoalCard
              goal={{
                label: 'Duy trì',
                icon: (
                  <ArrowLeftRight
                    size={ICON_SIZE_MEDIUM}
                    color={colors.voca.yellow}
                  />
                ),
                color: colors.voca.yellow,
              }}
              isActive={selectedGoal === 'MAINTAIN'}
              onPress={() => handleGoalChange('MAINTAIN', 0)}
            />
            <GoalCard
              goal={{
                label: 'Tuỳ chỉnh',
                icon: (
                  <Settings size={ICON_SIZE_MEDIUM} color={colors.voca.grey} />
                ),
                color: colors.voca.grey,
              }}
              isActive={selectedGoal === 'CUSTOM'}
              onPress={() => handleGoalChange('CUSTOM', weightChange)}
            />
            <Label className="mt-2 text-wrap text-red-400">
              *Theo khuyến cáo của Tổ chức Y tế Thế giới, khoảng thay đổi cân
              nặng an toàn tối đa là 0.5kg một tuần.
            </Label>
          </View>

          {/* Slider */}
          <View className="mt-2 gap-2">
            <View className="flex-row justify-between px-2">
              <Text className="text-xs font-bold" style={{ color: '#9AA0A6' }}>
                -0.5 kg
              </Text>
              <Text
                className="text-xs font-bold"
                style={{ color: colors.voca.green }}
              >
                {weightChange > 0 ? `+${weightChange}` : weightChange} kg
              </Text>
              <Text className="text-xs font-bold" style={{ color: '#9AA0A6' }}>
                +0.5 kg
              </Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={-0.5}
              maximumValue={0.5}
              step={0.1}
              value={weightChange}
              onValueChange={(val) => {
                setValue('weightChange', Number(val.toFixed(1)));
              }}
              minimumTrackTintColor={colors.voca.green}
              maximumTrackTintColor="#DADCE0"
              thumbTintColor={colors.voca.green}
              disabled={canEditTarget}
            />
          </View>
        </View>

        {/* Meal Structure */}
        <View
          className="rounded-2xl p-1"
          style={{ backgroundColor: '#F8F9FA' }}
        >
          <Tabs
            value={selectedMealPeriod}
            onValueChange={handleMealPeriodChange}
          >
            <TabsList className="h-12 w-full gap-2 rounded-xl bg-slate-200 px-2 py-1">
              {MEAL_PERIODS.map((period) => (
                <TabsTrigger
                  key={period}
                  value={period}
                  className={cn(
                    'flex-1 flex-row gap-2 rounded-lg ',
                    selectedMealPeriod === period ? 'bg-white shadow-sm' : ''
                  )}
                >
                  {period === 'breakfast' && (
                    <Sunrise
                      size={ICON_SIZE_SMALL}
                      color={
                        selectedMealPeriod === period
                          ? colors.voca.green
                          : colors.voca.grey
                      }
                    />
                  )}
                  {period === 'lunch' && (
                    <Sun
                      size={ICON_SIZE_SMALL}
                      color={
                        selectedMealPeriod === period
                          ? colors.voca.yellow
                          : colors.voca.grey
                      }
                    />
                  )}
                  {period === 'dinner' && (
                    <Moon
                      size={16}
                      color={
                        selectedMealPeriod === period
                          ? colors.voca.blue
                          : colors.voca.grey
                      }
                    />
                  )}
                  <Text
                    className="text-sm font-bold"
                    style={{
                      color:
                        selectedMealPeriod === period
                          ? colors.voca.black
                          : colors.voca.grey,
                    }}
                  >
                    {period === 'breakfast'
                      ? 'Sáng'
                      : period === 'lunch'
                        ? 'Trưa'
                        : 'Tối'}
                  </Text>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="breakfast">
              <MealCounters
                period="breakfast"
                watch={watch}
                setValue={setValue}
              />
            </TabsContent>
            <TabsContent value="lunch">
              <MealCounters period="lunch" watch={watch} setValue={setValue} />
            </TabsContent>
            <TabsContent value="dinner">
              <MealCounters period="dinner" watch={watch} setValue={setValue} />
            </TabsContent>
          </Tabs>
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          loading={isPending}
          className="h-14 rounded-2xl"
          style={{ backgroundColor: colors.voca.secondary }}
        >
          <View className="flex-row items-center gap-2">
            {isPending ? (
              <LoaderCircle
                size={ICON_SIZE_MEDIUM}
                color={colors.white}
                className="animate-spin"
              />
            ) : (
              <Sparkles size={ICON_SIZE_MEDIUM} color={colors.white} />
            )}
            <Text className="text-xl font-bold text-white">Gợi ý thực đơn</Text>
          </View>
        </Button>
      </View>
    </ScrollView>
  );
};

const MealCounters = ({
  period,
  watch,
  setValue,
}: {
  period: MealPeriod;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: any;
}) => (
  <View className="mt-4 gap-3 px-3 pb-3">
    <MealCounter
      label="Món chính"
      subLabel="Đạm và tinh bột"
      icon="🍽️"
      value={watch(`mealStructure.${period}.mainDish`)}
      onChange={(v) => setValue(`mealStructure.${period}.mainDish`, v)}
      color="#FFF8E1"
    />
    <MealCounter
      label="Canh / Nước"
      subLabel="Nước và khoáng chất"
      icon="☕"
      value={watch(`mealStructure.${period}.soup`)}
      onChange={(v) => setValue(`mealStructure.${period}.soup`, v)}
      color={colors.voca.blueLight}
    />
    <MealCounter
      label="Rau xanh"
      subLabel="Chất xơ và vitamin"
      icon="🥦"
      value={watch(`mealStructure.${period}.vegetable`)}
      onChange={(v) => setValue(`mealStructure.${period}.vegetable`, v)}
      color={colors.voca.greenLight}
    />
  </View>
);
