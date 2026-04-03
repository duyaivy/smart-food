import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/components/ui/icon';

type IngredientItem = {
  id: number;
  name: string;
  quantity: string;
};

type Props = {
  title: string;
  items: IngredientItem[];
  expanded: boolean;
  onToggle: () => void;
  tone: 'secondary' | 'danger';
};

export function IngredientSection({
  title,
  items,
  expanded,
  onToggle,
  tone,
}: Props) {
  const wrapperClassName =
    tone === 'secondary'
      ? 'border-secondary-300 bg-secondary-50'
      : 'border-danger-300 bg-danger-50';

  return (
    <View className={`rounded-2xl border p-3 ${wrapperClassName}`}>
      <Pressable
        onPress={onToggle}
        className="flex-row items-center justify-between"
      >
        <Text className="text-base font-semibold text-foreground">{title}</Text>
        <Icon
          as={expanded ? ChevronUp : ChevronDown}
          size={18}
          className="text-neutral-500"
        />
      </Pressable>

      {expanded ? (
        <View className="mt-3 gap-2">
          {items.map((item) => (
            <View
              key={item.id}
              className="flex-row items-center justify-between rounded-xl bg-white px-3 py-2"
            >
              <Text className="mr-2 flex-1 text-body-m font-medium text-neutral-700">
                {item.name}
              </Text>
              <Text className="text-body-m font-semibold text-foreground">
                {item.quantity}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
