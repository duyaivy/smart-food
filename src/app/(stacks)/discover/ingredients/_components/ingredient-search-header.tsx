import { Search, SlidersHorizontal } from 'lucide-react-native';
import * as React from 'react';
import { TextInput } from 'react-native';

import { FocusAwareStatusBar, Pressable, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';

type Props = {
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  onPressFilter: () => void;
  isFilterActive?: boolean;
};

export function IngredientSearchHeader({
  searchQuery,
  onChangeSearchQuery,
  onPressFilter,
  isFilterActive = false,
}: Props) {
  return (
    <>
      <FocusAwareStatusBar />
      <View className="border-neutral-200 bg-background px-4">
        <View className="flex-row items-center gap-2">
          <View className="h-14 flex-1 flex-row items-center rounded-full bg-neutral-200 px-4">
            <Icon as={Search} className="text-neutral-500" size={22} />
            <TextInput
              value={searchQuery}
              onChangeText={onChangeSearchQuery}
              placeholder="Tìm kiếm nguyên liệu..."
              placeholderTextColor="#8b8b8b"
              className="ml-3 flex-1 text-base text-foreground"
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </View>

          <Pressable
            onPress={onPressFilter}
            className={`size-14 items-center justify-center rounded-full ${
              isFilterActive ? 'bg-primary-100' : 'bg-neutral-200'
            }`}
            accessibilityRole="button"
            accessibilityLabel="Filter ingredients"
          >
            <Icon
              as={SlidersHorizontal}
              className={
                isFilterActive ? 'text-primary-700' : 'text-neutral-700'
              }
              size={22}
            />
          </Pressable>
        </View>
      </View>
    </>
  );
}
