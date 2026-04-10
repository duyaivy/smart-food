import {
  type PaginationResponse,
  type SuccessResponse,
} from '@/models/interfaces/common';
import { type IIngredient } from '@/models/interfaces/ingredient';

import http from './common/axios.config';

const INGREDIENT_URL = '/ingredients';

export const ingredientApi = {
  getIngredients: (queryString: string) =>
    http<SuccessResponse<PaginationResponse<IIngredient>>>(
      `${INGREDIENT_URL}?${queryString}`
    ),
  getIngredientsSync: (lastSyncAt?: Date) => {
    const query = lastSyncAt ? `?lastSyncAt=${lastSyncAt.toISOString()}` : '';
    return http<SuccessResponse<IIngredient[]>>(
      `${INGREDIENT_URL}/sync${query}`
    );
  },
  getIngredientDetail: (id: string) =>
    http<SuccessResponse<IIngredient>>(`${INGREDIENT_URL}/${id}`),
};
