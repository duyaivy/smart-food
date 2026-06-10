import { useQuery } from '@tanstack/react-query';

import { nutritionApi } from '@/api/nutrition.api';
import { queryKeys } from '@/constants/query-key';

export const useGetDailyNutritionQuery = (date: string) =>
  useQuery({
    queryKey: queryKeys.nutritionDaily(date),
    queryFn: async () => {
      const res = await nutritionApi.getDaily(date);
      return res.data.data;
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });

export const useGetWeeklyNutritionQuery = (week: string) =>
  useQuery({
    queryKey: queryKeys.nutritionWeekly(week),
    queryFn: async () => {
      const res = await nutritionApi.getWeekly(week);
      return res.data.data;
    },
    enabled: !!week,
    staleTime: 5 * 60 * 1000,
  });

export const useGetDailyRemainingQuery = (date: string) =>
  useQuery({
    queryKey: queryKeys.nutritionRemaining(date),
    queryFn: async () => {
      const res = await nutritionApi.getDailyRemaining(date);
      return res.data.data;
    },
    enabled: !!date,
    staleTime: 5 * 60 * 1000,
  });
