import * as React from 'react';

import { Pressable, Text, View } from '@/components/ui';

type Props = {
  label: string;
  valueLabel: string;
  helperText?: string;
  error?: string;
  onPress: () => void;
};

export const ValuePickerCard = React.memo(function ValuePickerCard({
  label,
  valueLabel,
  helperText,
  error,
  onPress,
}: Props): React.JSX.Element {
  const hasError = Boolean(error);

  return (
    <View className="mb-2">
      <Text
        className={hasError ? 'mb-1 text-lg text-danger-600' : 'mb-1 text-lg'}
      >
        {label}
      </Text>

      <Pressable
        onPress={onPress}
        className={
          hasError
            ? 'rounded-2xl border border-danger-600 bg-neutral-100 p-4 dark:bg-neutral-800'
            : 'rounded-2xl border border-neutral-200 bg-neutral-100 p-4 dark:border-neutral-800 dark:bg-neutral-900'
        }
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold">{valueLabel}</Text>
            {helperText ? (
              <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                {helperText}
              </Text>
            ) : null}
          </View>

          <Text className="text-sm text-neutral-500 dark:text-neutral-400">
            Đổi
          </Text>
        </View>
      </Pressable>

      {error ? (
        <Text className="mt-1 text-sm text-danger-400 dark:text-danger-600">
          {error}
        </Text>
      ) : null}
    </View>
  );
});
