import { useAppState } from '@react-native-community/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { fridgeApi } from '@/api/fridge.api';
import { useIngredient } from '@/lib/hooks/use-ingredient';
import {
  FRIDGE_STALE_THRESHOLD_MS,
  useFridgeStore,
} from '@/lib/stores/use-fridge-store';
import { normalizeText, toValidDate } from '@/lib/utils/format';
import type {
  ICreateFridgeItemBody,
  IFridgeItem,
  IUpdateFridgeItemBody,
} from '@/models/interfaces/fridge';
import type { IIngredient } from '@/models/interfaces/ingredient';
import { type FridgeItemPriority } from '@/models/types/fridge';

export type FridgeListFilters = {
  search: string;
  priority: FridgeItemPriority | null;
};

export type EnrichedFridgeItem = IFridgeItem & {
  ingredient?: IIngredient;
};

type UseFridgeDetailReturn = {
  fridgeItem: EnrichedFridgeItem | null;
  updateItem: (body: IUpdateFridgeItemBody) => Promise<IFridgeItem | null>;
  deleteItem: () => Promise<boolean>;
  isMutating: boolean;
  error: string | null;
};

type UseFridgeListReturn = {
  fridgeItems: EnrichedFridgeItem[];
  totalCount: number;
  filteredCount: number;
  lastSyncAt: Date | null;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  isMutating: boolean;
  isStale: boolean;
  hasNextPage: boolean;
  error: string | null;
  filters: FridgeListFilters;

  setSearch: (search: string) => void;
  setPriorityFilter: (priority: FridgeItemPriority | null) => void;
  resetFilters: () => void;
  refetch: () => void;
  fetchNextPage: () => void;
  createItem: (body: ICreateFridgeItemBody) => Promise<IFridgeItem | null>;
  updateItem: (
    id: number | string,
    body: IUpdateFridgeItemBody
  ) => Promise<IFridgeItem | null>;
  deleteItem: (id: number | string) => Promise<boolean>;
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

const FRIDGE_PAGE_SIZE = 20;

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

export function useFridge(fridgeItemId: number): UseFridgeDetailReturn;

export function useFridge(): UseFridgeListReturn;

export function useFridge(
  fridgeItemId?: number
): UseFridgeDetailReturn | UseFridgeListReturn {
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
    appendFridgeItemList,
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
      appendFridgeItemList: state.appendFridgeItemList,
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
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    hasNextPage: false,
  });

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

  const applyPagination = useCallback(
    (control: { page: number; limit: number; total: number }) => {
      const page = control.page || 1;
      const limit = control.limit || FRIDGE_PAGE_SIZE;
      const total = control.total || 0;

      setPagination({
        page,
        total,
        hasNextPage: page * limit < total,
      });
    },
    []
  );

  const fetchFirstFridgePage = useCallback(async () => {
    const { data } = await fridgeApi.getFridgeItems({
      page: 1,
      limit: FRIDGE_PAGE_SIZE,
    });

    setFridgeItemList(data.data.results);
    applyPagination(data.data.control);
  }, [applyPagination, setFridgeItemList]);

  const fetchFridgeItems = useCallback(async () => {
    try {
      setError(null);
      setIsFetching(true);
      setStatus('syncing');

      await fetchFirstFridgePage();
    } catch (err) {
      if (isFridgeNotFoundError(err)) {
        try {
          await fridgeApi.createFridge();
          await fetchFirstFridgePage();
        } catch (createErr) {
          setFridgeItemList([]);
          setPagination({ page: 1, total: 0, hasNextPage: false });
          setStatus('synced');
          setError(getApiErrorMessage(createErr) || null);
        }

        return;
      }

      setStatus('synced');
      setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');
    } finally {
      setIsFetching(false);
    }
  }, [fetchFirstFridgePage, setFridgeItemList, setStatus]);

  const fetchNextPage = useCallback(async () => {
    if (isFetching || isFetchingNextPage || !pagination.hasNextPage) return;

    try {
      setError(null);
      setIsFetchingNextPage(true);

      const nextPage = pagination.page + 1;
      const { data } = await fridgeApi.getFridgeItems({
        page: nextPage,
        limit: FRIDGE_PAGE_SIZE,
      });

      appendFridgeItemList(data.data.results);
      applyPagination(data.data.control);
    } catch (err) {
      setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [
    appendFridgeItemList,
    applyPagination,
    isFetching,
    isFetchingNextPage,
    pagination.hasNextPage,
    pagination.page,
  ]);

  const createItem = useCallback(
    async (body: ICreateFridgeItemBody) => {
      try {
        setError(null);
        setIsMutating(true);

        const existingItem = fridgeItemList.find(
          (item) => !item.deleteAt && item.ingredientId === body.ingredientId
        );

        if (existingItem) {
          const { data } = await fridgeApi.updateFridgeItem(existingItem.id, {
            ...body,
            quantity: existingItem.quantity + body.quantity,
          });

          updateFridgeItem(data.data);

          return data.data;
        }

        const { data } = await fridgeApi.createFridgeItem(body);

        addFridgeItem(data.data);

        return data.data;
      } catch (err) {
        setError(getApiErrorMessage(err) || 'Có lỗi xảy ra');

        return null;
      } finally {
        setIsMutating(false);
      }
    },
    [addFridgeItem, fridgeItemList, updateFridgeItem]
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

    void fetchFridgeItems();
  };

  return {
    fridgeItems: filteredList,
    totalCount: pagination.total || fridgeItemList.length,
    filteredCount: filteredList.length,
    lastSyncAt: normalizedLastSyncAt,

    isLoading: !hasHydrated || isFetching,
    isFetchingNextPage,
    isMutating,
    isStale: status === 'stale',
    hasNextPage: pagination.hasNextPage,
    error,

    filters,
    setSearch,
    setPriorityFilter,
    resetFilters,
    refetch,
    fetchNextPage,

    createItem,
    updateItem,
    deleteItem,
  };
}
