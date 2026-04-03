import { useAppState } from '@react-native-community/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { dishApi } from '@/api/dish.api';
import { STALE_THRESHOLD_MS, useDishStore } from '@/lib/stores/use-dish-store';
import { toValidDate } from '@/lib/utils/format';
import { type MiniDish } from '@/models/interfaces/dish';

export type SortField = 'prepTimeMin' | 'cookTimeMin' | 'name';
export type SortOrder = 'asc' | 'desc';

export type DishListFilters = {
  search: string;
  sortField: SortField;
  sortOrder: SortOrder;
};

const DEFAULT_FILTERS: DishListFilters = {
  search: '',
  sortField: 'name',
  sortOrder: 'asc',
};

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const applyFiltersAndSort = (
  list: MiniDish[],
  filters: DishListFilters
): MiniDish[] => {
  let result = list;

  // Filter theo tên
  if (filters.search.trim()) {
    const q = normalizeText(filters.search);
    result = result.filter((d) => normalizeText(d.name).includes(q));
  }

  // Sort
  result = [...result].sort((a, b) => {
    const field = filters.sortField;

    if (field === 'name') {
      const cmp = a.name.localeCompare(b.name);
      return filters.sortOrder === 'asc' ? cmp : -cmp;
    }

    const aVal = a[field] ?? Infinity;
    const bVal = b[field] ?? Infinity;
    return filters.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  return result;
};

export const useDishList = () => {
  const appState = useAppState();

  const status = useDishStore.use.status();
  const lastSyncAt = useDishStore.use.lastSyncAt();
  const hasHydrated = useDishStore.use.hasHydrated();
  const dishList = useDishStore.use.dishList();
  const setDishList = useDishStore.use.setDishList();
  const updateDishListItem = useDishStore.use.updateDishListItem();
  const setStatus = useDishStore.use.setStatus();

  const [filters, setFilters] = useState<DishListFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const normalizedLastSyncAt = useMemo(
    () => toValidDate(lastSyncAt),
    [lastSyncAt]
  );

  // Fetch từ API và cập nhật store
  const fetchDishes = useCallback(async () => {
    try {
      setError(null);
      setStatus('syncing');
      const { data } = await dishApi.getDishesSync(
        normalizedLastSyncAt ?? undefined
      );

      const hasLocalCache = !!normalizedLastSyncAt && dishList.length > 0;
      if (hasLocalCache) {
        updateDishListItem(data.data);
      } else {
        setDishList(data.data);
      }
    } catch (err) {
      setStatus('stale');
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  }, [
    setDishList,
    setStatus,
    normalizedLastSyncAt,
    dishList.length,
    updateDishListItem,
  ]);

  // Trigger khi store hydrate xong — fetch nếu stale
  useEffect(() => {
    if (!hasHydrated) return;
    if (status === 'stale') {
      fetchDishes();
    }
  }, [hasHydrated, status, fetchDishes]);

  // Trigger khi app foreground lại
  useEffect(() => {
    if (appState !== 'active') return;
    if (!hasHydrated) return;

    const isStale =
      !normalizedLastSyncAt ||
      Date.now() - normalizedLastSyncAt.getTime() > STALE_THRESHOLD_MS;

    if (isStale && status === 'synced') {
      setStatus('stale');
    }
  }, [appState, normalizedLastSyncAt, hasHydrated, status, setStatus]);

  const filteredList = useMemo(
    () => applyFiltersAndSort(dishList, filters),
    [dishList, filters]
  );

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setSortField = useCallback((sortField: SortField) => {
    setFilters((prev) => ({ ...prev, sortField }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortOrder }));
  }, []);

  const toggleSortOrder = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const refetch = useCallback(() => {
    setStatus('stale');
  }, [setStatus]);

  return {
    dishes: filteredList,
    totalCount: dishList.length,
    filteredCount: filteredList.length,
    lastSyncAt: normalizedLastSyncAt,

    isLoading: status === 'syncing' || !hasHydrated,
    isStale: status === 'stale',
    error,

    filters,
    setSearch,
    setSortField,
    setSortOrder,
    toggleSortOrder,

    refetch,
  };
};
