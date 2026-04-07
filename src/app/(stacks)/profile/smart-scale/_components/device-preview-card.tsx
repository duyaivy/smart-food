import React from 'react';

import { Image, View } from '@/components/ui';

const SMART_SCALE_IMAGE = require('../../../../../../assets/images/smart-scale.png');

export function DevicePreviewCard() {
  return (
    <View className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-8">
      <View className="items-center">
        <Image
          source={SMART_SCALE_IMAGE}
          className="h-56 w-full"
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </View>
    </View>
  );
}