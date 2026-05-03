import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Platform, Pressable, ScrollView } from 'react-native';

import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  Input,
  Text,
  View,
} from '@/components/ui';
import { priorityOptions } from '@/constants/fridge';
import { ROUTE } from '@/constants/route';
import { showMessage } from '@/lib/common/show-message';
import { useFridge } from '@/lib/hooks/use-fridge';
import { useIngredient } from '@/lib/hooks/use-ingredient';
import {
  formatDateDisplay,
  formatDateInput,
  toDueDateIso,
} from '@/lib/utils/date-time';
import { normalizeText } from '@/lib/utils/format';
import { formatUnitLabel } from '@/lib/utils/unit';
import {
  FridgeItemPriority,
  FridgeItemPriorityValue,
} from '@/models/types/fridge';
import {
  addFridgeItemFormSchema,
  type AddFridgeItemFormValues,
} from '@/schemas/fridge.schema';

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default function AddIngredientScreen() {
  const params = useLocalSearchParams<{
    ingredientName?: string | string[];
    quantity?: string | string[];
  }>();
  const { ingredients } = useIngredient();
  const { createItem, error, isMutating } = useFridge();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const initialIngredientName = getParamValue(params.ingredientName);
  const initialQuantity = getParamValue(params.quantity);
  const appliedInitialIngredientRef = React.useRef(false);

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    setValue,
  } = useForm<AddFridgeItemFormValues>({
    resolver: zodResolver(addFridgeItemFormSchema),
    defaultValues: {
      ingredientId: 0,
      ingredientText: initialIngredientName,
      quantity: initialQuantity,
      dueDate: '',
      priority: FridgeItemPriority.MEDIUM,
    },
  });

  const ingredientText = useWatch({ control, name: 'ingredientText' }) ?? '';
  const ingredientId = useWatch({ control, name: 'ingredientId' }) ?? 0;
  const dueDate = useWatch({ control, name: 'dueDate' }) ?? '';

  const selectedIngredient = useMemo(
    () =>
      ingredientId > 0
        ? (ingredients.find((ingredient) => ingredient.id === ingredientId) ??
          null)
        : null,
    [ingredientId, ingredients]
  );

  const suggestions = useMemo(() => {
    const q = normalizeText(ingredientText);

    if (!q) return ingredients.slice(0, 5);

    return ingredients
      .filter((ingredient) => normalizeText(ingredient.name).includes(q))
      .slice(0, 5);
  }, [ingredientText, ingredients]);

  React.useEffect(() => {
    if (
      appliedInitialIngredientRef.current ||
      !initialIngredientName ||
      ingredients.length === 0
    ) {
      return;
    }

    const matchedIngredient = ingredients.find(
      (ingredient) =>
        normalizeText(ingredient.name) === normalizeText(initialIngredientName)
    );

    if (matchedIngredient) {
      setValue('ingredientId', matchedIngredient.id, { shouldValidate: true });
      setValue('ingredientText', matchedIngredient.name, {
        shouldValidate: true,
      });
    }

    appliedInitialIngredientRef.current = true;
  }, [ingredients, initialIngredientName, setValue]);

  React.useEffect(() => {
    if (!ingredientText || ingredientId > 0) return;

    const matchedIngredient = ingredients.find(
      (ingredient) =>
        normalizeText(ingredient.name) === normalizeText(ingredientText)
    );

    if (!matchedIngredient) return;

    setValue('ingredientId', matchedIngredient.id, { shouldValidate: true });
    setValue('ingredientText', matchedIngredient.name, {
      shouldValidate: true,
    });
  }, [ingredientId, ingredientText, ingredients, setValue]);

  const handleCreate = async (values: AddFridgeItemFormValues) => {
    const parsedDueDate = toDueDateIso(values.dueDate);

    if (!parsedDueDate) return;

    const createdItem = await createItem({
      ingredientId: values.ingredientId,
      quantity: Number(values.quantity),
      dueDate: parsedDueDate,
      priority: values.priority,
    });

    if (createdItem) {
      const ingredientName =
        selectedIngredient?.name || values.ingredientText.trim();

      showMessage({
        message: 'Đã thêm vào tủ lạnh',
        description: `${ingredientName} đã được thêm`,
        type: 'success',
      });

      router.replace(ROUTE.TAB.FRIDGE);
      return;
    }

    showMessage({
      message: 'Thêm thất bại',
      description: 'Không thể thêm nguyên liệu vào tủ lạnh.',
      type: 'error',
    });
  };

  return (
    <View className="flex-1 bg-white">
      <FocusAwareStatusBar />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
      >
        <View>
          <Controller
            control={control}
            name="ingredientText"
            render={({ field }) => (
              <Input
                label="Tên nguyên liệu"
                value={field.value}
                onChangeText={(value) => {
                  field.onChange(value);
                  setValue('ingredientId', 0, { shouldValidate: true });
                }}
                placeholder="Cà chua"
                error={
                  errors.ingredientId?.message ?? errors.ingredientText?.message
                }
              />
            )}
          />

          {ingredientText.length > 0 && !selectedIngredient ? (
            <View className="mb-4 rounded-xl border border-zinc-200 bg-white">
              {suggestions.map((ingredient) => (
                <Pressable
                  key={ingredient.id}
                  className="border-b border-zinc-100 px-4 py-3 last:border-b-0"
                  onPress={() => {
                    setValue('ingredientId', ingredient.id, {
                      shouldValidate: true,
                    });
                    setValue('ingredientText', ingredient.name, {
                      shouldValidate: true,
                    });
                  }}
                >
                  <Text className="font-semibold text-zinc-900">
                    {ingredient.name}
                  </Text>

                  <Text className="mt-1 text-xs text-zinc-400">
                    Đơn vị: {formatUnitLabel(ingredient.unit) || 'Chưa có'}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}

          <ControlledInput<AddFridgeItemFormValues>
            control={control}
            name="quantity"
            label="Số lượng"
            placeholder="500"
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
            label="Xác nhận"
            className="flex-1 bg-secondary"
            loading={isMutating || isSubmitting}
            onPress={handleSubmit(handleCreate)}
          />
        </View>
      </ScrollView>
    </View>
  );
}
