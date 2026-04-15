import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '@/api/category.api';

export const useCategoryQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories({ page: 1, limit: 10 }),
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};
