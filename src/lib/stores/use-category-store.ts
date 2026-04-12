import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { toValidDate } from '@/lib/utils/format';
import { type ICategory } from '@/models/interfaces/ingredient';

export type DishState = {
  hasHydrated: boolean;
  categories: ICategory[];

  setCategories: (list: ICategory[]) => void;
  markHydrated: () => void;
  reset: () => void;
};

const mmkvStateStorage = createMmkvZustandStorage(storage);
const _useDish = create<DishState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      categories: [],
      setCategories: (categories) => {
        set({ categories });
      },
      markHydrated: () => {
        set({ hasHydrated: true });
      },
      reset: () => {
        set({
          hasHydrated: true,
          categories: [],
        });
      },
    }),
    {
      name: 'category-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.lastSyncAt = toValidDate(state.lastSyncAt);
        }
        state?.markHydrated();
      },
    }
  )
);
export const useCategoryStore = createSelectors(_useCategory);
