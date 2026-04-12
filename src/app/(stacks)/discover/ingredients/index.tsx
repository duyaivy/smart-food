import { useCallback, useState } from 'react';

import IngredientItem from '@/app/(stacks)/discover/ingredients/_components/ingredient-item';
import { List, View } from '@/components/ui';
import { useCategoryQuery } from '@/lib/hooks/queries/category.query';
import { useIngredient } from '@/lib/hooks/use-ingredient';
import { type IIngredient } from '@/models/interfaces/ingredient';

import { IngredientSearchHeader } from './_components/ingredient-search-header';

export default function IngredientList() {
  const { ingredients, filters, setSearch, setCategoryFilter } =
    useIngredient();
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const { data: categoryData } = useCategoryQuery();
  const onPressFilter = useCallback(() => {
    setIsFilterVisible((prev) => !prev);
  }, []);

  const renderIngredientItem = useCallback(
    ({ item }: { item: IIngredient }) => <IngredientItem ingredient={item} />,
    []
  );

  const keyExtractor = useCallback((item: IIngredient) => `${item.id}`, []);

  const handleRefresh = useCallback(() => {
    setSearch('');
    setIsFilterVisible(false);
    setCategoryFilter(null);
  }, [setSearch, setCategoryFilter]);

  return (
    <View className="flex-1 bg-background">
      <IngredientSearchHeader
        searchQuery={filters.search}
        onChangeSearchQuery={setSearch}
        onPressFilter={onPressFilter}
        isFilterActive={isFilterVisible}
        categories={categoryData?.data.data || []}
        setCategoryFilter={setCategoryFilter}
        selectCategoryId={filters.categoryId}
      />

      <List
        data={ingredients}
        renderItem={renderIngredientItem}
        keyExtractor={keyExtractor}
        numColumns={2}
        onRefresh={handleRefresh}
        refreshing={false}
        estimatedItemSize={260}
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
