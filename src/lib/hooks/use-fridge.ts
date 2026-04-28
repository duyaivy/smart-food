import { useAppState } from '@react-native-community/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { fridgeApi } from '@/api/fridge.api';
import { useIngredient } from '@/lib/hooks/use-ingredient';
import {
  FRIDGE_STALE_THRESHOLD_MS,
  useFridgeStore,
} from '@/lib/stores/use-fridge-store';
import { toValidDate } from '@/lib/utils/format';
import type {
  ICreateFridgeItemBody,
  IFridgeItem,
  IUpdateFridgeItemBody,
} from '@/models/interfaces/fridge';
import type { IIngredient } from '@/models/interfaces/ingredient';
import { FridgeItemPriority } from '@/models/types/fridge';

export type FridgeListFilters = {
  search: string;
  priority: FridgeItemPriority | null;
};

export type EnrichedFridgeItem = IFridgeItem & {
  ingredient?: IIngredient;
};

type ApiErrorShape = {
  response?: {
    data?: {
      code?: number;
      message?: string;
    };
    status?: number;
  };
};

const DEFAULT_FILTERS: FridgeListFilters = Object.freeze({
  search: '',
  priority: null,
});

const normalizeText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const applyFilters = (
  list: EnrichedFridgeItem[],
  filters: FridgeListFilters
): EnrichedFridgeItem[] => {
  let result = list;

  if (filters.priority) {
    result = result.filter((item) => item.priority === filters.priority);
  }

  if (filters.search.trim()) {
    const q = normalizeText(filters.search);

    result = result.filter((item) => {
      const ingredientName = item.ingredient?.name ?? '';

      return normalizeText(ingredientName).includes(q);
    });
  }

  return result;
};

const getApiErrorMessage = (err: unknown) => {
  const apiError = err as ApiErrorShape;
  const apiMessage = apiError.response?.data?.message;

  if (apiMessage) return apiMessage;
  if (err instanceof Error) return err.message;

  return '';
};

const getApiStatus = (err: unknown) => {
  const apiError = err as ApiErrorShape;

  return apiError.response?.status ?? apiError.response?.data?.code;
};

const isFridgeNotFoundError = (err: unknown) => {
  const status = getApiStatus(err);
  const message = getApiErrorMessage(err).toLowerCase();

  return (
    status === 404 ||
    message.includes('tủ lạnh của người dùng không tồn tại') ||
    message.includes('fridge not found') ||
    message.includes('not found')
  );
};

export function useFridge(fridgeItemId: number): {
  fridgeItem: EnrichedFridgeItem | null;
  updateItem: (body: IUpdateFridgeItemBody) => Promise<IFridgeItem | null>;
  deleteItem: () => Promise<boolean>;
  isMutating: boolean;
  error: string | null;
};

export function useFridge(fridgeItemId?: undefined): {
  fridgeItems: EnrichedFridgeItem[];
  totalCount: number;
  filteredCount: number;
  lastSyncAt: Date | null;
  isLoading: boolean;
  isMutating: boolean;
  isStale: boolean;
  error: string | null;
  filters: FridgeListFilters;

  setSearch: (search: string) => void;
  setPriorityFilter: (priority: FridgeItemPriority | null) => void;
  resetFilters: () => void;
  refetch: () => void;
  createItem: (body: ICreateFridgeItemBody) => Promise<IFridgeItem | null>;
  updateItem: (
    id: number | string,
    body: IUpdateFridgeItemBody
  ) => Promise<IFridgeItem | null>;
  deleteItem: (id: number | string) => Promise<boolean>;
};

