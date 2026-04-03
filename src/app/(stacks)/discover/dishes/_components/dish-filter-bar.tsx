import classnames from 'classnames';
import * as React from 'react';

import { Pressable, Text, View } from '@/components/ui';
import {
  type DishListFilters,
  type SortField,
} from '@/lib/hooks/use-dish-list';
type Props = {
  filters: DishListFilters;
  onChangeSortField: (field: SortField) => void;
  onToggleSortOrder: () => void;
};

const SORT_OPTIONS: { label: string; value: SortField }[] = [
  { label: 'Tên', value: 'name' },
  { label: 'Thời gian chuẩn bị', value: 'prepTimeMin' },
  { label: 'Thời gian nấu', value: 'cookTimeMin' },
];

export function DishFilterBar({
  filters,
  onChangeSortField,
  onToggleSortOrder,
}: Props) {
  return (
    <View className="mt-2 border-b border-neutral-200 bg-background px-4 pb-2">
      <View className="flex-row items-center gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive = filters.sortField === option.value;

          return (
            <Pressable
              key={option.value}
              onPress={() => onChangeSortField(option.value)}
              className={`rounded-full px-3 py-2 ${
                isActive ? 'bg-primary-100' : 'bg-neutral-200'
              }`}
              accessibilityRole="button"
              accessibilityLabel={`Sort by ${option.label}`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isActive ? 'text-primary-700' : 'text-neutral-700'
                }`}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          onPress={onToggleSortOrder}
          className={classnames(
            'rounded-full px-3 py-2',
            filters.sortOrder === 'asc' ? 'bg-secondary-200' : 'bg-primary-200'
          )}
          accessibilityRole="button"
          accessibilityLabel="Toggle sort order"
        >
          <Text
            className={classnames(
              'text-xs font-semibold',
              filters.sortOrder === 'asc'
                ? 'text-secondary-700'
                : 'text-primary-700'
            )}
          >
            {filters.sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
