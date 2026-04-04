import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function MealStackLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="[id]"
        options={stackHeaderOptions({ title: 'Chi tiết món ăn', dark })}
      />
    </Stack>
  );
}
