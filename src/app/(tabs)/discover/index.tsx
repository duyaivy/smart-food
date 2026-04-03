import { router } from 'expo-router';
import React from 'react';

import {
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { ROUTE } from '@/constants/route';

export default function DiscoverScreen() {
  return (
    <SafeAreaView className="flex-1 px-4 ">
      <FocusAwareStatusBar />
      <Text className="text-2xl font-bold">Khám phá</Text>

      {/* route section */}
      <View className="mt-4 flex flex-row gap-2">
        <Pressable
          onPress={() => router.push(ROUTE.STACK.DISCOVER.DISH_LIST)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
          className="flex-1 rounded-lg bg-primary p-4"
        >
          <Text className="text-center text-lg font-semibold text-white">
            Công thức Món ăn
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push(ROUTE.STACK.DISCOVER.INGREDIENT)}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
          className="flex-1 rounded-lg bg-secondary p-4"
        >
          <Text className="text-center text-lg font-semibold text-white">
            Nguyên liệu thô
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
