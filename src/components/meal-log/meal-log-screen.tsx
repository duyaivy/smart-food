import { MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Plus,
  Utensils,
} from 'lucide-react-native';
import React, { memo, useMemo, useState } from 'react';

import {
  Button,
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { Icon } from '@/components/ui/icon';
import { getCategoryConfig, ICON_SIZE_MEDIUM } from '@/constants/common';

type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER';

type MealLog = {
  id: number;
  userId: number;
  note?: string | null;
  dishId?: number | null;
  dishName?: string | null;
  categoryId?: number | null;
  totalKcal: number;
  totalProtein: number;
  totalFat: number;
  totalCarb: number;
  mealType: MealType;
  customName?: string | null;
  isCustom: boolean;
  createdAt: string;
  eatenAt: string;
};

type MealFilter = 'ALL' | MealType;

type MealLogRow =
  | {
      id: string;
      kind: 'date';
      title: string;
      subtitle: string;
    }
  | {
      kind: 'meal';
      meal: MealLog;
    };

const FILTERS: { value: MealFilter; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'BREAKFAST', label: 'Bữa sáng' },
  { value: 'LUNCH', label: 'Bữa trưa' },
  { value: 'DINNER', label: 'Bữa tối' },
];

const MEAL_TYPE_LABEL: Record<MealType, string> = {
  BREAKFAST: 'Bữa sáng',
  LUNCH: 'Bữa trưa',
  DINNER: 'Bữa tối',
};

function createMockMealTime(daysAgo: number, hour: number, minute: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

const MOCK_MEAL_LOGS: MealLog[] = [
  {
    id: 1,
    userId: 7,
    dishId: 101,
    dishName: 'Cháo yến mạch trứng luộc',
    categoryId: 5,
    totalKcal: 430,
    totalProtein: 28,
    totalFat: 14,
    totalCarb: 46,
    mealType: 'BREAKFAST',
    customName: null,
    isCustom: false,
    note: 'Ăn kèm chuối và một ít hạt chia.',
    createdAt: createMockMealTime(0, 7, 24),
    eatenAt: createMockMealTime(0, 7, 20),
  },
  {
    id: 2,
    userId: 7,
    dishId: null,
    dishName: null,
    categoryId: 2,
    totalKcal: 620,
    totalProtein: 36,
    totalFat: 18,
    totalCarb: 78,
    mealType: 'LUNCH',
    customName: 'Cơm gà rau củ',
    isCustom: true,
    note: 'Gạo lứt, ức gà nướng, dưa leo và sốt mè.',
    createdAt: createMockMealTime(0, 12, 44),
    eatenAt: createMockMealTime(0, 12, 35),
  },
  {
    id: 3,
    userId: 7,
    dishId: null,
    dishName: null,
    categoryId: 4,
    totalKcal: 180,
    totalProtein: 12,
    totalFat: 7,
    totalCarb: 18,
    mealType: 'BREAKFAST',
    customName: 'Sữa chua Hy Lạp',
    isCustom: true,
    note: null,
    createdAt: createMockMealTime(0, 15, 12),
    eatenAt: createMockMealTime(0, 15, 10),
  },
  {
    id: 4,
    userId: 7,
    dishId: 244,
    dishName: 'Canh rau thịt nạc',
    categoryId: 1,
    totalKcal: 540,
    totalProtein: 31,
    totalFat: 19,
    totalCarb: 58,
    mealType: 'DINNER',
    customName: null,
    isCustom: false,
    note: 'Ăn cùng một chén cơm trắng.',
    createdAt: createMockMealTime(0, 18, 52),
    eatenAt: createMockMealTime(0, 18, 45),
  },
  {
    id: 5,
    userId: 7,
    dishId: null,
    dishName: null,
    categoryId: 3,
    totalKcal: 510,
    totalProtein: 24,
    totalFat: 22,
    totalCarb: 54,
    mealType: 'DINNER',
    customName: 'Cá hồi áp chảo với rau',
    isCustom: true,
    note: 'Đã lưu từ lịch sử cục bộ.',
    createdAt: createMockMealTime(1, 19, 4),
    eatenAt: createMockMealTime(1, 18, 55),
  },
  {
    id: 6,
    userId: 7,
    dishId: 172,
    dishName: 'Bánh mì trứng sữa',
    categoryId: 7,
    totalKcal: 380,
    totalProtein: 18,
    totalFat: 12,
    totalCarb: 52,
    mealType: 'BREAKFAST',
    customName: null,
    isCustom: false,
    note: '',
    createdAt: createMockMealTime(1, 8, 3),
    eatenAt: createMockMealTime(1, 7, 55),
  },
];

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
});

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

