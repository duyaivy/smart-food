import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import {
  type PaginationParams,
  type PaginationResponse,
  type SuccessResponse,
} from '@/models/interfaces/common';
import { type IDish, type MiniDish } from '@/models/interfaces/dish';

const GET_DISH_DETAIL_URL = '/dishes/:id';
const DISH_URL = '/dishes';
const SYNC_DISH_URL = '/dishes/sync';

export const dishApi = {
  getDishes: ({ page, limit }: PaginationParams) =>
    http<SuccessResponse<PaginationResponse<MiniDish>>>(
      generatePath(DISH_URL, {}, { page, limit })
    ),
  getDishesSync: (lastSyncAt?: Date) => {
    return http<SuccessResponse<MiniDish[]>>(
      generatePath(SYNC_DISH_URL, {}, { lastSyncAt: lastSyncAt?.toISOString() })
    );
  },
  getDishDetail: (id: string) =>
    http<SuccessResponse<IDish>>(generatePath(GET_DISH_DETAIL_URL, { id })),
};
