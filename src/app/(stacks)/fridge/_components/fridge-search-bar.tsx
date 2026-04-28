import { Ionicons } from '@expo/vector-icons';
import React from 'react';

import { Input, View } from '@/components/ui';

type FridgeSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function FridgeSearchBar({ onChangeText, value }: FridgeSearchBarProps) {
  return (
    <View className="relative flex-1">
      <View pointerEvents="none" className="absolute left-4 top-3 z-10">
        <Ionicons name="search-outline" size={22} color="#9A9A9A" />
      </View>

      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Tìm kiếm theo tên nguyên liệu"
        className="h-[52px] rounded-xl border-zinc-400 py-0 pl-12 pr-4 text-sm font-normal"
      />
    </View>
  );
}
