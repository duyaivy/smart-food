import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { type IUser } from '@/models/interfaces/user';

type InfoSectionProps = {
  user?: IUser;
  isLoading?: boolean;
};

const InfoSection = ({ user, isLoading = true }: InfoSectionProps) => {
  const avatarUri = user?.avatar?.trim();

  return (
    <View className="mt-24 flex items-center">
      {isLoading ? (
        <>
          <Skeleton className="size-36 rounded-full bg-secondary" />
          <Skeleton className="mt-4 h-10 w-64 bg-secondary " />
          <Skeleton className="mt-3 h-2 w-64 bg-secondary " />
        </>
      ) : (
        <>
          <Avatar alt="avatar" className="size-36 shadow-md">
            {avatarUri ? (
              <AvatarImage
                source={{
                  uri: avatarUri,
                }}
                cachePolicy="memory-disk"
                contentFit="cover"
                alt="avatar"
              />
            ) : (
              <AvatarFallback>
                <Text className="text-2xl text-white">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'NF'}
                </Text>
              </AvatarFallback>
            )}
          </Avatar>
          <Text className="mt-4 text-lg font-semibold ">
            {user?.name ? user.name : 'Người dùng SmartFood'}
          </Text>
          <Text className="text-gray-500">
            {user?.age ? `${user.age} tuổi -` : ''}{' '}
            {user?.height ? `${user.height} cm -` : ''}{' '}
            {user?.weight ? `${user.weight} kg` : ''}
            {!user?.age &&
              !user?.height &&
              !user?.weight &&
              'Chưa có thông tin'}
          </Text>
        </>
      )}
    </View>
  );
};

export default InfoSection;
