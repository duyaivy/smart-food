import { router } from 'expo-router';
import { Clock, Heart, Utensils } from 'lucide-react-native';
import { memo, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Image, Text } from '@/components/ui';
import { Toggle, ToggleIcon } from '@/components/ui/toggle';
import { ICON_SIZE_SMALL } from '@/constants/common';
import { ROUTE } from '@/constants/route';
import { type MiniDish } from '@/models/interfaces/dish';
import { DificultyValue } from '@/models/types/dish';

type Props = {
  miniDish: MiniDish;
};

const DishItem = ({ miniDish }: Props) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const handlePress = () => {
    router.push({
      pathname: ROUTE.STACK.DISCOVER.DISH_DETAIL,
      params: { id: miniDish.id.toString() },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="mx-1 mb-3 flex-1 rounded-lg border border-secondary-300 bg-white p-2"
    >
      <View className="relative h-36 w-full overflow-hidden rounded-md">
        <Image
          source={{ uri: miniDish.images[0] }}
          className="size-full"
          cachePolicy={'memory-disk'}
        />
        <View className="absolute right-2 top-2 rounded-full bg-gray-100/80 px-2 py-1 blur-md">
          <Text className="text-xs font-medium text-secondary-700">
            {miniDish.calories} kcal
          </Text>
        </View>
      </View>
      <View className="mt-2 min-h-12 flex-row items-start justify-between gap-1">
        <Text
          className="flex-1 text-base font-semibold leading-5"
          numberOfLines={2}
        >
          {miniDish.name}
        </Text>
        <Toggle
          pressed={isFavorite}
          onPressedChange={setIsFavorite}
          size="sm"
          className="rounded-full border border-neutral-200 bg-white"
        >
          <ToggleIcon
            as={Heart}
            className={
              isFavorite
                ? 'size-4 fill-red-500 text-red-500'
                : 'size-4 text-neutral-500'
            }
          />
        </Toggle>
      </View>

      <View className="mt-1 flex-row items-center gap-2">
        <View className="flex-row items-center gap-1 rounded-full bg-secondary-100 px-2 py-1">
          <Clock size={ICON_SIZE_SMALL} className="text-secondary" />
          <Text className="text-xs font-medium text-secondary-700">
            {miniDish.cookTimeMin}phút
          </Text>
        </View>
        <View className="flex-row items-center gap-1 rounded-full bg-primary-100 px-2 py-1">
          <Utensils size={ICON_SIZE_SMALL} className="text-primary" />
          <Text className="text-xs font-medium text-primary-700">
            {DificultyValue[miniDish.difficulty]}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(DishItem);
