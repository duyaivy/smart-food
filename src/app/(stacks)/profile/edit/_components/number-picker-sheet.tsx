import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal as NBottomSheetModal,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';

type Props = {
  modalRef: React.RefObject<BottomSheetModal | null>;
  title: string;
  unit?: string;
  values: number[];
  selectedValue: number;
  onSelect: (value: number) => void;
};

const styles = StyleSheet.create({
  sheetBackground: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#A3A3A3',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});

export function NumberPickerSheet({
  modalRef,
  title,
  unit,
  values,
  selectedValue,
  onSelect,
}: Props): React.JSX.Element {
  const snapPoints = React.useMemo(() => ['60%'], []);

  const renderBackdrop = React.useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const onPressValue = React.useCallback(
    (value: number) => {
      onSelect(value);
      modalRef.current?.dismiss();
    },
    [modalRef, onSelect]
  );

  const renderItem = React.useCallback(
    ({ item }: { item: number }) => {
      const isSelected = item === selectedValue;
      return (
        <Pressable
          onPress={() => onPressValue(item)}
          className={
            isSelected
              ? 'mb-2 rounded-2xl border border-neutral-300 bg-neutral-100 p-4 dark:border-neutral-700 dark:bg-neutral-800'
              : 'mb-2 rounded-2xl border border-transparent bg-neutral-50 p-4 dark:bg-neutral-900'
          }
        >
          <View className="flex-row items-center justify-between">
            <Text
              className={isSelected ? 'text-base font-semibold' : 'text-base'}
            >
              {item}
              {unit ? ` ${unit}` : ''}
            </Text>
            {isSelected ? (
              <Text className="text-sm text-neutral-500 dark:text-neutral-400">
                Đã chọn
              </Text>
            ) : null}
          </View>
        </Pressable>
      );
    },
    [onPressValue, selectedValue, unit]
  );

  return (
    <NBottomSheetModal
      ref={modalRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <View className="px-4 pb-2">
        <Text className="text-lg font-bold">{title}</Text>
        <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Chọn một giá trị để cập nhật
        </Text>
      </View>

      <BottomSheetFlatList
        data={values}
        keyExtractor={(item) => String(item)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </NBottomSheetModal>
  );
}
