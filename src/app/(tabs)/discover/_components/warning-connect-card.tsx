import React from 'react';
import { router } from 'expo-router';
import { TriangleAlert } from 'lucide-react-native';

import { Pressable, Text, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';

export function WarningConnectCard() {
  return (
    <View className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <TriangleAlert size={22} color="#d97706" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-amber-800">
            Bạn chưa kết nối cân thông minh
          </Text>

          <Text className="mt-1 text-sm leading-5 text-amber-700">
            Hãy ghép nối thiết bị để nhận dữ liệu nguyên liệu trực tiếp khi nấu
            ăn và đồng bộ với ứng dụng.
          </Text>

          <Pressable
            onPress={() => router.push(ROUTE.STACK.PROFILE.SMART_SCALE)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
            className="mt-3 self-start rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Kết nối ngay</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}