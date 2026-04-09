import React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  isOnline: boolean;
};

export function DeviceStatusBadge({ isOnline }: Props) {
  return (
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
  );
}