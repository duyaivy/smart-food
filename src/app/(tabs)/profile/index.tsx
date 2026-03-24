import { avatar } from '@assets/images';
import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ListItemIcon from '@/components/ui/list-item-icon';
import { OTHER_LIST_ITEM, USER_LIST_ITEM } from '@/constants/navbar';
import { useAuth } from '@/lib/auth';
import { useLogoutMutation } from '@/lib/hooks/queries/auth.query';

export default function ProfileScreen() {
  const user = useAuth.use.user();
  const token = useAuth.use.token();
  const name = user?.name ?? '';

  const logoutMutation = useLogoutMutation();

  const handleLogout = () => {
    
    const refreshToken = token?.refresh;

    if (!refreshToken) {
      useAuth.getState().signOut();
      return;
    }

    logoutMutation.mutate({ refreshToken });
  };

  return (
    <View className="flex min-h-screen w-full flex-col items-center bg-white px-6">
      <FocusAwareStatusBar />
      <View className="mt-32 flex items-center">
        <View>
          <Avatar alt="avatar" className="size-36 shadow-md">
            <AvatarImage source={avatar} />
            <AvatarFallback>
              <Text>{name.charAt(0)}</Text>
            </AvatarFallback>
          </Avatar>
        </View>
        <Text className="mt-4 text-lg font-semibold">{name} Duyaivy</Text>
        <Text className="text-gray-500">21 tuổi - 160 cm - 55kg</Text>
      </View>

      <View className="flex w-full flex-col">
        <Text className="mt-6 text-lg font-semibold">Tài khoản</Text>
        <View>
          {USER_LIST_ITEM.map(({ Icon, text, isChevron, href, color }, index) => (
            <ListItemIcon
              key={index}
              Icon={Icon}
              text={text}
              href={href}
              color={color}
              isChevron={isChevron}
            />
          ))}
        </View>
      </View>

      <View className="flex w-full flex-col">
        <Text className="mt-6 text-lg font-semibold">Khác</Text>

        {OTHER_LIST_ITEM.map(({ Icon, text, isChevron, color, href }, index) => {
          const isLogout = text === 'Đăng xuất';

          return (
            <ListItemIcon
              key={index}
              Icon={Icon}
              text={text}
              href={isLogout ? undefined : href}
              color={color}
              isChevron={isChevron}
              onPress={isLogout ? handleLogout : undefined}
            />
          );
        })}
      </View>
    </View>
  );
}