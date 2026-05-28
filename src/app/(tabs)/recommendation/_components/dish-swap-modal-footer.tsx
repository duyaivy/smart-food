import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import colors from '@/constants/colors';

import { SwapUpdateErrorBanner } from './dish-swap-modal-feedback';

interface DishSwapModalFooterProps {
  isRetryMode: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  selectedCount: number;
  updateError?: unknown;
  onPress: () => void;
}

type ActionLabelState = Pick<
  DishSwapModalFooterProps,
  'isRetryMode' | 'isLoading' | 'isUpdating' | 'selectedCount'
>;

const getActionLabel = ({
  isRetryMode,
  isLoading,
  isUpdating,
  selectedCount,
}: ActionLabelState): string => {
  if (isRetryMode) return 'Thử lại';
  if (isUpdating) return 'Đang cập nhật...';
  if (isLoading) return 'Đang tải dữ liệu...';

  return `Xác nhận đổi món (${selectedCount})`;
};

export const DishSwapModalFooter = memo(
  ({
    isRetryMode,
    isLoading,
    isUpdating,
    selectedCount,
    updateError,
    onPress,
  }: DishSwapModalFooterProps) => {
    const isActive = isRetryMode || (selectedCount > 0 && !isLoading);
    const isDisabled =
      isLoading || isUpdating || (!isRetryMode && selectedCount === 0);
    const label = getActionLabel({
      isRetryMode,
      isLoading,
      isUpdating,
      selectedCount,
    });

    return (
      <>
        {updateError ? <SwapUpdateErrorBanner error={updateError} /> : null}

        <View className="border-t px-4 py-3" style={styles.footer}>
          <Pressable
            onPress={onPress}
            disabled={isDisabled}
            className="items-center rounded-xl py-4"
            style={[
              styles.actionButton,
              isActive ? styles.activeButton : styles.inactiveButton,
            ]}
          >
            <Text
              className="font-bold text-white"
              style={isActive ? styles.activeText : styles.inactiveText}
            >
              {label}
            </Text>
          </Pressable>
        </View>
      </>
    );
  }
);

DishSwapModalFooter.displayName = 'DishSwapModalFooter';

const styles = StyleSheet.create({
  footer: {
    borderTopColor: `${colors.voca.grey}20`,
  },
  actionButton: {
    backgroundColor: colors.voca.primary,
  },
  activeButton: {
    backgroundColor: colors.voca.primary,
  },
  inactiveButton: {
    backgroundColor: `${colors.voca.grey}40`,
  },
  activeText: {
    opacity: 1,
  },
  inactiveText: {
    opacity: 0.6,
  },
});
