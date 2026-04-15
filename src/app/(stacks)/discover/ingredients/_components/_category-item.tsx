import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import { Text } from '@/components/ui';
import { getCategoryConfig, ICON_SIZE_SMALL } from '@/constants/common';
import { type ICategory } from '@/models/interfaces/ingredient';

type Props = {
  category: ICategory;
  onPress: () => void;
  isSelected?: boolean;
};

const CategoryItem = ({ category, onPress, isSelected }: Props) => {
  const { iconName, color } = getCategoryConfig(category.id);
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1 rounded-full border border-neutral-200 ${
        isSelected ? 'bg-primary-100' : 'bg-neutral-100'
      } px-3 py-2`}
      style={{ flexShrink: 0, alignSelf: 'flex-start' }}
    >
      <MaterialIcons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={iconName as any}
        size={ICON_SIZE_SMALL}
        color={color}
      />
      <Text
        className="text-sm text-neutral-700"
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {category.name}
      </Text>
    </Pressable>
  );
};

export default CategoryItem;
