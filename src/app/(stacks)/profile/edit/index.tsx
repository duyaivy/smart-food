import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

import { NumberPickerSheet } from './_components/number-picker-sheet';
import { ValuePickerCard } from './_components/value-picker-card';

const SAFE_AREA_EDGES = ['bottom'] as const;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  grow: {
    flexGrow: 1,
  },
});

const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên quá dài'),
  email: z.string().trim().email('Email không hợp lệ'),
  age: z
    .number({ invalid_type_error: 'Tuổi là bắt buộc' })
    .int('Tuổi không hợp lệ')
    .min(10, 'Tuổi phải từ 10–120')
    .max(120, 'Tuổi phải từ 10–120'),
  heightCm: z
    .number({ invalid_type_error: 'Chiều cao là bắt buộc' })
    .int('Chiều cao không hợp lệ')
    .min(80, 'Chiều cao phải từ 80–250 cm')
    .max(250, 'Chiều cao phải từ 80–250 cm'),
  weightKg: z
    .number({ invalid_type_error: 'Cân nặng là bắt buộc' })
    .int('Cân nặng không hợp lệ')
    .min(20, 'Cân nặng phải từ 20–300 kg')
    .max(300, 'Cân nặng phải từ 20–300 kg'),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

function buildRange(min: number, max: number, step: number = 1): number[] {
  const values: number[] = [];
  for (let value = min; value <= max; value += step) values.push(value);
  return values;
}

export default function EditProfileScreen(): React.JSX.Element {
  const ageSheetRef = React.useRef<BottomSheetModal | null>(null);
  const heightSheetRef = React.useRef<BottomSheetModal | null>(null);
  const weightSheetRef = React.useRef<BottomSheetModal | null>(null);

  const ageValues = React.useMemo(() => buildRange(10, 120, 1), []);
  const heightValues = React.useMemo(() => buildRange(80, 250, 1), []);
  const weightValues = React.useMemo(() => buildRange(20, 300, 1), []);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      age: 25,
      heightCm: 170,
      weightKg: 65,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    // UI-only for now: log values instead of calling API
    console.log('[edit-profile] submit', values);
    showMessage({
      message: 'Đã ghi nhận thông tin',
      description: 'Hiện tại chỉ log dữ liệu (chưa gọi API).',
      type: 'success',
      duration: 2500,
    });
  });
  const isSaving = isSubmitting;

  return (
    <SafeAreaView className="flex-1" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />
      <KeyboardAvoidingView
        style={styles.grow}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View className="gap-2">
            <ControlledInput<EditProfileFormValues>
              control={control}
              name="name"
              label="Họ và tên"
              placeholder="Nhập tên của bạn"
              autoCapitalize="words"
              returnKeyType="next"
            />

            <ControlledInput<EditProfileFormValues>
              control={control}
              name="email"
              label="Email"
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />

            <Controller
              control={control}
              name="age"
              render={({ field, fieldState }) => (
                <ValuePickerCard
                  label="Tuổi"
                  valueLabel={`${field.value} tuổi`}
                  helperText="Chạm để chọn"
                  error={fieldState.error?.message}
                  onPress={() => ageSheetRef.current?.present()}
                />
              )}
            />

            <Controller
              control={control}
              name="heightCm"
              render={({ field, fieldState }) => (
                <ValuePickerCard
                  label="Chiều cao"
                  valueLabel={`${field.value} cm`}
                  helperText="Chạm để chọn"
                  error={fieldState.error?.message}
                  onPress={() => heightSheetRef.current?.present()}
                />
              )}
            />

            <Controller
              control={control}
              name="weightKg"
              render={({ field, fieldState }) => (
                <ValuePickerCard
                  label="Cân nặng"
                  valueLabel={`${field.value} kg`}
                  helperText="Chạm để chọn"
                  error={fieldState.error?.message}
                  onPress={() => weightSheetRef.current?.present()}
                />
              )}
            />
          </View>

          <View className="mt-4">
            <Button
              label="Lưu thay đổi"
              loading={isSaving}
              disabled={!isValid || isSaving}
              onPress={onSubmit}
            />
            <Text className="mt-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
              Chiều cao & cân nặng dùng bộ chọn để thao tác nhanh và chính xác.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Controller
        control={control}
        name="age"
        render={({ field }) => (
          <NumberPickerSheet
            modalRef={ageSheetRef}
            title="Chọn tuổi"
            values={ageValues}
            selectedValue={field.value}
            onSelect={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="heightCm"
        render={({ field }) => (
          <NumberPickerSheet
            modalRef={heightSheetRef}
            title="Chọn chiều cao"
            unit="cm"
            values={heightValues}
            selectedValue={field.value}
            onSelect={field.onChange}
          />
        )}
      />

      <Controller
        control={control}
        name="weightKg"
        render={({ field }) => (
          <NumberPickerSheet
            modalRef={weightSheetRef}
            title="Chọn cân nặng"
            unit="kg"
            values={weightValues}
            selectedValue={field.value}
            onSelect={field.onChange}
          />
        )}
      />
    </SafeAreaView>
  );
}
