import { useAppState } from '@react-native-community/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { dishApi } from '@/api/dish.api';
import { STALE_THRESHOLD_MS, useDishStore } from '@/lib/stores/use-dish-store';
import { type IDish } from '@/models/interfaces/dish';

type UseDishDetailResult = {
  dish: IDish | null;
  isLoading: boolean;
  isStale: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const toDishIdNumber = (dishId: string | number): number => {
  const parsedId = Number(dishId);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : NaN;
};

export const useDishDetail = (dishId: string | number): UseDishDetailResult => {
  const appState = useAppState();

  const hasHydrated = useDishStore.use.hasHydrated();
  const setDishDetail = useDishStore.use.setDishDetail();
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const normalizedDishId = useMemo(() => toDishIdNumber(dishId), [dishId]);
  const cacheItem = useDishStore((state) => {
    if (Number.isNaN(normalizedDishId)) return null;
    return state.dishDetailsById[normalizedDishId] ?? null;
  });

  const isStale = useMemo(() => {
    if (!cacheItem) return true;
    return Date.now() - cacheItem.cachedAt > STALE_THRESHOLD_MS;
  }, [cacheItem]);

  const fetchDishDetail = useCallback(async () => {
    if (Number.isNaN(normalizedDishId)) {
      setError('ID món ăn không hợp lệ');
      return;
    }

    try {
      setError(null);
      setIsFetching(true);

      const { data } = await dishApi.getDishDetail(String(normalizedDishId));
      setDishDetail(normalizedDishId, data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
    } finally {
      setIsFetching(false);
    }
  }, [normalizedDishId, setDishDetail]);

  useEffect(() => {
    if (appState !== 'active') return;
    if (!hasHydrated) return;
    if (!isStale) return;
    if (isFetching) return;
    if (error) return;

    fetchDishDetail();
  }, [appState, error, fetchDishDetail, hasHydrated, isFetching, isStale]);

  const refetch = useCallback(async () => {
    await fetchDishDetail();
  }, [fetchDishDetail]);

  return {
    dish: cacheItem?.data ?? null,
    isLoading: !hasHydrated || isFetching,
    isStale,
    error,
    refetch,
  };
};
