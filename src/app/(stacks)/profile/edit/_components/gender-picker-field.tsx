import React from 'react';
import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  useController,
} from 'react-hook-form';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type GenderPickerFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
};
function GenderPickerField<TFieldValues extends FieldValues>(
  props: GenderPickerFieldProps<TFieldValues>
) {
  const { control, name, label } = props;
  const {
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  const hasError = Boolean(error?.message);
  const labelClassName = hasError
    ? 'mb-1 text-base font-medium text-danger-600'
    : 'mb-1 text-base font-medium text-neutral-900 dark:text-white';

  return (
    <View className="mb-3">
      <Text className={labelClassName}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <RadioGroup
            className="flex flex-row gap-10"
            value={field.value ? 'male' : 'female'}
            onValueChange={(val) => field.onChange(val === 'male')}
          >
            <View className="flex flex-row items-center gap-3">
              <RadioGroupItem value="male" id="male" />
              <Label className="text-lg" htmlFor="male">
                Nam
              </Label>
            </View>

            <View className="flex flex-row items-center gap-3">
              <RadioGroupItem value="female" id="female" />
              <Label className="text-lg" htmlFor="female">
                Nữ
              </Label>
            </View>
          </RadioGroup>
        )}
      />
    </View>
  );
}

export default GenderPickerField;
