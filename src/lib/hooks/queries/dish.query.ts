import { useQuery } from '@tanstack/react-query';

import { dishApi } from '@/api/dish.api';
import { queryKeys } from '@/constants/query-key';
import { useDishStore } from '@/lib/stores/use-dish-store';
import { type SuccessResponse } from '@/models/interfaces/common';
import { type MiniDish } from '@/models/interfaces/dish';

export const useGetDishSyncQuery = () => {
  const { listDishMini, lastSyncAt } = useDishStore((state) => {
    return {
      listDishMini: state.dishList,
      lastSyncAt: state.lastSyncAt,
    };
  });
  return useQuery<SuccessResponse<MiniDish[]>>({
    queryKey: queryKeys.syncDish,
    queryFn: async () => {
      const date = new Date();
      const response = await dishApi.getDishesSync(date.toISOString());
      return response.data;
    },
    initialData: listDishMini
      ? { message: 'local-cache', data: listDishMini }
      : undefined,
    initialDataUpdatedAt: lastSyncAt ?? undefined,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 3,
  });
};
