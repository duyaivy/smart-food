import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import {
  type PaginationParams,
  type SuccessResponse,
} from '@/models/interfaces/common';
import {
  type ICategory,
  type ICategoryDetail,
} from '@/models/interfaces/ingredient';

const CATEGORY_DETAIL_URL = '/categories/:id';
const GET_CATEGORIES_URL = '/categories';
export const categoryApi = {
  getCategories: ({ page, limit }: PaginationParams) =>
    http<SuccessResponse<ICategory[]>>(
      generatePath(GET_CATEGORIES_URL, {}, { page, limit })
    ),
  getCategoryDetail: (id: string) =>
    http<SuccessResponse<ICategoryDetail>>(
      generatePath(CATEGORY_DETAIL_URL, { id })
    ),
};
