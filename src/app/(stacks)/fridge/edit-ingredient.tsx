import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Platform, Pressable } from 'react-native';

import {
  ActivityIndicator,
  Button,
  FocusAwareStatusBar,
  Input,
  Text,
  View,
} from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ROUTE } from '@/constants/route';
import { showMessage } from '@/lib/common/show-message';
import { useFridge } from '@/lib/hooks/use-fridge';
import {
  FridgeItemPriority,
  FridgeItemPriorityValue,
} from '@/models/types/fridge';
import { priorityOptions } from '@/constants/fridge';
import { formatDateInput, toDueDateIso } from '@/lib/utils/fridge';

export default function EditIngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();

  const normalizedId = useMemo(() => {
    const raw = Array.isArray(id) ? (id[0] ?? '') : (id ?? '');

    return parseInt(raw, 10);
  }, [id]);

  const { error, fridgeItem, isMutating, updateItem } = useFridge(normalizedId);

  const [quantity, setQuantity] = useState(() =>
    fridgeItem?.quantity != null ? String(fridgeItem.quantity) : ''
  );
  const [dueDate, setDueDate] = useState(() =>
    formatDateInput(fridgeItem?.dueDate)
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<FridgeItemPriority>(
    fridgeItem?.priority ?? FridgeItemPriority.MEDIUM
  );
  const [formError, setFormError] = useState<string | null>(null);
  const initializedRef = React.useRef(false);
  const priorityRef = React.useRef<FridgeItemPriority | null>(
    fridgeItem?.priority ?? null
  );

  React.useEffect(() => {
    if (!fridgeItem) return;
    // initialize local form state from fridgeItem only once to avoid
    // overwriting user selections if the store updates while editing
    if (initializedRef.current) return;

    setQuantity(String(fridgeItem.quantity));
    setDueDate(formatDateInput(fridgeItem.dueDate));
    setPriority(fridgeItem.priority);
    priorityRef.current = fridgeItem.priority;
    initializedRef.current = true;
  }, [fridgeItem]);

  const handleSubmit = async () => {
    const parsedQuantity = Number(quantity);
    const parsedDueDate = toDueDateIso(dueDate);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      setFormError('Số lượng không hợp lệ.');

      return;
    }

    if (!parsedDueDate) {
      setFormError('Ngày hết hạn không hợp lệ. Định dạng đúng: YYYY-MM-DD.');

      return;
    }

    setFormError(null);

    const updatedItem = await updateItem({
      quantity: parsedQuantity,
      dueDate: parsedDueDate,
      priority,
    });
    // Debug payload
    // eslint-disable-next-line no-console
    console.debug('UpdateFridgeItem payload', { quantity: parsedQuantity, dueDate: parsedDueDate, priority });

    if (updatedItem) {
      showMessage({
        message: 'Cập nhật thành công',
        description: 'Nguyên liệu đã được cập nhật',
        type: 'success',
      });

      router.replace(ROUTE.TAB.FRIDGE);
      return;
    }

    showMessage({
      message: 'Cập nhật thất bại',
      description: 'Không thể cập nhật nguyên liệu.',
      type: 'error',
    });
  };

  if (!Number.isFinite(normalizedId) || !fridgeItem) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Stack.Screen
          options={{
            title: 'Chỉnh sửa nguyên liệu',
            headerShown: true,
            headerTitleAlign: 'center',
            headerShadowVisible: false,
          }}
        />

        <ActivityIndicator size="large" />

        <Text className="mt-4 text-center text-zinc-500">
          Đang tải thông tin nguyên liệu trong tủ lạnh...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          title: 'Chỉnh sửa nguyên liệu',
          headerShown: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />

      <FocusAwareStatusBar />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
      >
        <Text className="text-sm text-zinc-500">
          {fridgeItem.ingredient?.name ??
            `Nguyên liệu #${fridgeItem.ingredientId}`}
        </Text>

        <View className="mt-8">
          <Input
            label="Số lượng"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
          />

          <View className="mt-3">
            <Text className="text-sm text-zinc-600 mb-2">Ngày hết hạn</Text>

            <Pressable
              className="h-[48px] rounded-xl border border-zinc-300 px-4 justify-center bg-white"
              onPress={() => setShowDatePicker(true)}
            >
              <Text className={`${dueDate ? 'text-zinc-900' : 'text-zinc-400'}`}>
                {dueDate || 'Chọn ngày (YYYY-MM-DD)'}
              </Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                onChange={(event, selected) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selected) {
                    const iso = selected.toISOString().slice(0, 10);
                    setDueDate(iso);
                  }
                }}
              />
            )}
          </View>

          <Text className="my-2 text-lg text-zinc-700">Mức độ ưu tiên</Text>

          <View className="flex-row flex-wrap gap-3">
            {priorityOptions.map((option) => {
              const selected = priority === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setPriority(option);
                    priorityRef.current = option;
                    // Debug: log priority selection to Metro console to confirm state
                    // eslint-disable-next-line no-console
                    console.debug('EditIngredient: priority selected', option);
                  }}
                  className={`${selected ? 'bg-[#67BE70]' : 'border border-zinc-300 bg-white'} h-14 w-[48%] rounded-xl items-center justify-center`}
                >
                  <Text className={`text-center text-base ${selected ? 'text-white' : 'text-zinc-900'}`}>
                    {FridgeItemPriorityValue[option]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {formError || error ? (
            <Text className="mt-3 text-sm text-red-500">
              {formError ?? error}
            </Text>
          ) : null}
        </View>

        <View className="mt-8 flex-row gap-4">
          <Button
            label="Hủy bỏ"
            variant="outline"
            className="flex-1 border-red-500"
            textClassName="text-red-500"
            disabled={isMutating}
            onPress={() => router.replace(ROUTE.TAB.FRIDGE)}
          />

          <Button
            label="Cập nhật"
            className="flex-1 bg-[#67BE70]"
            loading={isMutating}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
