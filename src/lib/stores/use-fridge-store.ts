import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { toValidDate } from '@/lib/utils/format';
import type { IFridgeItem } from '@/models/interfaces/fridge';

export type FridgeStoreStatus = 'synced' | 'stale' | 'syncing';

export const FRIDGE_STALE_THRESHOLD_MS = 1000 * 60 * 5;

export type FridgeState = {
  hasHydrated: boolean;
  fridgeItemList: IFridgeItem[];
  fridgeItemDetailsById: Record<number, IFridgeItem>;
  lastSyncAt: Date | null;
  status: FridgeStoreStatus;

  setFridgeItemList: (list: IFridgeItem[]) => void;
  appendFridgeItemList: (list: IFridgeItem[]) => void;
  addFridgeItem: (item: IFridgeItem) => void;
  updateFridgeItem: (item: IFridgeItem) => void;
  removeFridgeItem: (itemId: number) => void;
  getFridgeItemDetail: (itemId: number) => IFridgeItem | null;
  setStatus: (status: FridgeStoreStatus) => void;
  markHydrated: () => void;
  reset: () => void;
};

const buildDetailsById = (list: IFridgeItem[]) =>
  Object.fromEntries(list.map((item) => [item.id, item]));

const sortByCreatedAtDesc = (list: IFridgeItem[]) =>
  [...list].sort((a, b) => {
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();

    return bTime - aTime;
  });

const mmkvStateStorage = createMmkvZustandStorage(storage);

const _useFridge = create<FridgeState>()(
  persist(
    (set, get) => ({
      hasHydrated: false,
      fridgeItemList: [],
      fridgeItemDetailsById: {},
      lastSyncAt: null,
      status: 'stale',

      setFridgeItemList: (fridgeItemList) => {
        const activeItems = sortByCreatedAtDesc(
          fridgeItemList.filter((item) => !item.deleteAt)
        );

        set({
          fridgeItemList: activeItems,
          fridgeItemDetailsById: buildDetailsById(activeItems),
          lastSyncAt: new Date(),
          status: 'synced',
        });
      },

      appendFridgeItemList: (fridgeItemList) => {
        const activeItems = fridgeItemList.filter((item) => !item.deleteAt);

        set((state) => {
          const itemById = new Map<number, IFridgeItem>();

          [...state.fridgeItemList, ...activeItems].forEach((item) => {
            itemById.set(item.id, item);
          });

          const nextList = sortByCreatedAtDesc([...itemById.values()]);

          return {
            fridgeItemList: nextList,
            fridgeItemDetailsById: buildDetailsById(nextList),
            lastSyncAt: new Date(),
            status: 'synced' as FridgeStoreStatus,
          };
        });
      },

      addFridgeItem: (item) => {
        if (item.deleteAt) return;

        set((state) => {
          const nextList = sortByCreatedAtDesc([
            item,
            ...state.fridgeItemList.filter((current) => current.id !== item.id),
          ]);

          return {
            fridgeItemList: nextList,
            fridgeItemDetailsById: buildDetailsById(nextList),
            lastSyncAt: new Date(),
            status: 'synced' as FridgeStoreStatus,
          };
        });
      },

      updateFridgeItem: (item) => {
        set((state) => {
          const nextList = item.deleteAt
            ? state.fridgeItemList.filter((current) => current.id !== item.id)
            : state.fridgeItemList.map((current) =>
                current.id === item.id ? item : current
              );

          const normalizedList = sortByCreatedAtDesc(
            nextList.some((current) => current.id === item.id) || item.deleteAt
              ? nextList
              : [item, ...nextList]
          );

          return {
            fridgeItemList: normalizedList,
            fridgeItemDetailsById: buildDetailsById(normalizedList),
            lastSyncAt: new Date(),
            status: 'synced' as FridgeStoreStatus,
          };
        });
      },

      removeFridgeItem: (itemId) => {
        set((state) => {
          const nextList = state.fridgeItemList.filter(
            (item) => item.id !== itemId
          );

          return {
            fridgeItemList: nextList,
            fridgeItemDetailsById: buildDetailsById(nextList),
            lastSyncAt: new Date(),
            status: 'synced' as FridgeStoreStatus,
          };
        });
      },

      getFridgeItemDetail: (itemId) => {
        return get().fridgeItemDetailsById[itemId] ?? null;
      },

      setStatus: (status) => {
        set({ status });
      },

      markHydrated: () => {
        set({ hasHydrated: true });
      },

      reset: () => {
        set({
          hasHydrated: true,
          fridgeItemList: [],
          fridgeItemDetailsById: {},
          lastSyncAt: null,
          status: 'stale',
        });
      },
    }),
    {
      name: 'fridge-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: (state) => ({
        fridgeItemList: state.fridgeItemList,
        lastSyncAt: state.lastSyncAt,
        status: state.status,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;

        state.lastSyncAt = toValidDate(state.lastSyncAt);
        state.fridgeItemList = state.fridgeItemList.filter(
          (item) => !item.deleteAt
        );
        state.fridgeItemDetailsById = buildDetailsById(state.fridgeItemList);

        state.markHydrated();
      },
    }
  )
);

export const useFridgeStore = createSelectors(_useFridge);
