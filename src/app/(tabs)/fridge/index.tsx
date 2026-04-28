import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Pressable, RefreshControl } from 'react-native';

import { FridgeItemCard } from '@/app/(stacks)/fridge/_components/fridge-item-card';
import { FridgeSearchBar } from '@/app/(stacks)/fridge/_components/fridge-search-bar';
import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { useFridge } from '@/lib/hooks/use-fridge';

export default function FridgeScreen() {
  const {
    deleteItem,
    error,
    filters,
    fridgeItems,
    isLoading,
    isMutating,
    refetch,
    setSearch,
  } = useFridge();

  const handleDelete = React.useCallback(
    (id: number) => {
      Alert.alert(
        'Xóa nguyên liệu',
        'Bạn có chắc muốn xóa nguyên liệu này khỏi tủ lạnh?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              const ok = await deleteItem(id);
              if (ok) {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { showMessage } = require('@/lib/common/show-message');
                showMessage({
                  message: 'Đã xóa',
                  description: 'Nguyên liệu đã được xóa khỏi tủ lạnh',
                  type: 'success',
                });
              } else {
                const { showMessage } = require('@/lib/common/show-message');
                showMessage({
                  message: 'Xóa thất bại',
                  description: 'Không thể xóa nguyên liệu.',
                  type: 'error',
                });
              }
            },
          },
        ]
      );
    },
    [deleteItem]
  );

  return (
    <View className="flex-1 bg-white px-8">
      <Tabs.Screen
        options={{
          title: 'Tủ lạnh',
          headerShown: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <FocusAwareStatusBar />

      <View className="mt-4 flex-row items-start gap-3">
        <FridgeSearchBar value={filters.search} onChangeText={setSearch} />

        <Pressable
          hitSlop={12}
          className="mt-1 size-12 items-center justify-center"
        >
          <Ionicons name="filter-outline" size={36} color="#999999" />
        </Pressable>
      </View>

      {error ? (
        <Text className="mt-2 text-sm text-red-500">{error}</Text>
      ) : null}

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View className="flex-1">
          <FlatList
            data={fridgeItems}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 28, paddingBottom: 8, gap: 22 }}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            ListEmptyComponent={
              <View className="mt-16 items-center">
                <Text className="text-base font-semibold text-zinc-600">
                  Chưa có nguyên liệu trong tủ lạnh
                </Text>

                <Text className="mt-2 text-center text-sm text-zinc-400">
                  Thêm nguyên liệu thủ công hoặc thông qua thiết bị IoT.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <FridgeItemCard
                item={item}
                onPress={() =>
                  router.push({
                    pathname: ROUTE.STACK.DISCOVER.INGREDIENT_DETAIL,
                    params: { id: item.ingredientId },
                  })
                }
                onEdit={() =>
                  router.push({
                    pathname: ROUTE.STACK.FRIDGE.EDIT_INGREDIENT,
                    params: { id: item.id },
                  })
                }
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        </View>
      )}

      <View className="mt-4 pb-6">
        <Button
          disabled={isMutating}
          className="h-[72px] rounded-[18px] bg-[#67BE70]"
          onPress={() => router.push(ROUTE.STACK.FRIDGE.ADD_INGREDIENT)}
        >
          <Ionicons name="add" size={42} color="#FFFFFF" />
        </Button>
      </View>
    </View>
  );
}