export function useFridge(fridgeItemId?: number) {
  const appState = useAppState();
  const ingredientState = useIngredient();

  const ingredientMap = useMemo(
    () =>
      new Map(
        ingredientState.ingredients.map((ingredient) => [
          ingredient.id,
          ingredient,
        ])
      ),
    [ingredientState.ingredients]
  );

  const {
    addFridgeItem,
    fridgeItemList,
    getFridgeItemDetail,
    hasHydrated,
    lastSyncAt,
    removeFridgeItem,
    setFridgeItemList,
    setStatus,
    status,
    updateFridgeItem,
  } = useFridgeStore(
    useShallow((state) => ({
      addFridgeItem: state.addFridgeItem,
      fridgeItemList: state.fridgeItemList,
      getFridgeItemDetail: state.getFridgeItemDetail,
      hasHydrated: state.hasHydrated,
      lastSyncAt: state.lastSyncAt,
      removeFridgeItem: state.removeFridgeItem,
      setFridgeItemList: state.setFridgeItemList,
      setStatus: state.setStatus,
      status: state.status,
      updateFridgeItem: state.updateFridgeItem,
    }))
  );

  const [filters, setFilters] = useState<FridgeListFilters>(DEFAULT_FILTERS);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const normalizedLastSyncAt = useMemo(
    () => toValidDate(lastSyncAt),
    [lastSyncAt]
  );

  const enrichItem = useCallback(
    (item: IFridgeItem): EnrichedFridgeItem => ({
      ...item,
      ingredient: item.ingredient ?? ingredientMap.get(item.ingredientId),
    }),
    [ingredientMap]
  );

  const fetchFridgeItems = useCallback(async () => {
    try {
      setError(null);
      setIsFetching(true);
      setStatus('syncing');

      const { data } = await fridgeApi.getFridgeItems({
        page: 1,
        limit: 100,
      });

      setFridgeItemList(data.data.results);
    } catch (err) {
      if (isFridgeNotFoundError(err)) {
        setFridgeItemList([]);
        setError(null);

        return;
      }

      setStatus('synced');
      setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');
    } finally {
      setIsFetching(false);
    }
  }, [setFridgeItemList, setStatus]);

  const createItem = useCallback(
    async (body: ICreateFridgeItemBody) => {
      try {
        setError(null);
        setIsMutating(true);
        console.debug('[useFridge] createItem payload:', body);

        const { data } = await fridgeApi.createFridgeItem(body);
        console.debug('[useFridge] createItem response:', data);

        addFridgeItem(data.data);

        return data.data;
      } catch (err) {
        console.debug('[useFridge] createItem error:', err);
        setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');

        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [addFridgeItem]
  );

  const updateItem = useCallback(
    async (id: number | string, body: IUpdateFridgeItemBody) => {
      try {
        setError(null);
        setIsMutating(true);

        const { data } = await fridgeApi.updateFridgeItem(id, body);

        updateFridgeItem(data.data);

        return data.data;
      } catch (err) {
        setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');

        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [updateFridgeItem]
  );

  const deleteItem = useCallback(
    async (id: number | string) => {
      try {
        setError(null);
        setIsMutating(true);

        await fridgeApi.deleteFridgeItem(id);
        removeFridgeItem(Number(id));

        return true;
      } catch (err) {
        setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');

        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [removeFridgeItem]
  );

  useEffect(() => {
    if (!hasHydrated) return;
    if (status === 'stale') {
      void fetchFridgeItems();
    }
  }, [fetchFridgeItems, hasHydrated, status]);

  useEffect(() => {
    if (appState !== 'active' || !hasHydrated) return;

    const isStale =
      !normalizedLastSyncAt ||
      Date.now() - normalizedLastSyncAt.getTime() > FRIDGE_STALE_THRESHOLD_MS;

    if (isStale && status === 'synced') {
      setStatus('stale');
    }
  }, [appState, hasHydrated, normalizedLastSyncAt, setStatus, status]);

  if (fridgeItemId !== undefined) {
    const current = getFridgeItemDetail(fridgeItemId);
    const fridgeItem = current ? enrichItem(current) : null;

    return {
      fridgeItem,
      updateItem: (body: IUpdateFridgeItemBody) =>
        updateItem(fridgeItemId, body),
      deleteItem: () => deleteItem(fridgeItemId),
      isMutating,
      error,
    };
  }

  const enrichedList = fridgeItemList.map(enrichItem);
  const filteredList = applyFilters(enrichedList, filters);

  const setSearch = (search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const setPriorityFilter = (priority: FridgeItemPriority | null) => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const refetch = () => {
    if (isFetching) return;

    setStatus('stale');
  };

  return {
    fridgeItems: filteredList,
    totalCount: fridgeItemList.length,
    filteredCount: filteredList.length,
    lastSyncAt: normalizedLastSyncAt,

    isLoading: !hasHydrated || isFetching,
    isMutating,
    isStale: status === 'stale',
    error,

    filters,
    setSearch,
    setPriorityFilter,
    resetFilters,
    refetch,

    createItem,
    updateItem,
    deleteItem,
  };
}