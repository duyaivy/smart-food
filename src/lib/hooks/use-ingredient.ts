import { useAppState } from '@react-native-community/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { ingredientApi } from '@/api/ingredient.api';
import {
  STALE_THRESHOLD_MS,
  useIngredientStore,
} from '@/lib/stores/use-ingredient-store';
import { toValidDate } from '@/lib/utils/format';
import { type IIngredient } from '@/models/interfaces/ingredient';

export type IngredientSortField = 'name';
export type SortOrder = 'asc' | 'desc';

export type IngredientListFilters = {
  search: string;
  categoryId: number | null;
  sortField: IngredientSortField;
  sortOrder: SortOrder;
};

const DEFAULT_FILTERS: IngredientListFilters = Object.freeze({
  search: '',
  categoryId: null,
  sortField: 'name',
  sortOrder: 'asc',
});

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const applyFiltersAndSort = (
  list: IIngredient[],
  filters: IngredientListFilters
): IIngredient[] => {
  let result = list;

  if (filters.categoryId !== null) {
    result = result.filter((i) => i.categoryId === filters.categoryId);
  }

  if (filters.search.trim()) {
    const q = normalizeText(filters.search);
    result = result.filter((i) => normalizeText(i.name).includes(q));
  }

  result = [...result].sort((a, b) => {
    const cmp = a.name.localeCompare(b.name);
    return filters.sortOrder === 'asc' ? cmp : -cmp;
  });

  return result;
};

export function useIngredient(ingredientId: number): {
  ingredient: IIngredient | null;
};

export function useIngredient(ingredientId?: undefined): {
  ingredients: IIngredient[];
  totalCount: number;
  filteredCount: number;
  lastSyncAt: Date | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  filters: IngredientListFilters;
  availableCategories: { id: number; name: string }[];

  setSearch: (search: string) => void;
  setCategoryFilter: (categoryId: number | null) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleSortOrder: () => void;
  resetFilters: () => void;
  refetch: () => void;
};

export function useIngredient(ingredientId?: number) {
  const appState = useAppState();

  const {
    lastSyncAt,
    status,
    hasHydrated,
    ingredientList,
    setIngredientList,
    updateIngredientList,
    getIngredientDetail,
    setStatus,
  } = useIngredientStore(
    useShallow((state) => ({
      lastSyncAt: state.lastSyncAt,
      status: state.status,
      hasHydrated: state.hasHydrated,
      ingredientList: state.ingredientList,
      setIngredientList: state.setIngredientList,
      updateIngredientList: state.updateIngredientList,
      getIngredientDetail: state.getIngredientDetail,
      setStatus: state.setStatus,
    }))
  );

  const [filters, setFilters] =
    useState<IngredientListFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);

  const normalizedLastSyncAt = useMemo(
    () => toValidDate(lastSyncAt),
    [lastSyncAt]
  );

  const fetchIngredients = useCallback(async () => {
    try {
      setError(null);
      setStatus('syncing');
      const { data } = await ingredientApi.getIngredientsSync(
        normalizedLastSyncAt ?? undefined
      );

      const hasLocalCache = !!normalizedLastSyncAt && ingredientList.length > 0;

      if (hasLocalCache) {
        updateIngredientList(data.data);
      } else {
        setIngredientList(data.data);
      }
    } catch (err) {
      setStatus('stale');
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    }
  }, [
    setIngredientList,
    setStatus,
    normalizedLastSyncAt,
    ingredientList.length,
    updateIngredientList,
  ]);

  useEffect(() => {
    if (!hasHydrated) return;
    if (status === 'stale') fetchIngredients();
  }, [hasHydrated, status, fetchIngredients]);

  useEffect(() => {
    if (appState !== 'active' || !hasHydrated) return;
    const isStale =
      !normalizedLastSyncAt ||
      Date.now() - normalizedLastSyncAt.getTime() > STALE_THRESHOLD_MS;

    if (isStale && status === 'synced') setStatus('stale');
  }, [appState, normalizedLastSyncAt, hasHydrated, status, setStatus]);

  if (ingredientId !== undefined) {
    const ingredient = getIngredientDetail(ingredientId);
    return { ingredient };
  }

  const filteredList = applyFiltersAndSort(ingredientList, filters);

  const availableCategories = Array.from(
    new Map(
      ingredientList
        .filter((i) => i.categoryId != null)
        .map((i) => [i.categoryId, { id: i.categoryId!, name: i.name! }])
    ).values()
  ).sort((a, b) => a.name.localeCompare(b.name));

  const setSearch = (search: string) =>
    setFilters((prev) => ({ ...prev, search }));

  const setCategoryFilter = (categoryId: number | null) =>
    setFilters((prev) => ({ ...prev, categoryId }));

  const setSortOrder = (sortOrder: SortOrder) =>
    setFilters((prev) => ({ ...prev, sortOrder }));

  const toggleSortOrder = () =>
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const refetch = () => setStatus('stale');

  return {
    ingredients: filteredList,
    totalCount: ingredientList.length,
    filteredCount: filteredList.length,
    lastSyncAt: normalizedLastSyncAt,

    isLoading: status === 'syncing' || !hasHydrated,
    isStale: status === 'stale',
    error,

    filters,
    availableCategories,
    setSearch,
    setCategoryFilter,
    setSortOrder,
    toggleSortOrder,
    resetFilters,

    refetch,
  };
}
