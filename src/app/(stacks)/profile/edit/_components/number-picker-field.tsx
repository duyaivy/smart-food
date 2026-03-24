import { Picker } from '@react-native-picker/picker';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  type Control,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { Platform } from 'react-native';

import { Text, View } from '@/components/ui';
import colors from '@/constants/colors';

type NumberPickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  values: number[];
  unit?: string;
  helperText?: string;
};

function NumberPickerField<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  values,
  unit,
  helperText = 'Chạm để chọn',
}: NumberPickerFieldProps<TFieldValues>): React.JSX.Element {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const hasError = Boolean(error?.message);
  const labelClassName = hasError
    ? 'mb-1 text-base font-medium text-danger-600'
    : 'mb-1 text-base font-medium text-neutral-900 dark:text-white';

  const fieldClassName = hasError
    ? 'rounded-2xl border border-danger-600 bg-neutral-100 dark:bg-neutral-800'
    : 'rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900';

  const pickerTextColor = isDark ? colors.white : colors.neutral[900];
  const pickerHeight = Platform.OS === 'ios' ? 160 : 52;

  return (
    <View className="mb-3">
      <Text className={labelClassName}>{label}</Text>

      <View className={fieldClassName}>
        <Picker
          selectedValue={Number(value)}
          onValueChange={(nextValue) => onChange(Number(nextValue))}
          mode={Platform.OS === 'android' ? 'dropdown' : undefined}
          dropdownIconColor={pickerTextColor}
          style={{ height: pickerHeight, color: pickerTextColor }}
          itemStyle={{ color: pickerTextColor, fontSize: 18 }}
        >
          {values.map((v) => (
            <Picker.Item
              key={String(v)}
              label={`${v}${unit ? ` ${unit}` : ''}`}
              value={v}
              color={pickerTextColor}
            />
          ))}
        </Picker>
      </View>

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

export default NumberPickerField;
