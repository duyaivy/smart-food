import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';
import {
  Modal,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { Text } from '@/components/ui';
import colors from '@/constants/colors';
import {
  useGetSubRecommendationsMutation,
  useUpdateRecommendationMutation,
} from '@/lib/hooks/queries/recommendation.query';
import { useRecommendationStore } from '@/lib/stores/use-recommendation-store';
import { type IIngredient } from '@/models/interfaces/ingredient';
import {
  type DishCandidate,
  type RecommendationMeal,
  type SubRecommendationGroup,
  type SwapItem,
} from '@/models/interfaces/recommendation';

import {
  SwapModalErrorState,
  SwapModalLoadingState,
} from './dish-swap-modal-feedback';
import { DishSwapModalFooter } from './dish-swap-modal-footer';
import { DishSwapRecommendationList } from './dish-swap-recommendation-list';

const MODAL_HEIGHT_RATIO = 0.7;
const EMPTY_SUB_RECOMMENDATIONS: SubRecommendationGroup[] = [];

interface DishSwapModalProps {
  visible: boolean;
  onClose: () => void;
  meals: RecommendationMeal[];
  day: number;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  ingredientsById?: Record<number, IIngredient>;
}

const stopPropagation = (event: GestureResponderEvent) => {
  event.stopPropagation();
};

const getMealDishIds = (meals: RecommendationMeal[]): number[] => {
  const dishIds = new Set<number>();

  for (const meal of meals) {
    const dishId = Number(meal.dishId);
    if (Number.isInteger(dishId) && dishId > 0) {
      dishIds.add(dishId);
    }
  }

  return Array.from(dishIds);
};

const toSwapItem = (
  originalDishId: number,
  candidate: DishCandidate
): SwapItem => ({
  originalDishId,
  dishId: candidate.dishId,
  role: candidate.role,
  name: candidate.name,
  calories: candidate.calories,
  images: candidate.images,
  missingIngredient: candidate.missingIngredient,
});

export const DishSwapModal = memo(
  ({
    visible,
    onClose,
    meals,
    day,
    mealType,
    ingredientsById,
  }: DishSwapModalProps) => {
    const jobId = useRecommendationStore.use.jobId();
    const { height } = useWindowDimensions();
    const [selectedSwaps, setSelectedSwaps] = useState<SwapItem[]>([]);
    const [expandedDishIds, setExpandedDishIds] = useState<Set<number>>(
      new Set()
    );

    const {
      mutate: getSubRecommendations,
      isPending: isLoadingSubRecommendations,
      data: subRecommendationsData,
      isError: isSubRecommendationsError,
      error: subRecommendationsError,
    } = useGetSubRecommendationsMutation();
    const {
      mutateAsync: updateRecommendation,
      isPending: isUpdatingRecommendation,
      isError: isUpdateError,
      error: updateError,
    } = useUpdateRecommendationMutation();

    const dishIds = useMemo(() => getMealDishIds(meals), [meals]);
    const subRecommendations =
      subRecommendationsData?.data.data ?? EMPTY_SUB_RECOMMENDATIONS;

    const selectedSwapsByDishId = useMemo(() => {
      const swapsByDishId = new Map<number, SwapItem>();

      for (const swap of selectedSwaps) {
        swapsByDishId.set(swap.originalDishId, swap);
      }

      return swapsByDishId;
    }, [selectedSwaps]);

    const modalSheetStyle = useMemo<StyleProp<ViewStyle>>(
      () => [styles.sheet, { height: height * MODAL_HEIGHT_RATIO }],
      [height]
    );

    const resetModalState = useCallback(() => {
      setSelectedSwaps([]);
      setExpandedDishIds(new Set());
    }, []);

    const requestSubRecommendations = useCallback(() => {
      if (!jobId || dishIds.length === 0) return;

      getSubRecommendations({ jobId, dishIds });
    }, [dishIds, getSubRecommendations, jobId]);

    useEffect(() => {
      if (!visible) return;

      resetModalState();
    }, [resetModalState, visible]);

    useEffect(() => {
      if (!visible) return;

      requestSubRecommendations();
    }, [requestSubRecommendations, visible]);

    useEffect(() => {
      if (subRecommendations.length === 0) return;

      setExpandedDishIds((current) => {
        if (current.size > 0) return current;

        return new Set(subRecommendations.map((group) => group.originalDishId));
      });
    }, [subRecommendations]);

    const handleToggleExpanded = useCallback((dishId: number) => {
      setExpandedDishIds((current) => {
        const next = new Set(current);

        if (next.has(dishId)) {
          next.delete(dishId);
        } else {
          next.add(dishId);
        }

        return next;
      });
    }, []);

    const handleSelectCandidate = useCallback(
      (originalDishId: number, candidate: DishCandidate) => {
        setSelectedSwaps((current) => {
          const nextSwaps = current.filter(
            (swap) => swap.originalDishId !== originalDishId
          );

          return [...nextSwaps, toSwapItem(originalDishId, candidate)];
        });
      },
      []
    );

    const handleClose = useCallback(() => {
      resetModalState();
      onClose();
    }, [onClose, resetModalState]);

    const handleConfirmSwaps = useCallback(async () => {
      if (!jobId || selectedSwaps.length === 0) return;

      try {
        await updateRecommendation({
          jobId,
          request: {
            day,
            meal: mealType,
            swaps: selectedSwaps,
          },
        });

        resetModalState();
        onClose();
      } catch (error) {
        console.error('Failed to update recommendation:', error);
      }
    }, [
      day,
      jobId,
      mealType,
      onClose,
      resetModalState,
      selectedSwaps,
      updateRecommendation,
    ]);

    const handleFooterPress = useCallback(() => {
      if (isSubRecommendationsError) {
        requestSubRecommendations();
        return;
      }

      void handleConfirmSwaps();
    }, [
      handleConfirmSwaps,
      isSubRecommendationsError,
      requestSubRecommendations,
    ]);

    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={handleClose}
      >
        <Pressable
          className="flex-1 justify-end"
          style={styles.backdrop}
          onPress={handleClose}
        >
          <Pressable
            className="rounded-t-3xl"
            style={modalSheetStyle}
            onPress={stopPropagation}
          >
            <View
              className="flex-row items-center justify-between border-b px-5 py-4"
              style={styles.header}
            >
              <Text className="text-xl font-bold" style={styles.headingText}>
                Tham khảo các món khác
              </Text>
              <Pressable onPress={handleClose}>
                <Text
                  className="text-base font-semibold"
                  style={styles.closeText}
                >
                  Đóng
                </Text>
              </Pressable>
            </View>

            <View className="flex-1 px-4 py-3">
              <DishSwapModalContent
                isLoading={isLoadingSubRecommendations}
                isError={isSubRecommendationsError}
                error={subRecommendationsError}
                subRecommendations={subRecommendations}
                expandedDishIds={expandedDishIds}
                selectedSwapsByDishId={selectedSwapsByDishId}
                ingredientsById={ingredientsById}
                onToggleExpanded={handleToggleExpanded}
                onSelectCandidate={handleSelectCandidate}
              />
            </View>

            <DishSwapModalFooter
              isRetryMode={isSubRecommendationsError}
              isLoading={isLoadingSubRecommendations}
              isUpdating={isUpdatingRecommendation}
              selectedCount={selectedSwaps.length}
              updateError={isUpdateError ? updateError : undefined}
              onPress={handleFooterPress}
            />
          </Pressable>
        </Pressable>
      </Modal>
    );
  }
);

