import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import { type SuccessResponse } from '@/models/interfaces/common';
import {
  type CreateRecommendationResponse,
  type RecommendationInput,
  type RecommendationOutput,
} from '@/models/interfaces/recommendation';

const RECOMMENDATIONS_URL = '/recommendations';
const RECOMMENDATION_DETAIL_URL = '/recommendations/:jobId';

export const recommendationApi = {
  /**
   * Submit a new recommendation job.
   * Returns the created jobId immediately; the AI processes it asynchronously.
   */
  create: (input: RecommendationInput) =>
    http.post<SuccessResponse<CreateRecommendationResponse>>(
      RECOMMENDATIONS_URL,
      input
    ),

  getResult: (jobId: number) =>
    http.get<SuccessResponse<RecommendationOutput>>(
      generatePath(RECOMMENDATION_DETAIL_URL, { jobId: String(jobId) })
    ),
};
