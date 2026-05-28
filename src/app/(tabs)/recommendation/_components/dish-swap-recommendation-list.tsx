import type { ListRenderItemInfo } from '@shopify/flash-list';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Image, List, Text } from '@/components/ui';
import colors from '@/constants/colors';
import { ICON_SIZE_MEDIUM } from '@/constants/common';
import { useDishDetail } from '@/lib/hooks/use-dish-detail';
import { type IIngredient } from '@/models/interfaces/ingredient';
import {
  type DishCandidate,
  type RecommendationMeal,
  type SubRecommendationGroup,
  type SwapItem,
} from '@/models/interfaces/recommendation';

import { MealItem } from './meal-item';

const ESTIMATED_SECTION_SIZE = 220;
const ACCORDION_ENTERING = FadeIn.duration(200);
const ACCORDION_EXITING = FadeOut.duration(200);

interface DishSwapRecommendationListProps {
  groups: SubRecommendationGroup[];
  expandedDishIds: Set<number>;
  selectedSwapsByDishId: Map<number, SwapItem>;
  ingredientsById?: Record<number, IIngredient>;
  onToggleExpanded: (dishId: number) => void;
  onSelectCandidate: (originalDishId: number, candidate: DishCandidate) => void;
}

export const DishSwapRecommendationList = memo(
  ({
    groups,
    expandedDishIds,
    selectedSwapsByDishId,
    ingredientsById,
    onToggleExpanded,
    onSelectCandidate,
  }: DishSwapRecommendationListProps) => {
    const renderItem = useCallback(
      ({ item }: ListRenderItemInfo<SubRecommendationGroup>) => {
        const selectedSwap = selectedSwapsByDishId.get(item.originalDishId);

        return (
          <DishAccordionSection
            originalDishId={item.originalDishId}
            recommendations={item.recommendations}
            ingredientsById={ingredientsById}
            isExpanded={expandedDishIds.has(item.originalDishId)}
            selectedDishId={selectedSwap?.dishId}
            selectedSwapName={selectedSwap?.name}
            onToggleExpanded={onToggleExpanded}
            onSelectCandidate={onSelectCandidate}
          />
        );
      },
      [
        expandedDishIds,
        ingredientsById,
        onSelectCandidate,
        onToggleExpanded,
        selectedSwapsByDishId,
      ]
    );

    const keyExtractor = useCallback(
      (item: SubRecommendationGroup) => String(item.originalDishId),
      []
    );

    const extraData = useMemo(
      () => ({
        expandedDishIds,
        selectedSwapsByDishId,
      }),
      [expandedDishIds, selectedSwapsByDishId]
    );

    return (
      <List
        data={groups}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        estimatedItemSize={ESTIMATED_SECTION_SIZE}
        extraData={extraData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={DishSwapEmptyState}
        removeClippedSubviews
      />
    );
  }
);

DishSwapRecommendationList.displayName = 'DishSwapRecommendationList';

const DishSwapEmptyState = memo(() => (
  <View className="flex-1 justify-center px-6" style={styles.emptyState}>
    <Text className="text-center text-sm" style={styles.mutedText}>
      Chưa có món thay thế phù hợp.
    </Text>
  </View>
));

DishSwapEmptyState.displayName = 'DishSwapEmptyState';

interface DishAccordionSectionProps {
  originalDishId: number;
  recommendations: DishCandidate[];
  ingredientsById?: Record<number, IIngredient>;
  isExpanded: boolean;
  selectedDishId?: number;
  selectedSwapName?: string;
  onToggleExpanded: (dishId: number) => void;
  onSelectCandidate: (originalDishId: number, candidate: DishCandidate) => void;
}

const DishAccordionSection = memo(
  ({
    originalDishId,
    recommendations,
    ingredientsById,
    isExpanded,
    selectedDishId,
    selectedSwapName,
    onToggleExpanded,
    onSelectCandidate,
  }: DishAccordionSectionProps) => {
    const { dish } = useDishDetail(originalDishId);

    const handleToggleExpanded = useCallback(() => {
      onToggleExpanded(originalDishId);
    }, [onToggleExpanded, originalDishId]);

    return (
      <View className="mb-4">
        <Pressable
          onPress={handleToggleExpanded}
          className="flex-row items-center justify-between rounded-xl border p-3"
          style={styles.accordionHeader}
        >
          <View className="flex-1 flex-row items-center gap-3">
            <View
              className="size-10 items-center justify-center rounded-lg"
              style={styles.dishImageFrame}
            >
              <Image source={dish?.images} className="size-full rounded-lg" />
            </View>

            <View className="flex-1">
              <Text className="font-semibold" style={styles.titleText}>
                {dish?.name ?? `Món ăn #${originalDishId}`}
              </Text>
              {selectedSwapName ? (
                <Text className="text-xs" style={styles.selectedText}>
                  Đã chọn: {selectedSwapName}
                </Text>
              ) : null}
            </View>
          </View>

          {isExpanded ? (
            <ChevronDown size={ICON_SIZE_MEDIUM} color={colors.voca.grey} />
          ) : (
            <ChevronRight size={ICON_SIZE_MEDIUM} color={colors.voca.grey} />
          )}
        </Pressable>

        {isExpanded ? (
          <Animated.View
            entering={ACCORDION_ENTERING}
            exiting={ACCORDION_EXITING}
            className="mt-2 gap-2 pl-4"
          >
            {recommendations.map((candidate) => (
              <DishSwapCandidateItem
                key={candidate.dishId}
                candidate={candidate}
                originalDishId={originalDishId}
                selectedDishId={selectedDishId}
                ingredientsById={ingredientsById}
                onSelectCandidate={onSelectCandidate}
              />
            ))}
          </Animated.View>
        ) : null}
      </View>
    );
  }
);

DishAccordionSection.displayName = 'DishAccordionSection';

interface DishSwapCandidateItemProps {
  candidate: DishCandidate;
  originalDishId: number;
  selectedDishId?: number;
  ingredientsById?: Record<number, IIngredient>;
  onSelectCandidate: (originalDishId: number, candidate: DishCandidate) => void;
}

const DishSwapCandidateItem = memo(
  ({
    candidate,
    originalDishId,
    selectedDishId,
    ingredientsById,
    onSelectCandidate,
  }: DishSwapCandidateItemProps) => {
    const candidateAsMeal = useMemo<RecommendationMeal>(
      () => ({
        dishId: candidate.dishId,
        role: candidate.role,
        missingIngredient: candidate.missingIngredient,
      }),
      [candidate.dishId, candidate.missingIngredient, candidate.role]
    );

    const handleSelect = useCallback(() => {
      onSelectCandidate(originalDishId, candidate);
    }, [candidate, onSelectCandidate, originalDishId]);

    return (
      <MealItem
        meal={candidateAsMeal}
        ingredientsById={ingredientsById}
        isSelected={selectedDishId === candidate.dishId}
        onSelect={handleSelect}
      />
    );
  }
);

DishSwapCandidateItem.displayName = 'DishSwapCandidateItem';

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  emptyState: {
    minHeight: 220,
  },
  accordionHeader: {
    borderColor: `${colors.voca.grey}30`,
    backgroundColor: `${colors.voca.grey}05`,
  },
  dishImageFrame: {
    backgroundColor: `${colors.voca.grey}20`,
  },
  titleText: {
    color: colors.voca.black,
  },
  selectedText: {
    color: colors.voca.primary,
  },
  mutedText: {
    color: colors.voca.grey,
  },
});
