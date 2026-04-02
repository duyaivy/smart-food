import { Stack } from 'expo-router';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function DiscoverStackLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="dishes/index"
        options={stackHeaderOptions({ title: 'Danh sách món ăn' })}
      />
      <Stack.Screen name="dishes/[id]" />
      <Stack.Screen
        name="ingredients/index"
        options={stackHeaderOptions({ title: 'Danh sách nguyên liệu' })}
      />
      <Stack.Screen
        name="ingredients/[id]"
        options={stackHeaderOptions({ title: 'Chi tiết nguyên liệu' })}
      />
    </Stack>
  );
}