DishSwapModal.displayName = 'DishSwapModal';

interface DishSwapModalContentProps {
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  subRecommendations: SubRecommendationGroup[];
  expandedDishIds: Set<number>;
  selectedSwapsByDishId: Map<number, SwapItem>;
  ingredientsById?: Record<number, IIngredient>;
  onToggleExpanded: (dishId: number) => void;
  onSelectCandidate: (originalDishId: number, candidate: DishCandidate) => void;
}

const DishSwapModalContent = memo(
  ({
    isLoading,
    isError,
    error,
    subRecommendations,
    expandedDishIds,
    selectedSwapsByDishId,
    ingredientsById,
    onToggleExpanded,
    onSelectCandidate,
  }: DishSwapModalContentProps) => {
    if (isLoading) {
      return <SwapModalLoadingState />;
    }

    if (isError) {
      return <SwapModalErrorState error={error} />;
    }

    return (
      <DishSwapRecommendationList
        groups={subRecommendations}
        expandedDishIds={expandedDishIds}
        selectedSwapsByDishId={selectedSwapsByDishId}
        ingredientsById={ingredientsById}
        onToggleExpanded={onToggleExpanded}
        onSelectCandidate={onSelectCandidate}
      />
    );
  }
);

DishSwapModalContent.displayName = 'DishSwapModalContent';

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.white,
  },
  header: {
    borderBottomColor: `${colors.voca.grey}20`,
  },
  headingText: {
    color: colors.voca.black,
  },
  closeText: {
    color: colors.voca.primary,
  },
});
