import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function ProfileStackLayout() {
  const { colorScheme } = useColorScheme();
  const dark = colorScheme === 'dark';

  return (
    <Stack>
      <Stack.Screen
        name="edit"
        options={stackHeaderOptions({ title: 'Chỉnh sửa hồ sơ', dark })}
      />
      <Stack.Screen
        name="settings"
        options={stackHeaderOptions({ title: 'Cài đặt', dark })}
      />
      <Stack.Screen
        name="privacy"
        options={stackHeaderOptions({ title: 'Chính sách bảo mật', dark })}
      />
      <Stack.Screen
        name="notifications"
        options={stackHeaderOptions({ title: 'Thông báo', dark })}
      />
      <Stack.Screen
        name="favourites"
        options={stackHeaderOptions({ title: 'Yêu thích', dark })}
      />
      <Stack.Screen
        name="history-cooking"
        options={stackHeaderOptions({ title: 'Lịch sử nấu ăn', dark })}
      />
    </Stack>
  );
}
