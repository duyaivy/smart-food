import { type LinkProps, router } from 'expo-router';
import { ChevronRight, type LucideIcon } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { ICON_SIZE_LARGE } from '@/constants/common';

import { Text } from './text';

type Props = {
  Icon: LucideIcon;
  text: string;
  isChevron?: boolean;
  color?: string;
  href?: LinkProps['href'];
  onPress?: () => void;
};

const ListItemIcon = ({
  Icon,
  text,
  isChevron = false,
  color = '#222222',
  href,
  onPress,
}: Props) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    if (href) {
      router.push(href);
    }
  };

  const content = (
    <TouchableOpacity
      activeOpacity={href ? 0.7 : 1}
      disabled={!href && !onPress}
      onPress={handlePress}
      className="mt-3.5 flex w-full flex-row justify-between gap-2"
    >
      <View className="flex flex-row gap-2">
        <Icon size={ICON_SIZE_LARGE} color={color} />
        <Text className="text-body-l font-medium" style={{ color }}>
          {text}
        </Text>
      </View>
      {isChevron && <ChevronRight size={ICON_SIZE_LARGE} color={color} />}
    </TouchableOpacity>
  );

  return content;
};

export default ListItemIcon;
