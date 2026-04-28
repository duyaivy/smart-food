import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Image, Pressable, Modal, findNodeHandle } from 'react-native';

import { Text, View } from '@/components/ui';
import { getCategoryConfig } from '@/constants/common';
import { formatUnitLabel } from '@/lib/utils/unit';
import type { EnrichedFridgeItem } from '@/lib/hooks/use-fridge';
import { FridgeItemPriority } from '@/models/types/fridge';

const priorityIconMap: Record<
  FridgeItemPriority,
  keyof typeof Ionicons.glyphMap
> = {
  [FridgeItemPriority.LOW]: 'chevron-down-outline',
  [FridgeItemPriority.MEDIUM]: 'remove-outline',
  [FridgeItemPriority.HIGH]: 'chevron-up-outline',
  [FridgeItemPriority.VERY_HIGH]: 'chevron-up-circle-outline',
};

const priorityColorMap: Record<FridgeItemPriority, string> = {
  [FridgeItemPriority.LOW]: '#1E9BFF',
  [FridgeItemPriority.MEDIUM]: '#FFCC00',
  [FridgeItemPriority.HIGH]: '#FF4D4D',
  [FridgeItemPriority.VERY_HIGH]: '#C1121F',
};

type FridgeItemCardProps = {
  item: EnrichedFridgeItem;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function FridgeItemCard({
  item,
  onDelete,
  onEdit,
  onPress,
}: FridgeItemCardProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const ellipsisRef = useRef<any>(null);

  const ingredient = item.ingredient;
  const isEmpty = item.quantity <= 0;
  const imageUrl = ingredient?.images?.[0];

  const category = getCategoryConfig(item.ingredient?.categoryId);
  const unitLabel = formatUnitLabel(item.ingredient?.unit ?? '');

  return (
    <Pressable
      onPress={onPress}
      className={`relative min-h-[72px] flex-row items-center rounded-lg px-5 py-3 shadow-md border border-neutral-100 ${
        isEmpty ? 'bg-zinc-200' : 'bg-white'
      }`}
      style={{ elevation: 2, overflow: 'visible' }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="size-12 rounded-lg bg-zinc-300"
        />
      ) : (
        <View className="size-12 rounded-lg bg-zinc-300" />
      )}

      <View className="ml-5 flex-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-extrabold text-zinc-950">
            {ingredient?.name ?? `Nguyên liệu #${item.ingredientId}`}
          </Text>

          <Ionicons
            name={priorityIconMap[item.priority]}
            size={18}
            color={priorityColorMap[item.priority]}
          />
        </View>

          <Text className="mt-1 text-sm text-zinc-950">{category.label}</Text>
      </View>

      <View className="items-end justify-between self-stretch">
        <Pressable
          ref={ellipsisRef}
          hitSlop={12}
          onPress={async (event) => {
            event.stopPropagation();
            try {
              const node = findNodeHandle(ellipsisRef.current);
              if (node && ellipsisRef.current?.measureInWindow) {
                ellipsisRef.current.measureInWindow(
                  (x: number, y: number, width: number, height: number) => {
                    setMenuPos({ x, y, width, height });
                    setMenuVisible((prev) => !prev);
                  }
                );
              } else {
                setMenuVisible((prev) => !prev);
              }
            } catch (err) {
              setMenuVisible((prev) => !prev);
            }
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#111111" />
        </Pressable>

        <Text
          className={`text-sm ${isEmpty ? 'text-red-500' : 'text-zinc-950'}`}
        >
          Còn lại: {item.quantity} {unitLabel}
        </Text>
      </View>

      <Modal transparent visible={menuVisible} animationType="none">
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setMenuVisible(false)}
          accessibilityLabel="close menu"
        >
          <Pressable style={{ position: 'absolute', left: 0, top: 0 }}>
            <View
              style={{
                position: 'absolute',
                left: Math.max(menuPos.x - 120, 8),
                top: menuPos.y + menuPos.height + 6,
                width: 140,
                borderWidth: 1,
                borderColor: '#D1D5DB',
                backgroundColor: '#FFFFFF',
                zIndex: 99999,
                elevation: 99999,
                overflow: 'visible',
                borderRadius: 8,
              }}
            >
              <Pressable
                style={{ height: 40, justifyContent: 'center', paddingHorizontal: 12 }}
                onPress={() => {
                  setMenuVisible(false);
                  onEdit();
                }}
              >
                <Text className="text-xs text-zinc-950">Sửa</Text>
              </Pressable>

              <View style={{ height: 1, backgroundColor: '#D1D5DB' }} />

              <Pressable
                style={{ height: 40, justifyContent: 'center', paddingHorizontal: 12 }}
                onPress={() => {
                  setMenuVisible(false);
                  onDelete();
                }}
              >
                <Text className="text-xs text-zinc-950">Xóa</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Pressable>
  );
}
