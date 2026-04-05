import { Stack } from 'expo-router';
import React from 'react';

import { stackHeaderOptions } from '@/components/ui/stack-header-options';

export default function ProfileStackLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="edit/index"
        options={stackHeaderOptions({ title: 'Chỉnh sửa thông tin' })}
      />
      <Stack.Screen
        name="settings"
        options={stackHeaderOptions({ title: 'Cài đặt' })}
      />
      <Stack.Screen
        name="about-us/index"
        options={stackHeaderOptions({ title: 'Về chúng tôi' })}
      />
      <Stack.Screen
        name="privacy/index"
        options={stackHeaderOptions({ title: 'Điều khoản và chính sách' })}
      />
      <Stack.Screen
        name="history-cooking"
        options={stackHeaderOptions({ title: 'Lịch sử nấu ăn' })}
      />
      <Stack.Screen
        name="smart-scale"
        options={stackHeaderOptions({ title: 'Cân thông minh' })}
      />
    </Stack>
  );
}