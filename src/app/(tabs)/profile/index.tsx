import { avatar } from '@assets/images';
import type { LinkProps } from 'expo-router';
import {
  Handshake,
  Info,
  LockKeyhole,
  LogOut,
  type LucideIcon,
  Settings,
  User2,
} from 'lucide-react-native';
import React from 'react';

import { FocusAwareStatusBar, Text, View } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ListItemIcon from '@/components/ui/list-item-icon';
import useAuthStore from '@/lib/stores/use-auth-store';

const USER_LIST_ITEM = [
  {
    Icon: User2,
    text: 'Chỉnh sửa thông tin',
    isChevron: true,
    href: '/(stacks)/profile/edit',
    color: '#111',
  },
  {
    Icon: Settings,
    text: 'Cài đặt',
    isChevron: true,
    href: '/(stacks)/profile/settings',
  },
  {
    Icon: LockKeyhole,
    text: 'Quên mật khẩu',
    isChevron: false,
  },
] satisfies {
  Icon: LucideIcon;
  text: string;
  isChevron: boolean;
  color?: string;
  href?: LinkProps['href'];
}[];

const OTHER_LIST_ITEM = [
  {
    Icon: Info,
    text: 'Về chúng tôi',
    isChevron: false,
  },
  {
    Icon: Handshake,
    text: 'Điều khoản và chính sách',
    isChevron: false,
    href: '/(stacks)/profile/privacy',
  },
  {
    Icon: LogOut,
    text: 'Đăng xuất',
    isChevron: false,
    color: '#FF3B30',
  },
] satisfies {
  Icon: LucideIcon;
  text: string;
  isChevron: boolean;
  color?: string;
  href?: LinkProps['href'];
}[];

export default function ProfileScreen() {
  const { name } = useAuthStore();

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
        <Text className="mt-4 text-lg font-semibold ">{name} Duyaivy</Text>
        <Text className="text-gray-500">21 tuổi - 160 cm - 55kg</Text>
      </View>

      <View className="flex w-full flex-col">
        <Text className="mt-6 text-lg font-semibold">Tài khoản</Text>
        <View>
          {USER_LIST_ITEM.map(
            ({ Icon, text, isChevron, href, color }, index) => (
              <ListItemIcon
                key={index}
                Icon={Icon}
                text={text}
                href={href}
                color={color}
                isChevron={isChevron}
              />
            )
          )}
        </View>
      </View>
      <View className="flex w-full flex-col">
        <Text className="mt-6 text-lg font-semibold">Khác</Text>

        {OTHER_LIST_ITEM.map(({ Icon, text, isChevron, color, href }, index) => (
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
  );
}
