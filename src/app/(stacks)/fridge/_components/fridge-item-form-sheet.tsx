import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';

import {
  Button,
  ControlledInput,
  Image,
  Input,
  Text,
  View,
} from '@/components/ui';
import { priorityOptions } from '@/constants/fridge';
import type { EnrichedFridgeItem } from '@/lib/hooks/use-fridge';
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
  editFridgeItemFormSchema,
  type EditFridgeItemFormValues,
} from '@/schemas/fridge.schema';

type SubmitValues = {
  ingredientId: number;
  quantity: number;
  dueDate: string;
  priority: FridgeItemPriority;
};

type FridgeItemFormSheetProps = {
  visible: boolean;
  mode: 'add' | 'edit';
  item?: EnrichedFridgeItem | null;
  initialIngredientName?: string;
  initialQuantity?: string;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (values: SubmitValues) => Promise<boolean> | boolean;
};

const DEFAULT_ADD_VALUES: AddFridgeItemFormValues = {
  ingredientId: 0,
  ingredientText: '',
  quantity: '',
  dueDate: '',
  priority: FridgeItemPriority.MEDIUM,
};

export function FridgeItemFormSheet({
  visible,
  mode,
  item,
  initialIngredientName = '',
  initialQuantity = '',
  loading = false,
  onClose,
  onSubmit,
}: FridgeItemFormSheetProps) {
  const { ingredients } = useIngredient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isEdit = mode === 'edit';
  const lastResetKeyRef = useRef<string | null>(null);

  const dragHandlePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        gestureState.dy > 8 &&
        Math.abs(gestureState.dy) > Math.abs(gestureState.dx),
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 40) {
          onClose();
        }
      },
    })
  ).current;

  const schema = isEdit ? editFridgeItemFormSchema : addFridgeItemFormSchema;

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    setValue,
  } = useForm<AddFridgeItemFormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_ADD_VALUES,
  });

  const ingredientText = useWatch({ control, name: 'ingredientText' }) ?? '';
  const ingredientId = useWatch({ control, name: 'ingredientId' }) ?? 0;
  const dueDate = useWatch({ control, name: 'dueDate' }) ?? '';

  const resetKey = useMemo(() => {
    if (!visible) return 'closed';

    if (isEdit) {
      return [
        'edit',
        item?.id ?? '',
        item?.ingredientId ?? '',
        item?.quantity ?? '',
        item?.dueDate ?? '',
        item?.priority ?? '',
      ].join(':');
    }

    return ['add', initialIngredientName, initialQuantity].join(':');
  }, [
    visible,
    isEdit,
    item?.id,
    item?.ingredientId,
    item?.quantity,
    item?.dueDate,
    item?.priority,
    initialIngredientName,
    initialQuantity,
  ]);

  const selectedIngredient = useMemo(() => {
    if (isEdit && item?.ingredient) return item.ingredient;

    return ingredientId > 0
      ? (ingredients.find((ingredient) => ingredient.id === ingredientId) ??
          null)
      : null;
  }, [ingredientId, ingredients, isEdit, item?.ingredient]);

  const imageUrl = selectedIngredient?.images?.[0];

  const suggestions = useMemo(() => {
    const q = normalizeText(ingredientText);

    if (!q) return ingredients.slice(0, 5);

    return ingredients
      .filter((ingredient) => normalizeText(ingredient.name).includes(q))
      .slice(0, 5);
  }, [ingredientText, ingredients]);

  useEffect(() => {
    if (!visible) {
      lastResetKeyRef.current = null;
      setShowDatePicker(false);
      return;
    }

    if (lastResetKeyRef.current === resetKey) return;

    lastResetKeyRef.current = resetKey;

    if (isEdit && item) {
      reset({
        ingredientId: item.ingredientId,
        ingredientText:
          item.ingredient?.name ?? `Nguyên liệu #${item.ingredientId}`,
        quantity: String(item.quantity),
        dueDate: formatDateInput(item.dueDate),
        priority: item.priority,
      });
      return;
    }

    const matchedIngredient = initialIngredientName
      ? ingredients.find(
          (ingredient) =>
            normalizeText(ingredient.name) ===
            normalizeText(initialIngredientName)
        )
      : null;

    reset({
      ...DEFAULT_ADD_VALUES,
      ingredientId: matchedIngredient?.id ?? 0,
      ingredientText: matchedIngredient?.name ?? initialIngredientName,
      quantity: initialQuantity,
    });
  }, [
    visible,
    resetKey,
    isEdit,
    item,
    initialIngredientName,
    initialQuantity,
    ingredients,
    reset,
  ]);

  useEffect(() => {
    if (isEdit || !ingredientText || ingredientId > 0) return;

    const matchedIngredient = ingredients.find(
      (ingredient) =>
        normalizeText(ingredient.name) === normalizeText(ingredientText)
    );

    if (!matchedIngredient) return;

    setValue('ingredientId', matchedIngredient.id, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (ingredientText !== matchedIngredient.name) {
      setValue('ingredientText', matchedIngredient.name, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [ingredientId, ingredientText, ingredients, isEdit, setValue]);

  const submit = async (
    values: AddFridgeItemFormValues | EditFridgeItemFormValues
  ) => {
    const parsedDueDate = toDueDateIso(values.dueDate);

    if (!parsedDueDate) return;

    const selectedIngredientId = isEdit
      ? item?.ingredientId
      : 'ingredientId' in values
        ? values.ingredientId
        : undefined;

    if (!selectedIngredientId) return;

    const ok = await onSubmit({
      ingredientId: selectedIngredientId,
      quantity: Number(values.quantity),
      dueDate: parsedDueDate,
      priority: values.priority,
    });

    if (ok) {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/40">
        <Pressable className="flex-1" onPress={onClose} />

        <View
          className="rounded-t-3xl bg-white px-6 pb-4 pt-3"
          style={{ maxHeight: '88%' }}
        >
          <Pressable
            hitSlop={12}
            onPress={onClose}
            className="mb-3 items-center pb-1"
            {...dragHandlePanResponder.panHandlers}
          >
            <View className="h-1.5 w-12 rounded-full bg-zinc-300" />
          </Pressable>

          <View className="mb-4 items-center">
            <Text className="text-center text-2xl font-bold text-zinc-950">
              {isEdit ? 'Chỉnh sửa nguyên liệu' : 'Thêm nguyên liệu'}
            </Text>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {isEdit ? (
              <View className="mb-6 flex-row items-center gap-4">
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
                    {selectedIngredient?.name ?? item?.ingredientId}
                  </Text>

                  <Text className="mt-1 text-sm text-zinc-500">
                    Đơn vị:{' '}
                    {formatUnitLabel(selectedIngredient?.unit ?? '') ||
                      'Chưa có'}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Controller
                  control={control}
                  name="ingredientText"
                  render={({ field }) => (
                    <Input
                      label="Tên nguyên liệu"
                      value={field.value}
                      onChangeText={(value) => {
                        field.onChange(value);

                        if (ingredientId !== 0) {
                          setValue('ingredientId', 0, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                      placeholder="Cà chua"
                      error={
                        errors.ingredientId?.message ??
                        errors.ingredientText?.message
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
                            shouldDirty: true,
                          });

                          setValue('ingredientText', ingredient.name, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      >
                        <Text className="font-semibold text-zinc-900">
                          {ingredient.name}
                        </Text>

                        <Text className="mt-1 text-xs text-zinc-400">
                          Đơn vị:{' '}
                          {formatUnitLabel(ingredient.unit) || 'Chưa có'}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                ) : null}
              </>
            )}

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
                      className={
                        field.value ? 'text-zinc-900' : 'text-zinc-400'
                      }
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
                <View className="flex-row flex-wrap gap-3">
                  {priorityOptions.map((option) => {
                    const selected = field.value === option;

                    return (
                      <Pressable
                        key={option}
                        onPress={() => field.onChange(option)}
                        className={`h-14 flex-1 basis-2/5 items-center justify-center rounded-xl ${
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

            <View className="mt-6 flex-row gap-4">
              <Button
                label="Hủy bỏ"
                variant="outline"
                className="flex-1 border-red-500"
                textClassName="text-red-500"
                onPress={onClose}
              />

              <Button
                label={isEdit ? 'Cập nhật' : 'Xác nhận'}
                className="flex-1 bg-secondary"
                loading={loading || isSubmitting}
                onPress={handleSubmit(submit)}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
