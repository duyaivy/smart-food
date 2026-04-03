import { useCallback, useState } from 'react';

import { DishFilterBar } from '@/app/(stacks)/discover/dishes/_components/dish-filter-bar';
import DishItem from '@/app/(stacks)/discover/dishes/_components/dish-item';
import { DishSearchHeader } from '@/app/(stacks)/discover/dishes/_components/dish-search-header';
import { List, View } from '@/components/ui';
import { useDishList } from '@/lib/hooks/use-dish-list';
import { type MiniDish } from '@/models/interfaces/dish';

export default function DishList() {
  const { dishes, filters, setSearch, setSortField, toggleSortOrder } =
    useDishList();
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const onPressFilter = useCallback(() => {
    setIsFilterVisible((prev) => !prev);
  }, []);

  const renderDishItem = useCallback(
    ({ item }: { item: MiniDish }) => <DishItem miniDish={item} />,
    []
  );

  const keyExtractor = useCallback((item: MiniDish) => `${item.id}`, []);
  const handleRefresh = useCallback(() => {
    setSearch('');
    setSortField('name');
    setIsFilterVisible(false);
  }, [setSearch, setSortField, setIsFilterVisible]);
  return (
    <View className="flex-1 bg-background">
      <DishSearchHeader
        searchQuery={filters.search}
        onChangeSearchQuery={setSearch}
        onPressFilter={onPressFilter}
        isFilterActive={isFilterVisible}
      />

      {isFilterVisible ? (
        <DishFilterBar
          filters={filters}
          onChangeSortField={setSortField}
          onToggleSortOrder={toggleSortOrder}
        />
      ) : null}

      <List
        data={dishes}
        renderItem={renderDishItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        onRefresh={handleRefresh}
        refreshing={false}
        estimatedItemSize={290}
        removeClippedSubviews
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingTop: 12,
          paddingBottom: 24,
        }}
      />
    </View>
  );
}
