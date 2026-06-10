import request from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import type { SuccessResponse } from '@/models/interfaces/common';
import type {
  CreateMealInput,
  GetMealHistoryParams,
  MealHistoryDetail,
  MealHistoryListItem,
  MealListResult,
} from '@/models/interfaces/meal';

const MEAL_HISTORY_URL = '/meals/history';
const MEAL_DETAIL_URL = '/meals/history/:mealLogId';
const CREATE_MEAL_URL = '/meals';

export const mealApi = {
  getMealHistory: (params: GetMealHistoryParams) => {
    const queryParams: Record<string, string | number | undefined> = {};
    if (params.page) queryParams.page = params.page;
    if (params.limit) queryParams.limit = params.limit;
    if (params.fromDate) queryParams.fromDate = params.fromDate.toISOString();
    if (params.toDate) queryParams.toDate = params.toDate.toISOString();
    if (params.dishId) queryParams.dishId = params.dishId;
    if (params.sortBy) queryParams.sortBy = params.sortBy;
    if (params.sortOrder) queryParams.sortOrder = params.sortOrder;

    return request<SuccessResponse<MealListResult<MealHistoryListItem>>>(
      generatePath(MEAL_HISTORY_URL, {}, queryParams)
    );
  },

  getMealHistoryById: (mealLogId: number) =>
    request<SuccessResponse<MealHistoryDetail>>(
      generatePath(MEAL_DETAIL_URL, { mealLogId })
    ),

  createMeal: (body: CreateMealInput) =>
    request<SuccessResponse<MealHistoryDetail>>({
      url: CREATE_MEAL_URL,
      method: 'POST',
      data: body,
    }),
};
