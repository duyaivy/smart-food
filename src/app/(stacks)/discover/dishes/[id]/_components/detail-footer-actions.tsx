import React from 'react';

import { Pressable, Text, View } from '@/components/ui';

export function DetailFooterActions() {
  return (
    <View className="absolute inset-x-0 bottom-0 border-t border-neutral-200 bg-white px-4 pb-6 pt-3">
      <View className="flex-row gap-3">
        <Pressable className="h-12 flex-1 items-center justify-center rounded-xl border border-primary-700 bg-white">
          <Text className="text-lg text-primary-700">Món khác</Text>
        </Pressable>

        <Pressable className="h-12 flex-1 items-center justify-center rounded-xl bg-secondary-700">
          <Text className="text-lg text-white">Nấu ngay</Text>
        </Pressable>
      </View>
    </View>
  );
}
