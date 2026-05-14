import React from 'react';
import { Image, View } from 'react-native';
import TypeWriterEffect from 'react-native-typewriter-effect';

import colors from '@/constants/colors';

const AVOCADO_DONE = require('@assets/images/voca_done.png');

type Props = {
  planLength: number;
};

export const RecommendationIntro = ({ planLength }: Props) => (
  <View className="flex-row items-start px-6 py-4">
    <View
      className="mr-2 flex-1 rounded-2xl px-4 py-3 shadow-sm"
      style={{ backgroundColor: colors.voca.greenLight }}
    >
      <TypeWriterEffect
        content={`Thực đơn ${planLength} ngày đã sẵn sàng. Chọn một ngày trong tuần để xem gợi ý.`}
        minDelay={10}
        maxDelay={20}
      />
    </View>
    <Image
      source={AVOCADO_DONE}
      style={{ width: 100, height: 120 }}
      resizeMode="contain"
    />
  </View>
);
