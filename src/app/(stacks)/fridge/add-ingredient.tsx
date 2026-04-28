import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Platform } from 'react-native';

import {
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
import { useIngredient } from '@/lib/hooks/use-ingredient';
import type { IIngredient } from '@/models/interfaces/ingredient';
import {
  FridgeItemPriority,
  FridgeItemPriorityValue,
} from '@/models/types/fridge';
import { formatUnitLabel } from '@/lib/utils/unit';
import { priorityOptions } from '@/constants/fridge';
import { normalizeText, toDueDateIso } from '@/lib/utils/fridge';

export default function AddIngredientScreen() {
  const { ingredients } = useIngredient();
  const { createItem, error, isMutating } = useFridge();

  const [ingredientText, setIngredientText] = useState('');
  const [selectedIngredient, setSelectedIngredient] =
    useState<IIngredient | null>(null);
  const [quantity, setQuantity] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<FridgeItemPriority>(
    FridgeItemPriority.MEDIUM
  );
  const [formError, setFormError] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    const q = normalizeText(ingredientText);

    if (!q) return ingredients.slice(0, 5);

    return ingredients
      .filter((ingredient) => normalizeText(ingredient.name).includes(q))
      .slice(0, 5);
  }, [ingredientText, ingredients]);

  const handleSubmit = async () => {
    const matchedIngredient =
      selectedIngredient ??
      ingredients.find(
        (ingredient) =>
          normalizeText(ingredient.name) === normalizeText(ingredientText)
      ) ??
      null;

    const parsedQuantity = Number(quantity);
    const parsedDueDate = toDueDateIso(dueDate);

    if (!matchedIngredient) {
      setFormError('Vui lòng chọn nguyên liệu có sẵn trong danh sách.');

      return;
    }

    if (!Number.isFinite(parsedQuantity) || parsedQuantity <= 0) {
      setFormError('Số lượng phải lớn hơn 0.');

      return;
    }

    if (!parsedDueDate) {
      setFormError('Ngày hết hạn không hợp lệ. Định dạng đúng: YYYY-MM-DD.');

      return;
    }

    setFormError(null);

    const createdItem = await createItem({
      ingredientId: matchedIngredient.id,
      quantity: parsedQuantity,
      dueDate: parsedDueDate,
      priority,
    });
    // Debug payload
    // eslint-disable-next-line no-console
    console.debug('CreateFridgeItem payload', {
      ingredientId: matchedIngredient.id,
      quantity: parsedQuantity,
      dueDate: parsedDueDate,
      priority,
    });

    if (createdItem) {
      showMessage({
        message: 'Đã thêm vào tủ lạnh',
        description: `${matchedIngredient.name} đã được thêm`,
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
          <Input
            label="Tên nguyên liệu"
            value={ingredientText}
            onChangeText={(value) => {
              setIngredientText(value);
              setSelectedIngredient(null);
            }}
            placeholder="Cà chua"
          />

          {ingredientText.length > 0 && !selectedIngredient ? (
            <View className="mb-4 rounded-xl border border-zinc-200 bg-white">
              {suggestions.map((ingredient) => (
                <Pressable
                  key={ingredient.id}
                  className="border-b border-zinc-100 px-4 py-3 last:border-b-0"
                  onPress={() => {
                    setSelectedIngredient(ingredient);
                    setIngredientText(ingredient.name);
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

          <Input
            label="Số lượng"
            value={quantity}
            onChangeText={setQuantity}
            placeholder="500"
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
                  onPress={() => setPriority(option)}
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
            label="Xác nhận"
            className="flex-1 bg-[#67BE70]"
            loading={isMutating}
            onPress={handleSubmit}
          />
        </View>
      </ScrollView>
    </View>
  );
}
