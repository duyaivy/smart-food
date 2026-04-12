import {
  type PaginationResponse,
  type SuccessResponse,
} from '@/models/interfaces/common';
import {
  type ICategory,
  type ICategoryDetail,
} from '@/models/interfaces/ingredient';

import http from './common/axios.config';

const CATEGORY_URL = '/categories';

export const categoryApi = {
  getCategories: (queryString: string) =>
    http<SuccessResponse<ICategory[]>>(`${CATEGORY_URL}?${queryString}`),
  getCategoryDetail: (id: string) =>
    http<SuccessResponse<ICategoryDetail>>(`${CATEGORY_URL}/${id}`),
};
