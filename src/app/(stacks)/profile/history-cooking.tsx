import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SlidersHorizontal, UtensilsCrossed } from 'lucide-react-native';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FocusAwareStatusBar, Text } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { ROUTE } from '@/constants/route';
import { useGetMealHistoryQuery } from '@/lib/hooks/queries/meal.query';
import type { MealHistoryListItem } from '@/models/interfaces/meal';

import { MealCard } from './_components/meal-card';

const formatDisplayDate = (date: Date): string => {
  const d = date.getDate().toString().padStart(2, '0');
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
};

type GroupedMeals = {
  dateKey: string;
  date: Date;
  meals: MealHistoryListItem[];
};

const formatDateLabel = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return { day: day.toString(), month: `Thg ${month}` };
};

export default function HistoryCookingScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { bottom } = useSafeAreaInsets();

  const [page, setPage] = useState(1);
  // Applied dates — drive the actual API query
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  // Draft dates — only used inside the modal, committed on "Xác nhận"
  const [draftFrom, setDraftFrom] = useState<Date | undefined>();
  const [draftTo, setDraftTo] = useState<Date | undefined>();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [allMeals, setAllMeals] = useState<MealHistoryListItem[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching } = useGetMealHistoryQuery({
    page,
    limit: 10,
    fromDate,
    toDate,
    sortBy: 'CREATED_AT',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (data?.data) {
      const newMeals = data.data.results;
      if (page === 1) {
        setAllMeals(newMeals);
      } else {
        setAllMeals((prev) => [...prev, ...newMeals]);
      }
      const { total, page: currentPage, limit } = data.data.control;
      setHasMore(currentPage * limit < total);
    }
  }, [data, page, allMeals.length]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setDraftFrom(fromDate);
            setDraftTo(toDate);
            setFilterModalVisible(true);
          }}
          className="pr-2"
        >
          <SlidersHorizontal
            size={20}
            color={fromDate || toDate ? '#22C55E' : '#1A1A1A'}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, fromDate, toDate]);

  const handleLoadMore = () => {
    if (!isFetching && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const handleApplyFilter = () => {
    setFromDate(draftFrom);
    setToDate(draftTo);
    setPage(1);
    setFilterModalVisible(false);
  };

  const handleClearFromModal = () => {
    setDraftFrom(undefined);
    setDraftTo(undefined);
    setFromDate(undefined);
    setToDate(undefined);
    setPage(1);
    setFilterModalVisible(false);
  };

  // Group meals by date
  const groupedMeals = useMemo(() => {
    const groups = new Map<string, MealHistoryListItem[]>();
    for (const meal of allMeals) {
      const dateKey = meal.eatenAt.split('T')[0];
      if (!groups.has(dateKey)) groups.set(dateKey, []);
      groups.get(dateKey)!.push(meal);
    }

    const sortedGroups: GroupedMeals[] = Array.from(groups.entries())
      .map(([dateKey, meals]) => ({
        dateKey,
        date: new Date(dateKey),
        meals: meals.sort(
          (a, b) =>
            new Date(b.eatenAt).getTime() - new Date(a.eatenAt).getTime()
        ),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    return sortedGroups;
  }, [allMeals]);

  const renderItem = ({ item: group }: { item: GroupedMeals }) => {
    const { day, month } = formatDateLabel(group.date);

    return (
      <View className="mb-4 flex-row px-4">
        <View className="mr-2 w-14 items-center">
          <Text className="text-2xl font-bold text-foreground">{day}</Text>
          <Text className="text-muted-foreground text-sm">{month}</Text>
          <View className="my-1 w-px flex-1 bg-neutral-200" />
        </View>

        <View className="flex-1">
          {group.meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              onPress={() =>
                router.push({
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  pathname: ROUTE.STACK.PROFILE.MEAL_DETAIL as any,
                  params: { mealLogId: meal.id },
                })
              }
            />
          ))}
        </View>
      </View>
    );
  };

  if (isLoading && page === 1) {
    return (
      <View className="flex-1 gap-4 bg-white p-4">
        <FocusAwareStatusBar />
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      <FlatList
        data={groupedMeals}
        keyExtractor={(item) => item.dateKey}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={null}
        ListEmptyComponent={
          !isLoading ? (
            <View className="mt-24 flex-1 items-center justify-center px-6">
              <UtensilsCrossed
                size={60}
                className="text-muted-foreground mb-4"
                color="#9CA3AF"
              />
              <Text className="text-center text-lg font-semibold">
                Chưa có bữa ăn nào
              </Text>
              <Text className="text-muted-foreground mt-1 text-center text-sm">
                {fromDate || toDate
                  ? 'Không tìm thấy bữa ăn trong khoảng thời gian này.'
                  : 'Hãy ghi lại bữa ăn đầu tiên của bạn.'}
              </Text>
              {(fromDate || toDate) && (
                <TouchableOpacity
                  onPress={() => {
                    setDraftFrom(fromDate);
                    setDraftTo(toDate);
                    setFilterModalVisible(true);
                  }}
                  className="mt-4 rounded-xl border border-primary px-6 py-3"
                >
                  <Text className="text-sm font-semibold text-primary">
                    Thay đổi bộ lọc
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 20 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View className="items-center py-4">
              <ActivityIndicator size="small" />
            </View>
          ) : hasMore && allMeals.length > 0 ? (
            <TouchableOpacity
              onPress={handleLoadMore}
              className="bg-muted mx-6 mt-2 items-center rounded-xl py-3"
            >
              <Text className="font-medium text-primary">Xem thêm</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      <Modal
        visible={filterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        {/* Backdrop che full màn hình, tách biệt khỏi sheet */}
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          className="bg-black/40"
          onPress={() => setFilterModalVisible(false)}
        />

        {/* Sheet fixed ở đáy màn hình */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: Math.max(bottom, 32),
          }}
          className="rounded-t-3xl bg-white px-6 pt-5"
        >
          <View className="mb-5 h-1 w-10 self-center rounded-full bg-neutral-300" />
          <Text className="mb-4 text-base font-bold">Lọc theo ngày</Text>

          <View className="mb-6 flex-row gap-3">
            <TouchableOpacity
              onPress={() => setShowFromPicker(true)}
              className={`flex-1 items-center rounded-xl border py-3 ${
                draftFrom
                  ? 'border-primary bg-primary/10'
                  : 'bg-muted border-border'
              }`}
            >
              <Text className="text-muted-foreground mb-0.5 text-xs">
                Từ ngày
              </Text>
              <Text
                className={`text-sm font-semibold ${draftFrom ? 'text-primary' : 'text-foreground'}`}
              >
                {draftFrom ? formatDisplayDate(draftFrom) : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowToPicker(true)}
              className={`flex-1 items-center rounded-xl border py-3 ${
                draftTo
                  ? 'border-primary bg-primary/10'
                  : 'bg-muted border-border'
              }`}
            >
              <Text className="text-muted-foreground mb-0.5 text-xs">
                Đến ngày
              </Text>
              <Text
                className={`text-sm font-semibold ${draftTo ? 'text-primary' : 'text-foreground'}`}
              >
                {draftTo ? formatDisplayDate(draftTo) : 'Chọn ngày'}
              </Text>
            </TouchableOpacity>
          </View>

          {(draftFrom || draftTo) && (
            <TouchableOpacity
              onPress={handleClearFromModal}
              className="mb-3 items-center rounded-xl border border-border py-3"
            >
              <Text className="text-muted-foreground text-sm font-medium">
                Xóa bộ lọc
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleApplyFilter}
            className="items-center rounded-xl bg-primary py-3"
          >
            <Text className="text-sm font-bold text-white">Xác nhận</Text>
          </TouchableOpacity>
        </View>

        {showFromPicker && (
          <DateTimePicker
            value={draftFrom || new Date()}
            mode="date"
            display="default"
            onChange={(_, d) => {
              setShowFromPicker(false);
              if (d) setDraftFrom(d);
            }}
          />
        )}

        {showToPicker && (
          <DateTimePicker
            value={draftTo || new Date()}
            mode="date"
            display="default"
            onChange={(_, d) => {
              setShowToPicker(false);
              if (d) setDraftTo(d);
            }}
          />
        )}
      </Modal>
    </View>
  );
}
