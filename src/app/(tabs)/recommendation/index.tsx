import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { LoadingPlaceholder } from '@/components/recommendation/loading-placeholder';
import { HeaderNoBack } from '@/components/ui/header-no-back';
import { useGetRecommendationQuery } from '@/lib/hooks/queries/recommendation.query';
import { useRecommendationStore } from '@/lib/stores/use-recommendation-store';

import { RecommendationFailedState } from './_components/recommendation-failed-state';
import { RecommendationRequest } from './_components/recommendation-request';
import { RecommendationResult } from './_components/recommendation-result';

export default function RecommendationScreen() {
  const jobStatus = useRecommendationStore.use.jobStatus();
  const jobId = useRecommendationStore.use.jobId();
  const result = useRecommendationStore.use.result();
  const reset = useRecommendationStore.use.reset();

  const { isFetching, refetch } = useGetRecommendationQuery(jobId);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      edges={['top']}
    >
      <HeaderNoBack title="Gợi ý thông minh" />

      <AnimatePresence exitBeforeEnter>
        {jobStatus === 'SUCCESS' && result ? (
          <MotiView
            key="result"
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ flex: 1 }}
          >
            <RecommendationResult
              result={result}
              isRefreshing={isFetching}
              onRefresh={refetch}
            />
          </MotiView>
        ) : jobStatus === 'FAILED' ? (
          <MotiView
            key="failed"
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            style={{ flex: 1 }}
          >
            <RecommendationFailedState
              message={result?.message}
              onReset={reset}
            />
          </MotiView>
        ) : jobStatus === 'PENDING' ? (
          <MotiView
            key="pending"
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ flex: 1 }}
          >
            <LoadingPlaceholder />
          </MotiView>
        ) : (
          <MotiView
            key="request"
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: -20 }}
            style={{ flex: 1 }}
          >
            <RecommendationRequest />
          </MotiView>
        )}
      </AnimatePresence>
    </SafeAreaView>
  );
}
