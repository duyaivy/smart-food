import { View } from 'react-native';

import { Text } from '@/components/ui';
import ListItemIcon from '@/components/ui/list-item-icon';
import { OTHER_LIST_ITEM, USER_LIST_ITEM } from '@/constants/navbar';

const UtilSection = () => {
  return (
    <>
      <View className="flex w-full flex-col">
        <Text className="text mt-6 text-lg font-semibold text-black">
          Tài khoản
        </Text>
        <View>
          {USER_LIST_ITEM.map(
            ({ Icon, text, isChevron, href, color, onPress }, index) => (
              <ListItemIcon
                key={index}
                Icon={Icon}
                text={text}
                href={href}
                color={color}
                isChevron={isChevron}
                onPress={onPress}
              />
            )
          )}
        </View>
      </View>
      <View className="flex w-full flex-col">
        <Text className="mt-6 text-lg font-semibold text-black">Khác</Text>

        {OTHER_LIST_ITEM.map(
          ({ Icon, text, isChevron, color, href, onPress }, index) => (
            <ListItemIcon
              key={index}
              Icon={Icon}
              text={text}
              href={href}
              color={color}
              isChevron={isChevron}
              onPress={onPress}
            />
          )
        )}
      </View>
    </>
  );
};

export default UtilSection;
