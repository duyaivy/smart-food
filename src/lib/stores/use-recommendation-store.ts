import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import {
  type RecommendationInput,
  type RecommendationJobStatus,
  type RecommendationOutput,
} from '@/models/interfaces/recommendation';

// ─── Types ────────────────────────────────────────────────────────────────────

export type RecommendationState = {
  hasHydrated: boolean;

  /** The most recent submitted job ID. Persisted across app restarts. */
  jobId: number | null;

  /** Last known status — checked once on app launch, then driven by push notifications. */
  jobStatus: RecommendationJobStatus | 'IDLE';

  /** The completed meal plan, null when pending or never submitted. */
  result: RecommendationOutput | null;

  /** The input parameters used when the last job was submitted. */
  input: RecommendationInput | null;

  // ─── Actions ──────────────────────────────────────────────────────────────

  setJob: (jobId: number, input: RecommendationInput) => void;
  setResult: (result: RecommendationOutput) => void;
  setJobStatus: (status: RecommendationJobStatus | 'IDLE') => void;
  markHydrated: () => void;
  reset: () => void;
};

// ─── Store ────────────────────────────────────────────────────────────────────

const mmkvStateStorage = createMmkvZustandStorage(storage);

const _useRecommendation = create<RecommendationState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      jobId: null,
      jobStatus: 'IDLE',
      result: null,
      input: null,

      setJob: (jobId, input) =>
        set({ jobId, input, jobStatus: 'PENDING', result: null }),

      setResult: (result) => set({ result, jobStatus: result.status }),

      setJobStatus: (jobStatus) => set({ jobStatus }),

      markHydrated: () => set({ hasHydrated: true }),

      reset: () =>
        set({
          hasHydrated: true,
          jobId: null,
          jobStatus: 'IDLE',
          result: null,
          input: null,
        }),
    }),
    {
      name: 'recommendation-storage',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

export const useRecommendationStore = createSelectors(_useRecommendation);
