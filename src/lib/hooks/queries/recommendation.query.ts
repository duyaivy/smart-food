import { useMutation, useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

import { recommendationApi } from '@/api/recommendation.api';
import { queryKeys } from '@/constants/query-key';
import { showMessage } from '@/lib/common/show-message';
import { useRecommendationStore } from '@/lib/stores/use-recommendation-store';
import { type SuccessResponse } from '@/models/interfaces/common';
import {
  type RecommendationInput,
  type RecommendationOutput,
} from '@/models/interfaces/recommendation';

// ─── Submit Job Mutation ───────────────────────────────────────────────────────

/**
 * Submit a new recommendation job.
 * On success, persists the jobId and input to the Zustand store (MMKV-backed).
 */
export const useSubmitRecommendationMutation = () =>
  useMutation({
    mutationFn: (input: RecommendationInput) => recommendationApi.create(input),
    onSuccess: (response, input) => {
      const { jobId } = response.data.data;
      useRecommendationStore.getState().setJob(jobId, input);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ??
        (error instanceof Error ? error.message : 'Gửi yêu cầu thất bại');

      showMessage({ message, type: 'error' });
    },
  });

// ─── Get Recommendation Result Query ──────────────────────────────────────────

/**
 * Fetch the completed recommendation result for a given jobId.
 *
 * - Only enabled when jobId exists AND jobStatus is NOT already SUCCESS/FAILED.
 * - Called once on app launch / screen focus to check if a pending job is now done.
 * - Further updates are driven by push notifications (see useRecommendationPushListener).
 */
export const useGetRecommendationQuery = (jobId: number | null) => {
  const jobStatus = useRecommendationStore.use.jobStatus();

  return useQuery<
    SuccessResponse<RecommendationOutput>,
    AxiosError,
    SuccessResponse<RecommendationOutput>
  >({
    queryKey: jobId
      ? queryKeys.recommendation(jobId)
      : ['recommendation', null],
    queryFn: async () => {
      if (!jobId) throw new Error('Thiếu jobId');

      const response = await recommendationApi.getResult(jobId);
      const data = response.data;
      const result = data.data;

      const store = useRecommendationStore.getState();
      store.setResult(result);

      return data;
    },
    // Only fire when we have a jobId AND the result isn't already known
    enabled: !!jobId && jobStatus === 'PENDING',
    staleTime: Infinity, // push notification drives invalidation
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
