import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { mealApi } from '@/api/meal.api';
import { queryKeys } from '@/constants/query-key';
import type {
  CreateMealInput,
  GetMealHistoryParams,
} from '@/models/interfaces/meal';

export const useGetMealHistoryQuery = (params: GetMealHistoryParams) => {
  return useQuery({
    queryKey: queryKeys.mealHistory(params),
    queryFn: async () => {
      const response = await mealApi.getMealHistory(params);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetMealHistoryDetailQuery = (mealLogId: number) => {
  return useQuery({
    queryKey: queryKeys.mealHistoryDetail(mealLogId),
    queryFn: async () => {
      const response = await mealApi.getMealHistoryById(mealLogId);
      return response.data;
    },
    enabled: !!mealLogId,
    staleTime: 10 * 60 * 1000,
  });
};

export const useCreateMealMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateMealInput) => mealApi.createMeal(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meal-history'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-daily'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-weekly'] });
      queryClient.invalidateQueries({ queryKey: ['nutrition-remaining'] });
    },
  });
};
