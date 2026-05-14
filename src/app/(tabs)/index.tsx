import {
  Bell,
  Calendar,
  ChevronRight,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import {
  buildWeekDays,
  type WeekDay,
} from '@/app/(tabs)/recommendation/_components/weekly-calendar';
import { WeeklyCalendar } from '@/app/(tabs)/recommendation/_components/weekly-calendar';
import {
  FocusAwareStatusBar,
  Image,
  NutritionItem,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { ICON_SIZE_LARGE, ICON_SIZE_MEDIUM } from '@/constants/common';
import { useAuth } from '@/lib';
import { type DailyPlan } from '@/models/interfaces/recommendation';

// `theme.ts` is CommonJS because Tailwind config requires it directly.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { colors } = require('@/constants/theme') as {
  colors: {
    black: string;
    primary: { DEFAULT: string };
  };
};

const WEEKDAY_LABELS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const avocadoImg = require('../../../assets/voca_home.png');

type MenuItem = {
  id: string;
  title: string;
  calories: string;
  imageUrl: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'beef-steak',
    title: 'Bò bít tết',
    calories: '700.2 Kcal',
    imageUrl:
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600&auto=format&fit=crop',
  },
  {
    id: 'pan-fried-beef',
    title: 'Bò né ốp la',
    calories: '402.05 Kcal',
    imageUrl:
      'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop',
  },
  {
    id: 'chicken-salad',
    title: 'Salad ức gà',
    calories: '358 Kcal',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop',
  },
];

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getMonday(date: Date): Date {
  const monday = new Date(date);
  const day = monday.getDay();
  const distanceToMonday = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function buildMockPlan(startDate: Date): DailyPlan[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    return {
      day: index + 1,
      date: formatDateKey(date),
      meals: {
        breakfast: [],
        lunch: [],
        dinner: [],
      },
      nutrition: {
        calories: 0,
        protein: 0,
        fat: 0,
        carb: 0,
      },
    };
  });
}

function HeaderIcon({ Icon }: { Icon: LucideIcon }) {
  return (
    <Pressable className="size-12 items-center justify-center ">
      <Icon size={ICON_SIZE_LARGE} color={colors.black} strokeWidth={2} />
    </Pressable>
  );
}

function EnergyMeter() {
  return (
    <View
      className="mt-4 overflow-hidden rounded-3xl bg-primary px-5 pb-5 pt-4"
      style={cardShadow}
    >
      <Text className="text-xl font-bold text-white">Năng lượng</Text>
      <View className="mt-1 items-center">
        <View className="h-36 w-56 items-center justify-center">
          <Svg width={224} height={104} viewBox="0 0 224 104">
            <Path
              d="M44 86 A68 68 0 0 1 180 86"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={24}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M44 86 A68 68 0 0 1 180 86"
              stroke="#FFFFFF"
              strokeWidth={24}
              strokeLinecap="round"
              fill="none"
              strokeDasharray="148 214"
            />
          </Svg>
          <View className="absolute bottom-0 w-full flex-row justify-between px-6">
            <Text className="text-sm text-white">0</Text>
            <Text className="text-sm text-white">2330</Text>
          </View>
          <Text className="absolute bottom-0 text-3xl font-bold text-white">
            1672
          </Text>
        </View>
        <Text className="text-base text-white">còn lại</Text>
      </View>
    </View>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  return (
    <Pressable
      className="mr-4 w-40 overflow-hidden rounded-3xl bg-secondary-200 px-3 pb-5 pt-4"
      style={cardShadow}
    >
      <View className="items-center">
        <Image
          source={{ uri: item.imageUrl }}
          className="size-24 rounded-full bg-white"
          contentFit="cover"
        />
      </View>
      <Text className="mt-5 text-center text-lg font-semibold text-neutral-800">
        {item.title}
      </Text>
      <Text className="mt-2 text-center text-base text-neutral-700">
        {item.calories}
      </Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const userInfor = useAuth.use.userInfor();
  const displayName = userInfor?.name?.trim() || 'Long Đặng';
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  const monday = useMemo(() => getMonday(today), [today]);
  const weekDays = useMemo<WeekDay[]>(
    () => buildWeekDays(buildMockPlan(monday), formatDateKey(monday)),
    [monday]
  );
  const [selectedDayKey, setSelectedDayKey] = useState(formatDateKey(today));

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 28 }}
      >
        <View className="mt-6 px-6">
          <View className="flex-row items-center justify-between">
            <HeaderIcon Icon={Calendar} />
            <View>
              <HeaderIcon Icon={Bell} />
              <View
                className="absolute right-2 top-2 size-3 rounded-full"
                style={{ backgroundColor: colors.primary.DEFAULT }}
              />
            </View>
          </View>

          <View className=" min-h-36 flex-row  justify-between">
            <View className="flex flex-1 items-center justify-center">
              <Text className="text-4xl font-bold leading-10 text-foreground">
                Xin chào,{'\n'}
                {displayName}
              </Text>
            </View>
            <View className="w-36 items-start ">
              <Image
                source={avocadoImg}
                className="h-36 w-40"
                contentFit="contain"
              />
            </View>
          </View>
        </View>

        <View className="mt-2">
          <WeeklyCalendar
            weekDays={weekDays}
            selectedDayKey={selectedDayKey}
            onSelectDay={setSelectedDayKey}
            activeColor={colors.primary.DEFAULT}
            borderColor={'transparent'}
            dayLabelFormatter={(date) => WEEKDAY_LABELS[date.getDay()]}
            hasDataBackgroundColor="#FFFFFF"
            hasDataDotColor={colors.primary.DEFAULT}
          />
        </View>

        <View className="px-6">
          <Text className="mt-4 text-2xl font-semibold text-neutral-800">
            Quản lý calo thông minh
          </Text>

          <EnergyMeter />

          <NutritionItem protein={28} carb={12} fat={18} className="mt-4" />

          <View className="mt-6 flex-row items-center justify-between">
            <Text className="text-2xl font-semibold text-neutral-800">
              Gợi ý thực đơn
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-base text-neutral-400">Xem thêm</Text>
              <ChevronRight
                size={ICON_SIZE_MEDIUM}
                color="#9CA3AF"
                strokeWidth={2.2}
              />
            </Pressable>
          </View>
        </View>

        <FlatList
          data={MENU_ITEMS}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MenuCard item={item} />}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24 }}
        />
      </ScrollView>
    </View>
  );
}

const cardShadow = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      },
      android: {
        elevation: 5,
      },
    }),
  },
}).shadow;
