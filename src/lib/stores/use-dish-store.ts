import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { type IDish, type MiniDish } from '@/models/interfaces/dish';

type DishStoreStatus = 'synced' | 'stale' | 'syncing';
type DishDetailCacheItem = { data: IDish; cachedAt: number };

export type DishState = {
  hasHydrated: boolean;
  dishList: MiniDish[];
  lastSyncAt: number | null;
  status: DishStoreStatus;
  dishDetailsById: Record<number, DishDetailCacheItem>;

  setDishList: (list: MiniDish[]) => void;
  updateDishListItem: (miniDish: MiniDish[]) => void;
  setStatus: (status: DishStoreStatus) => void;
  setDishDetail: (dishId: number, detail: IDish) => void;
  getDishDetail: (dishId: number) => IDish | null;
  removeDishDetail: (dishId: number) => void;
  clearDishDetails: () => void;
  markHydrated: () => void;
  reset: () => void;
};
const mmkvStateStorage = createMmkvZustandStorage(storage);
const _useDish = create<DishState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      dishList: [],
      lastSyncAt: null,
      status: 'stale',
      dishDetailsById: {},
      setDishList: (dishList) => {
        set({ dishList, lastSyncAt: Date.now(), status: 'synced' });
      },
      updateDishListItem: (miniDishes) => {
        set((state) => {
          // clone current dish list into a map for O(1) access
          const dishMap = new Map(
            state.dishList.map((dish) => [dish.id, dish])
          );

          for (const incomingDish of miniDishes) {
            dishMap.set(incomingDish.id, incomingDish);
          }

          return {
            dishList: Array.from(dishMap.values()),
          };
        });
      },
      setStatus: (status) => {
        set({ status });
      },
      setDishDetail: (dishId, detail) => {
        set((state) => ({
          dishDetailsById: {
            ...state.dishDetailsById,
            [dishId]: { data: detail, cachedAt: Date.now() },
          },
        }));
      },
      getDishDetail: (dishId) => {
        return get().dishDetailsById[dishId]?.data ?? null;
      },
      removeDishDetail: (dishId) => {
        set((state) => {
          const next = { ...state.dishDetailsById };
          delete next[dishId];
          return { dishDetailsById: next };
        });
      },
      clearDishDetails: () => {
        set({ dishDetailsById: {} });
      },
      markHydrated: () => {
        set({ hasHydrated: true });
      },
      reset: () => {
        set({
          hasHydrated: true,
          dishList: [],
          lastSyncAt: null,
          status: 'stale',
          dishDetailsById: {},
        });
      },
    }),
    {
      name: 'dish-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);
export const useDishStore = createSelectors(_useDish);
