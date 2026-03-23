import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function FridgeStackLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="ingredient-detail"
        options={stackHeaderOptions({ title: 'Chi tiết nguyên liệu', dark })}
      />
      <Stack.Screen
        name="add-ingredient"
        options={stackHeaderOptions({ title: 'Thêm nguyên liệu', dark })}
      />
      <Stack.Screen
        name="edit-ingredient"
        options={stackHeaderOptions({ title: 'Chỉnh sửa nguyên liệu', dark })}
      />
    </Stack>
  );
}
