import React from 'react';
import { router } from 'expo-router';
import { Scale, Wifi, WifiOff } from 'lucide-react-native';

import { Pressable, Text, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { formatLastSeenAt } from '@/lib/utils/date-time';

type Props = {
  deviceUid: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
};

export function DeviceLiveCard({ deviceUid, isOnline, lastSeenAt }: Props) {
  return (
    <View className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Scale size={20} color="#f97316" />
          <Text className="text-lg font-semibold text-black">Cân thông minh</Text>
        </View>

        <View
          className={`rounded-full px-3 py-1 ${
            isOnline ? 'bg-green-100' : 'bg-neutral-200'
          }`}
        >
          <Text
            className={`text-sm font-medium ${
              isOnline ? 'text-green-700' : 'text-neutral-600'
            }`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>

      <Text className="mt-2 text-sm text-neutral-500">{deviceUid}</Text>

      <View className="mt-4 flex-row items-center gap-2">
        {isOnline ? (
          <Wifi size={18} color="#f97316" />
        ) : (
          <WifiOff size={18} color="#9ca3af" />
        )}
        <Text className="text-sm text-neutral-600">
          Cập nhật lần cuối: {formatLastSeenAt(lastSeenAt)}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push(ROUTE.STACK.PROFILE.SMART_SCALE)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
        className="mt-4 self-start rounded-xl border border-orange-200 px-4 py-3"
      >
        <Text className="font-medium text-primary">Quản lý thiết bị</Text>
      </Pressable>
    </View>
  );
}