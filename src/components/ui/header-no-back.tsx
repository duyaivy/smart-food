import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

interface HeaderNoBackProps {
  title: string;
}

export const HeaderNoBack = ({ title }: HeaderNoBackProps) => {
  return (
    <View className="flex-row items-center justify-center px-4 py-2">
      <Text className="text-xl font-bold text-neutral-900">{title}</Text>
    </View>
  );
};
