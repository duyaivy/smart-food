import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function CookingStackLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="create-schedule"
        options={stackHeaderOptions({ title: 'Tạo lịch nấu ăn', dark })}
      />
      <Stack.Screen
        name="edit-schedule"
        options={stackHeaderOptions({ title: 'Chỉnh sửa lịch nấu ăn', dark })}
      />
      <Stack.Screen
        name="schedule-detail"
        options={stackHeaderOptions({ title: 'Chi tiết lịch nấu ăn', dark })}
      />
      <Stack.Screen
        name="cooking-mode"
        options={stackHeaderOptions({
          title: 'Chế độ nấu ăn',
          dark,
          extra: { gestureEnabled: false }, // Prevent accidental back swipe mid-cooking
        })}
      />
    </Stack>
  );
}
