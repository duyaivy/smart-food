import { Ionicons } from '@expo/vector-icons';
import { router, Tabs } from 'expo-router';
import React from 'react';
import {
  Alert,
  DeviceEventEmitter,
  Pressable,
  RefreshControl,
} from 'react-native';

import { FridgeItemCard } from '@/app/(stacks)/fridge/_components/fridge-item-card';
import { FridgeItemFormSheet } from '@/app/(stacks)/fridge/_components/fridge-item-form-sheet';
import { FridgeSearchBar } from '@/app/(stacks)/fridge/_components/fridge-search-bar';
import {
  ActivityIndicator,
  FocusAwareStatusBar,
  List,
  Text,
  View,
} from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { showMessage } from '@/lib/common/show-message';
import { type EnrichedFridgeItem, useFridge } from '@/lib/hooks/use-fridge';
import {
  IOT_ADD_TO_FRIDGE_EVENT,
  type IotAddToFridgeEventPayload,
} from '@/lib/hooks/use-iot-sse';
import type { FridgeItemPriority } from '@/models/types/fridge';

type SheetState =
  | {
      mode: 'add';
      item?: null;
      initialIngredientName?: string;
      initialQuantity?: string;
    }
  | {
      mode: 'edit';
      item: EnrichedFridgeItem;
    };

export default function FridgeScreen() {
  const {
    createItem,
    deleteItem,
    error,
    fetchNextPage,
    filters,
    fridgeItems,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isMutating,
    refetch,
    setSearch,
    updateItem,
  } = useFridge();

  const [sheetState, setSheetState] = React.useState<SheetState | null>(null);

  const closeSheet = React.useCallback(() => setSheetState(null), []);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      IOT_ADD_TO_FRIDGE_EVENT,
      (payload: IotAddToFridgeEventPayload) => {
        setSheetState({
          mode: 'add',
          initialIngredientName: payload.ingredientName,
          initialQuantity: payload.quantity,
        });
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

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
              await deleteItem(id);
            },
          },
        ]
      );
    },
    [deleteItem]
  );

  const handleSubmitSheet = React.useCallback(
    async (values: {
      ingredientId: number;
      quantity: number;
      dueDate: string;
      priority: FridgeItemPriority;
    }) => {
      if (sheetState?.mode === 'edit') {
        const updatedItem = await updateItem(sheetState.item.id, {
          quantity: values.quantity,
          dueDate: values.dueDate,
          priority: values.priority,
        });

        if (updatedItem) {
          return true;
        }

        return false;
      }

      const createdItem = await createItem({
        ingredientId: values.ingredientId,
        quantity: values.quantity,
        dueDate: values.dueDate,
        priority: values.priority,
      });

      if (createdItem) {
        return true;
      }

      showMessage({
        message: 'Thêm thất bại',
        description: 'Không thể thêm nguyên liệu vào tủ lạnh.',
        type: 'error',
      });

      return false;
    },
    [createItem, sheetState, updateItem]
  );

  return (
    <View className="flex-1 bg-white px-4">
      <Tabs.Screen
        options={{
          title: 'Tủ lạnh',
          headerShown: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              disabled={isMutating}
              hitSlop={12}
              className="mr-4 rounded-full px-3 py-2"
              onPress={() => setSheetState({ mode: 'add' })}
            >
              <Text
                className={`text-base font-semibold ${
                  isMutating ? 'text-zinc-400' : 'text-secondary'
                }`}
              >
                Thêm
              </Text>
            </Pressable>
          ),
        }}
      />

      <FocusAwareStatusBar />

      <View className="mt-4 flex-row items-center gap-2">
        <FridgeSearchBar value={filters.search} onChangeText={setSearch} />

        <Pressable hitSlop={12} className="size-11 items-center justify-center">
          <Ionicons name="filter-outline" size={32} color="#999999" />
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
          <List
            data={fridgeItems}
            keyExtractor={(item) => item.id.toString()}
            estimatedItemSize={112}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 8 }}
            ItemSeparatorComponent={() => <View className="h-2" />}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
            onEndReached={hasNextPage ? fetchNextPage : undefined}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="py-4">
                  <ActivityIndicator />
                </View>
              ) : null
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
                onEdit={() => setSheetState({ mode: 'edit', item })}
                onDelete={() => handleDelete(item.id)}
              />
            )}
          />
        </View>
      )}

      <FridgeItemFormSheet
        visible={Boolean(sheetState)}
        mode={sheetState?.mode ?? 'add'}
        item={sheetState?.mode === 'edit' ? sheetState.item : null}
        initialIngredientName={
          sheetState?.mode === 'add'
            ? sheetState.initialIngredientName
            : undefined
        }
        initialQuantity={
          sheetState?.mode === 'add' ? sheetState.initialQuantity : undefined
        }
        loading={isMutating}
        onClose={closeSheet}
        onSubmit={handleSubmitSheet}
      />
    </View>
  );
}
