import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import {
  type PaginationParams,
  type PaginationResponse,
  type SuccessResponse,
} from '@/models/interfaces/common';
import { type IIngredient } from '@/models/interfaces/ingredient';

const INGREDIENT_URL = '/ingredients';
const INGREDIENT_SYNC_URL = '/ingredients/sync';
const INGREDIENT_DETAIL_URL = '/ingredients/:id';

export const ingredientApi = {
  getIngredients: ({ page, limit }: PaginationParams) =>
    http<SuccessResponse<PaginationResponse<IIngredient>>>(
      generatePath(INGREDIENT_URL, {}, { page, limit })
    ),
  getIngredientsSync: (lastSyncAt?: Date) =>
    http<SuccessResponse<IIngredient[]>>(
      generatePath(
        INGREDIENT_SYNC_URL,
        {},
        {
          lastSyncAt: lastSyncAt?.toISOString(),
        }
      )
    ),
  getIngredientDetail: (id: string) =>
    http<SuccessResponse<IIngredient>>(
      generatePath(INGREDIENT_DETAIL_URL, { id })
    ),
};
