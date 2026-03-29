import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import * as React from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { Platform } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';

type DatePickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  helperText?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN');
}

function isValidDateValue(value: unknown): value is Date {
  return (
    typeof value === 'object' &&
    value !== null &&
    value instanceof Date &&
    !Number.isNaN(value.getTime())
  );
}

function DatePickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  helperText = 'Nhấn để chọn ngày',
  minimumDate,
  maximumDate,
}: DatePickerFieldProps<TFieldValues>): React.JSX.Element {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const [isAndroidPickerVisible, setAndroidPickerVisible] =
    React.useState(false);
  const fallbackDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 25)
  );
  const selectedDate = isValidDateValue(value) ? value : fallbackDate;
  const hasError = Boolean(error?.message);

  const onDateChange = (event: DateTimePickerEvent, nextDate?: Date): void => {
    if (Platform.OS === 'android') {
      setAndroidPickerVisible(false);
      if (event.type !== 'set' || !nextDate) return;
    }

    if (nextDate) onChange(nextDate);
  };

  return (
    <View className="mb-3">
      <Text
        className={
          hasError
            ? 'mb-1 text-base font-medium text-danger-600'
            : 'mb-1 text-base font-medium text-neutral-900 dark:text-white'
        }
      >
        {label}
      </Text>

      <Pressable
        className={
          hasError
            ? 'rounded-2xl border border-danger-600 bg-neutral-100 px-4 py-3 dark:bg-neutral-800'
            : 'rounded-2xl border border-neutral-200 bg-neutral-100 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900'
        }
        onPress={() => {
          if (Platform.OS === 'android') setAndroidPickerVisible(true);
        }}
      >
        <Text className="text-base text-neutral-900 dark:text-white">
          {formatDate(selectedDate)}
        </Text>
      </Pressable>

      {(Platform.OS === 'ios' || isAndroidPickerVisible) && (
        <View className="mt-2 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={'spinner'}
            onChange={onDateChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
        </View>
      )}

      {helperText ? (
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {helperText}
        </Text>
      ) : null}

      {error?.message ? (
        <Text className="mt-1 text-sm text-danger-500 dark:text-danger-400">
          {error.message}
        </Text>
      ) : null}
    </View>
  );
}

export default DatePickerField;