function getMealName(meal: MealLog) {
  if (meal.isCustom) {
    return meal.customName?.trim() || 'Bữa ăn tự nhập';
  }

  return meal.dishName?.trim() || 'Bữa ăn từ công thức';
}

function getDateKey(value: string) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function formatDateLabel(value: string) {
  const todayKey = getDateKey(new Date().toISOString());
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (getDateKey(value) === todayKey) {
    return 'Hôm nay, 05/06';
  }

  if (getDateKey(value) === getDateKey(yesterday.toISOString())) {
    return 'Hôm qua';
  }

  return dateFormatter.format(new Date(value));
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

function getFilterLabel(value: MealFilter) {
  return FILTERS.find((filter) => filter.value === value)?.label ?? 'Tất cả';
}

function createRows(meals: MealLog[]): MealLogRow[] {
  const rows: MealLogRow[] = [];
  let currentDate = '';

  meals.forEach((meal) => {
    const dateKey = getDateKey(meal.eatenAt);
    if (dateKey !== currentDate) {
      currentDate = dateKey;
      const dayMeals = meals.filter(
        (item) => getDateKey(item.eatenAt) === dateKey
      );

      rows.push({
        id: dateKey,
        kind: 'date',
        title: formatDateLabel(meal.eatenAt),
        subtitle: `${dayMeals.length} bữa ăn`,
      });
    }

    rows.push({ kind: 'meal', meal });
  });

  return rows;
}

function MealTypeBadge({ type }: { type: MealType }) {
  return (
    <View className="rounded-full bg-zinc-100 px-2.5 py-1">
      <Text className="text-xs font-semibold text-zinc-600">
        {MEAL_TYPE_LABEL[type]}
      </Text>
    </View>
  );
}

function CategoryIcon({ categoryId }: { categoryId?: number | null }) {
  const { color, iconName } = getCategoryConfig(categoryId ?? undefined);

  return (
    <View
      className="size-11 items-center justify-center rounded-xl"
      style={{ backgroundColor: `${color}18` }}
    >
      <MaterialIcons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={iconName as any}
        size={ICON_SIZE_MEDIUM + 2}
        color={color}
      />
    </View>
  );
}

const MealLogItem = memo(function MealLogItem({ meal }: { meal: MealLog }) {
  const note = meal.note?.trim();

  return (
    <Pressable className="mx-5 mb-2.5 rounded-2xl border border-zinc-100 bg-white px-3.5 py-3 shadow-sm shadow-black/5">
      <View className="flex-row items-start gap-3">
        <CategoryIcon categoryId={meal.categoryId} />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-start justify-between gap-3">
            <View className="min-w-0 flex-1">
              <Text
                className="text-[15px] font-bold leading-5 text-zinc-950"
                numberOfLines={2}
              >
                {getMealName(meal)}
              </Text>

              <View className="mt-2 flex-row flex-wrap items-center gap-2">
                <MealTypeBadge type={meal.mealType} />
                {meal.isCustom ? (
                  <View className="rounded-full bg-orange-50 px-2.5 py-1">
                    <Text className="text-xs font-semibold text-orange-600">
                      Tự nhập
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            <View className="items-end">
              <Text className="text-base font-extrabold text-orange-500">
                {meal.totalKcal}
              </Text>
              <Text className="text-[11px] font-semibold text-zinc-400">
                kcal
              </Text>
            </View>
          </View>

          <View className="mt-3 flex-row flex-wrap gap-2">
            <MacroPill label="Đạm" value={`${meal.totalProtein}g`} />
            <MacroPill label="Tinh bột" value={`${meal.totalCarb}g`} />
            <MacroPill label="Béo" value={`${meal.totalFat}g`} />
          </View>

          {note ? (
            <Text className="mt-2.5 text-sm leading-5 text-zinc-500">
              {note}
            </Text>
          ) : null}

          <View className="mt-3 flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5">
              <Icon as={Clock3} size={14} color="#71717A" />
              <Text className="text-sm font-semibold text-zinc-500">
                {formatTime(meal.eatenAt)}
              </Text>
            </View>
            <Icon as={ChevronRight} size={18} color="#D4D4D8" />
          </View>
        </View>
      </View>
    </Pressable>
  );
});

function MacroPill({ label, value }: { label: string; value: string }) {
  return (
    <View className="rounded-full bg-zinc-50 px-2.5 py-1">
      <Text className="text-xs font-semibold text-zinc-500">
        {label} <Text className="text-xs font-bold text-zinc-900">{value}</Text>
      </Text>
    </View>
  );
}

function DateHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View className="mx-5 mb-2 mt-4 flex-row items-center justify-between">
      <Text className="text-base font-extrabold text-zinc-950">{title}</Text>
      <Text className="text-sm font-semibold text-zinc-400">{subtitle}</Text>
    </View>
  );
}

function EmptyMealLog() {
  return (
    <View className="mx-5 mt-6 items-center rounded-2xl border border-dashed border-zinc-200 bg-white p-8">
      <View className="size-14 items-center justify-center rounded-xl bg-orange-50">
        <Icon as={Utensils} size={26} color="#E8734A" />
      </View>
      <Text className="mt-4 text-lg font-extrabold text-zinc-950">
        Chưa có bữa ăn nào
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-zinc-500">
        Bắt đầu lưu lịch sử ăn uống bằng một bữa ăn đầu tiên.
      </Text>
      <Button
        label="Thêm bữa ăn đầu tiên"
        className="mt-4 h-11 self-stretch rounded-xl"
        textClassName="text-base text-white"
      />
    </View>
  );
}

export function MealLogScreen() {
  const [activeFilter, setActiveFilter] = useState<MealFilter>('ALL');

  const filteredMeals = useMemo(() => {
    const sortedMeals = [...MOCK_MEAL_LOGS].sort(
      (a, b) => new Date(b.eatenAt).getTime() - new Date(a.eatenAt).getTime()
    );

    if (activeFilter === 'ALL') {
      return sortedMeals;
    }

    return sortedMeals.filter((meal) => meal.mealType === activeFilter);
  }, [activeFilter]);

  const todayMeals = useMemo(
    () =>
      MOCK_MEAL_LOGS.filter(
        (meal) =>
          getDateKey(meal.eatenAt) === getDateKey(new Date().toISOString())
      ),
    []
  );

  const rows = useMemo(() => createRows(filteredMeals), [filteredMeals]);

  const renderItem = ({ item }: { item: MealLogRow }) => {
    if (item.kind === 'date') {
      return <DateHeader title={item.title} subtitle={item.subtitle} />;
    }

    return <MealLogItem meal={item.meal} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      <FocusAwareStatusBar />
      <FlashList
        data={rows}
        keyExtractor={(item) =>
          item.kind === 'date' ? item.id : `meal-${item.meal.id}`
        }
        renderItem={renderItem}
        estimatedItemSize={150}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="px-5 pb-2 pt-4">
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text className="text-2xl font-extrabold text-zinc-950">
                  Lịch sử nấu ăn
                </Text>
                <Text className="mt-1 text-sm leading-5 text-zinc-500">
                  Hôm nay đã ghi {todayMeals.length} bữa ăn
                </Text>
              </View>

              <Pressable className="size-10 items-center justify-center rounded-xl border border-zinc-100 bg-white">
                <Icon as={CalendarDays} size={20} color="#3F3F46" />
              </Pressable>
            </View>

            <View className="mt-4 flex-row items-center gap-3">
              <Button
                className="my-0 h-10 flex-1 rounded-xl"
                textClassName="text-base text-white"
              >
                <View className="flex-row items-center justify-center gap-2">
                  <Icon as={Plus} size={17} color="#FFFFFF" />
                  <Text className="text-sm font-bold text-white">
                    Thêm bữa ăn
                  </Text>
                </View>
              </Button>

              <View className="flex-row items-center gap-1.5 rounded-full bg-white px-3 py-2">
                <Icon as={CheckCircle2} size={14} color="#16A34A" />
                <Text className="text-xs font-bold text-zinc-600">
                  Đã lưu cục bộ
                </Text>
              </View>
            </View>

            <View className="mt-5">
              <Text className="mb-3 text-base font-extrabold text-zinc-950">
                Loại bữa ăn
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {FILTERS.map((filter) => {
                  const active = activeFilter === filter.value;
                  return (
                    <Pressable
                      key={filter.value}
                      onPress={() => setActiveFilter(filter.value)}
                      className="rounded-full border px-3.5 py-2"
                      style={{
                        backgroundColor: active ? '#111827' : '#FFFFFF',
                        borderColor: active ? '#111827' : '#E5E7EB',
                      }}
                    >
                      <Text
                        className="text-sm font-bold"
                        style={{ color: active ? '#FFFFFF' : '#52525B' }}
                      >
                        {filter.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-5 flex-row items-center justify-between">
              <Text className="text-lg font-extrabold text-zinc-950">
                {getFilterLabel(activeFilter)}
              </Text>
              <Text className="text-sm font-semibold text-zinc-400">
                {filteredMeals.length} bữa ăn
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyMealLog />}
        contentContainerStyle={{ paddingBottom: 28 }}
      />
    </SafeAreaView>
  );
}
