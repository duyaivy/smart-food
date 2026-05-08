import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';

interface GoalCardProps {
  goal: {
    label: string;
    icon: React.ReactNode;
    color: string;
  };
  isActive: boolean;
  onPress: () => void;
}

export const GoalCard = ({ goal, isActive, onPress }: GoalCardProps) => {
  const { label, icon, color } = goal;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: '48.5%',
        borderColor: isActive ? color : 'transparent',
        borderWidth: 2,
        backgroundColor: isActive ? `${color}10` : colors.voca.greyLight,
      }}
      className="items-center justify-center rounded-2xl py-5"
    >
      <View className="flex-row items-center gap-2">
        {icon}
        <Text
          style={{ color: isActive ? color : colors.voca.grey }}
          className="text-base font-bold"
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};
