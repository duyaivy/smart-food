import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';

export type IotScanRecordStatus = 'DONE' | 'FAILED';

export type IotScanRecord = {
  id: string;
  deviceUid: string;
  ingredientName: string | null;
  calories: number | null;
  weight: number;
  status: IotScanRecordStatus;
  message: string;
  imageUrl: string;
  recordedAt: number;
  source: 'local' | 'sse' | 'sync';
};

export type IotScanStoreState = {
  hasHydrated: boolean;
  records: IotScanRecord[];

  addRecord: (record: Omit<IotScanRecord, 'id' | 'recordedAt'> & { id?: string; recordedAt?: number }) => void;
  setRecords: (records: IotScanRecord[]) => void;
  removeRecordsByDeviceUid: (deviceUid: string) => void;
  clearRecords: () => void;
  markHydrated: () => void;
  reset: () => void;
};

const mmkvStateStorage = createMmkvZustandStorage(storage);

const _useIotScanStore = create<IotScanStoreState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      records: [],

      addRecord: (record) => {
        const nextRecord: IotScanRecord = {
          ...record,
          id:
            record.id ??
            `${record.deviceUid}-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 8)}`,
          recordedAt: record.recordedAt ?? Date.now(),
        };

        set((state) => ({
          records: [nextRecord, ...state.records],
        }));
      },

      setRecords: (records) => {
        set({ records });
      },

      removeRecordsByDeviceUid: (deviceUid) => {
        set((state) => ({
          records: state.records.filter((record) => record.deviceUid !== deviceUid),
        }));
      },

      clearRecords: () => {
        set({ records: [] });
      },

      markHydrated: () => {
        set({ hasHydrated: true });
      },

      reset: () => {
        set({
          hasHydrated: true,
          records: [],
        });
      },
    }),
    {
      name: 'iot-scan-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

export const useIotScanStore = createSelectors(_useIotScanStore);