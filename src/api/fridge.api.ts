import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import type {
  PaginationParams,
  PaginationResponse,
  SuccessResponse,
} from '@/models/interfaces/common';
import type {
  ICreateFridgeItemBody,
  IFridgeItem,
  IUpdateFridgeItemBody,
} from '@/models/interfaces/fridge';

const FRIDGE_ITEMS_URL = '/fridge/items';
const FRIDGE_ITEM_DETAIL_URL = '/fridge/items/:id';
const FRIDGE_URL = '/fridge';

export const fridgeApi = {
  createFridge: () => http.post<SuccessResponse<unknown>>(FRIDGE_URL),

  getFridgeItems: ({ page = 1, limit = 10 }: Partial<PaginationParams> = {}) =>
    http<SuccessResponse<PaginationResponse<IFridgeItem>>>(
      generatePath(FRIDGE_ITEMS_URL, {}, { page, limit })
    ),

  createFridgeItem: (body: ICreateFridgeItemBody) =>
    http.post<SuccessResponse<IFridgeItem>>(FRIDGE_ITEMS_URL, body),

  updateFridgeItem: (id: number | string, body: IUpdateFridgeItemBody) =>
    http.patch<SuccessResponse<IFridgeItem>>(
      generatePath(FRIDGE_ITEM_DETAIL_URL, { id }),
      body
    ),

  deleteFridgeItem: (id: number | string) =>
    http.delete<SuccessResponse<IFridgeItem>>(
      generatePath(FRIDGE_ITEM_DETAIL_URL, { id })
    ),
};
