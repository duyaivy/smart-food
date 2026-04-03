import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';

export type GlobalState = {
  pushToken: string | null;
  setPushToken: (token: string | null) => void;

  reset: () => void;
};
const mmkvStateStorage = createMmkvZustandStorage(storage);
const _useGlobal = create<GlobalState>()(
  persist(
    (set) => ({
      pushToken: null,
      setPushToken: (token) => set({ pushToken: token }),
      reset: () => set({ pushToken: null }),
    }),
    {
      name: 'global-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
    }
  )
);
export const useGlobalStore = createSelectors(_useGlobal);
