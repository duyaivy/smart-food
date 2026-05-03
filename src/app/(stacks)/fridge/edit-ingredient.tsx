import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Platform, Pressable, ScrollView } from 'react-native';

import {
  ActivityIndicator,
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  Image,
  Text,
  View,
} from '@/components/ui';
import { priorityOptions } from '@/constants/fridge';
import { ROUTE } from '@/constants/route';
import { showMessage } from '@/lib/common/show-message';
import { useFridge } from '@/lib/hooks/use-fridge';
import {
  formatDateDisplay,
  formatDateInput,
  toDueDateIso,
} from '@/lib/utils/date-time';
import { formatUnitLabel } from '@/lib/utils/unit';
import {
  FridgeItemPriority,
  FridgeItemPriorityValue,
} from '@/models/types/fridge';
import {
  editFridgeItemFormSchema,
  type EditFridgeItemFormValues,
} from '@/schemas/fridge.schema';

export default function EditIngredientScreen() {
  const { id } = useLocalSearchParams<{ id: string | string[] }>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const initializedItemRef = React.useRef<number | null>(null);

  const normalizedId = useMemo(() => {
    const raw = Array.isArray(id) ? (id[0] ?? '') : (id ?? '');

    return parseInt(raw, 10);
  }, [id]);

  const { error, fridgeItem, isMutating, updateItem } = useFridge(normalizedId);

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<EditFridgeItemFormValues>({
    resolver: zodResolver(editFridgeItemFormSchema),
    defaultValues: {
      quantity: '',
      dueDate: '',
      priority: FridgeItemPriority.MEDIUM,
    },
  });

  const dueDate = useWatch({ control, name: 'dueDate' }) ?? '';

  React.useEffect(() => {
    if (!fridgeItem || initializedItemRef.current === fridgeItem.id) return;

    reset({
      quantity: String(fridgeItem.quantity),
      dueDate: formatDateInput(fridgeItem.dueDate),
      priority: fridgeItem.priority,
    });
    initializedItemRef.current = fridgeItem.id;
  }, [fridgeItem, reset]);

  const handleUpdate = async (values: EditFridgeItemFormValues) => {
    const parsedDueDate = toDueDateIso(values.dueDate);

    if (!parsedDueDate) return;

    const updatedItem = await updateItem({
      quantity: Number(values.quantity),
      dueDate: parsedDueDate,
      priority: values.priority,
    });

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

  const ingredient = fridgeItem.ingredient;
  const imageUrl = ingredient?.images?.[0];

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
        <View className="flex-row items-center gap-4">
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              className="size-20 rounded-xl bg-zinc-200"
              contentFit="cover"
            />
          ) : (
            <View className="size-20 items-center justify-center rounded-xl bg-zinc-200">
              <Ionicons name="image-outline" size={28} color="#71717A" />
            </View>
          )}

          <View className="flex-1">
            <Text className="text-xl font-bold text-zinc-950">
              {ingredient?.name ?? `Nguyên liệu #${fridgeItem.ingredientId}`}
            </Text>

            <Text className="mt-1 text-sm text-zinc-500">
              Đơn vị: {formatUnitLabel(ingredient?.unit ?? '') || 'Chưa có'}
            </Text>
          </View>
        </View>

        <View className="mt-8">
          <ControlledInput<EditFridgeItemFormValues>
            control={control}
            name="quantity"
            label="Số lượng"
            keyboardType="numeric"
          />

          <Controller
            control={control}
            name="dueDate"
            render={({ field, fieldState }) => (
              <View className="mt-3">
                <Text
                  className={`mb-1 text-lg ${
                    fieldState.error ? 'text-danger-600' : 'text-zinc-700'
                  }`}
                >
                  Ngày hết hạn
                </Text>

                <Pressable
                  className={`h-12 justify-center rounded-xl border bg-white px-4 ${
                    fieldState.error ? 'border-danger-600' : 'border-zinc-300'
                  }`}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text
                    className={field.value ? 'text-zinc-900' : 'text-zinc-400'}
                  >
                    {field.value
                      ? formatDateDisplay(field.value)
                      : 'Chọn ngày (DD-MM-YYYY)'}
                  </Text>
                </Pressable>

                {fieldState.error ? (
                  <Text className="mt-1 text-sm text-danger-400">
                    {fieldState.error.message}
                  </Text>
                ) : null}

                {showDatePicker ? (
                  <DateTimePicker
                    value={
                      dueDate ? new Date(`${dueDate}T00:00:00`) : new Date()
                    }
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                    onChange={(_, selected) => {
                      setShowDatePicker(Platform.OS === 'ios');
                      if (selected) {
                        field.onChange(formatDateInput(selected));
                      }
                    }}
                  />
                ) : null}
              </View>
            )}
          />

          <Text className="mb-2 mt-3 text-lg text-zinc-700">
            Mức độ ưu tiên
          </Text>

          <Controller
            control={control}
            name="priority"
            render={({ field }) => (
              <View className="gap-3">
                {priorityOptions.map((option) => {
                  const selected = field.value === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => field.onChange(option)}
                      className={`h-14 w-full items-center justify-center rounded-xl ${
                        selected
                          ? 'bg-secondary'
                          : 'border border-zinc-300 bg-white'
                      }`}
                    >
                      <Text
                        className={`text-center text-base ${
                          selected ? 'text-white' : 'text-zinc-900'
                        }`}
                      >
                        {FridgeItemPriorityValue[option]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          />

          {error ? (
            <Text className="mt-3 text-sm text-red-500">{error}</Text>
          ) : null}
        </View>

        <View className="mt-8 flex-row gap-4">
          <Button
            label="Hủy bỏ"
            variant="outline"
            className="flex-1 border-red-500"
            textClassName="text-red-500"
            disabled={isMutating || isSubmitting}
            onPress={() => router.replace(ROUTE.TAB.FRIDGE)}
          />

          <Button
            label="Cập nhật"
            className="flex-1 bg-secondary"
            loading={isMutating || isSubmitting}
            onPress={handleSubmit(handleUpdate)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
