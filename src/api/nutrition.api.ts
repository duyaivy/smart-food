import request from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import type { SuccessResponse } from '@/models/interfaces/common';
import type {
  DailyNutritionData,
  DailyRemainingData,
  WeeklyNutritionData,
} from '@/models/interfaces/nutrition';

export const nutritionApi = {
  getDaily: (date: string) =>
    request<SuccessResponse<DailyNutritionData>>(
      generatePath('/nutrition/daily', {}, { date })
    ),

  getWeekly: (week: string) =>
    request<SuccessResponse<WeeklyNutritionData>>(
      generatePath('/nutrition/weekly', {}, { week })
    ),

  getDailyRemaining: (date: string) =>
    request<SuccessResponse<DailyRemainingData>>(
      generatePath('/nutrition/daily/remaining', {}, { date })
    ),
};
