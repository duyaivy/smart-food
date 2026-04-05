import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type {
  IotPairedDevice,
  StoredIotDeviceStatus,
} from '@/models/interfaces/iot';
import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';

export type IotStoreState = {
  hasHydrated: boolean;
  device: IotPairedDevice | null;
  status: StoredIotDeviceStatus | null;
  lastSyncedAt: number | null;

  setDevice: (
    device: Omit<IotPairedDevice, 'pairedAt'> & { pairedAt?: number }
  ) => void;
  setStatus: (
    status: Omit<StoredIotDeviceStatus, 'fetchedAt'> & { fetchedAt?: number }
  ) => void;
  setLastSyncedAt: (timestamp?: number) => void;
  clearDevice: () => void;
  markHydrated: () => void;
  reset: () => void;
};

const mmkvStateStorage = createMmkvZustandStorage(storage);

const _useIotStore = create<IotStoreState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      device: null,
      status: null,
      lastSyncedAt: null,

      setDevice: (device) => {
        set({
          device: {
            ...device,
            pairedAt: device.pairedAt ?? Date.now(),
          },
          lastSyncedAt: Date.now(),
        });
      },

      setStatus: (status) => {
        set((state) => ({
          status: {
            ...status,
            fetchedAt: status.fetchedAt ?? Date.now(),
          },
          device: state.device
            ? {
                ...state.device,
                deviceUid: status.deviceUid,
              }
            : state.device,
          lastSyncedAt: Date.now(),
        }));
      },

      setLastSyncedAt: (timestamp) => {
        set({ lastSyncedAt: timestamp ?? Date.now() });
      },

      clearDevice: () => {
        set({
          device: null,
          status: null,
          lastSyncedAt: null,
        });
      },

      markHydrated: () => {
        set({ hasHydrated: true });
      },

      reset: () => {
        set({
          hasHydrated: true,
          device: null,
          status: null,
          lastSyncedAt: null,
        });
      },
    }),
    {
      name: 'iot-device-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

export const useIotStore = createSelectors(_useIotStore);