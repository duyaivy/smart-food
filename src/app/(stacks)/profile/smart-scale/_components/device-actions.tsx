import React from 'react';

import { Button, Text, View } from '@/components/ui';

type Props = {
  isUnpairing: boolean;
  onUnpair: () => void;
};

export function DeviceActions({ isUnpairing, onUnpair }: Props) {
  return (
    <View className="gap-3">
      <Text className="text-center text-sm text-neutral-400">
        Kéo xuống để làm mới trạng thái thiết bị.
      </Text>

      <Button
        label="Ngắt liên kết"
        variant="outline"
        className="border-red-300"
        textClassName="text-red-600 text-lg"
        loading={isUnpairing}
        disabled={isUnpairing}
        onPress={onUnpair}
      />
    </View>
  );
}