import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function SearchStackLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={stackHeaderOptions({
          title: 'Tìm kiếm',
          dark,
          extra: { headerShown: false }, // Search manages its own header UI
        })}
      />
    </Stack>
  );
}
