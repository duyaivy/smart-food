import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { toValidDate } from '@/lib/utils/format';
import {
  type ICategory,
  type IIngredient,
} from '@/models/interfaces/ingredient';

type IngredientStoreStatus = 'synced' | 'stale' | 'syncing';
export const STALE_THRESHOLD_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export type IngredientState = {
  hasHydrated: boolean;
  ingredientList: IIngredient[];
  lastSyncAt: Date | null;
  status: IngredientStoreStatus;
  ingredientDetailsById: Record<number, IIngredient>;
  categories: ICategory[];

  setCategories: (list: ICategory[]) => void;
  setIngredientList: (list: IIngredient[]) => void;
  updateIngredientList: (IIngredient: IIngredient[]) => void;
  setStatus: (status: IngredientStoreStatus) => void;
  getIngredientDetail: (ingredientId: number) => IIngredient | null;
  markHydrated: () => void;
  reset: () => void;
};

const mmkvStateStorage = createMmkvZustandStorage(storage);
const _useIngredient = create<IngredientState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      ingredientList: [],
      lastSyncAt: null,
      status: 'stale',
      ingredientDetailsById: {},
      categories: [],
      setIngredientList: (ingredientList) => {
        const ingredientDetailsById = Object.fromEntries(
          ingredientList.map((i) => [i.id, i])
        );
        set({
          ingredientList,
          ingredientDetailsById,
          lastSyncAt: new Date(),
          status: 'synced',
        });
      },
      updateIngredientList: (IIngredientes) => {
        set((state) => {
          // clone current ingredient list into a map for O(1) access
          const ingredientMap = new Map(
            state.ingredientList.map((ingredient) => [
              ingredient.id,
              ingredient,
            ])
          );

          for (const incomingIngredient of IIngredientes) {
            ingredientMap.set(incomingIngredient.id, incomingIngredient);
          }

          return {
            ingredientList: Array.from(ingredientMap.values()),
            ingredientDetailsById: Object.fromEntries(
              Array.from(ingredientMap.values()).map((i) => [i.id, i])
            ),
            lastSyncAt: new Date(),
            status: 'synced' as IngredientStoreStatus,
          };
        });
      },
      setCategories: (categories) => {
        set({ categories });
      },
      setStatus: (status) => {
        set({ status });
      },
      getIngredientDetail: (ingredientId) => {
        return get().ingredientDetailsById[ingredientId] ?? null;
      },
      markHydrated: () => {
        set({ hasHydrated: true });
      },
      reset: () => {
        set({
          hasHydrated: true,
          ingredientList: [],
          lastSyncAt: null,
          status: 'stale',
          ingredientDetailsById: {},
        });
      },
    }),
    {
      name: 'ingredient-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: (state) => ({
        ingredientList: state.ingredientList,
        lastSyncAt: state.lastSyncAt,
        status: state.status,
        categories: state.categories,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.lastSyncAt = toValidDate(state.lastSyncAt);
          state.ingredientDetailsById = Object.fromEntries(
            state.ingredientList.map((i) => [i.id, i])
          );
        }
        state?.markHydrated();
      },
    }
  )
);

export const useIngredientStore = createSelectors(_useIngredient);
