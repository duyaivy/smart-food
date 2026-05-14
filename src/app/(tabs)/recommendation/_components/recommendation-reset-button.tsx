import { Undo2 } from 'lucide-react-native';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import colors from '@/constants/colors';
import { ICON_SIZE_MEDIUM } from '@/constants/common';

type Props = {
  onPress: () => void;
};

export const RecommendationResetButton = ({ onPress }: Props) => (
  <Button variant="default" onPress={onPress} className="bg-secondary-600">
    <Undo2 className="mr-2" size={ICON_SIZE_MEDIUM} color={colors.voca.white} />
    <Text className="text-lg font-bold text-white">Lên lại thực đơn</Text>
  </Button>
);
