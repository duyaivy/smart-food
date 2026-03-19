import { router, Stack } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

import { ICON_SIZE_LARGE } from '@/constants/common';
export default function ProfileLayout() {
  const canGoBack = router.canGoBack();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: 'Cá nhân',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: '800',
            color: '#2F2F2F',
          },
          headerStyle: {
            backgroundColor: '#F5F5F5',
          },
          headerTintColor: '#111111',
          headerLeft: () => {
            return canGoBack ? (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ paddingHorizontal: 4 }}
              >
                <ChevronLeft size={ICON_SIZE_LARGE} />
              </TouchableOpacity>
            ) : null;
          },
        }}
      />
    </Stack>
  );
}
