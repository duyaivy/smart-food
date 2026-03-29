import {
  type PaginationResponse,
  type SuccessResponse,
} from '@/models/interfaces/common';
import { type IDish, type MiniDish } from '@/models/interfaces/dish';

import http from './common/axios.config';

const DISH_URL = '/dishes';

export const dishApi = {
  getDishes: (queryString: string) =>
    http<SuccessResponse<PaginationResponse<MiniDish>>>(
      `${DISH_URL}?${queryString}`
    ),
  getDishesSync: (lastSyncAt: string) =>
    http<SuccessResponse<MiniDish[]>>(
      `${DISH_URL}/sync?lastSyncAt=${lastSyncAt}`
    ),
  getDishDetail: (id: string) =>
    http<SuccessResponse<IDish>>(`${DISH_URL}/${id}`),
};
