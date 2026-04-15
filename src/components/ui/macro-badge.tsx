import { View } from 'react-native';

import { Text } from './text';

type MacroBadgeProps = {
  label: string;
  value?: number;
  color: string;
};

export const MacroBadge = ({ label, value, color }: MacroBadgeProps) => (
  <View className={`flex-1  items-center rounded-lg px-0.5 py-1.5`}>
    <Text
      className={`text-xs font-medium uppercase tracking-wide text-neutral-500`}
    >
      {label}
    </Text>
    <Text className={`text-sm font-semibold ${color}`}>
      {value != null ? `${value}g` : '—'}
    </Text>
  </View>
);
