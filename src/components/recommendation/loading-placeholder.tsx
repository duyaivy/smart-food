import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import React from 'react';
import { View } from 'react-native';
import TypeWriterEffect from 'react-native-typewriter-effect';

import { colors, Image } from '../ui';

const AVOCADO_LOADING = require('@assets/images/voca_loading.png');

function SkeletonMealCard() {
  return (
    <View className="mb-3 overflow-hidden rounded-2xl bg-white p-4">
      <View className="flex-row items-center gap-3">
        <Skeleton colorMode="light" width={48} height={48} radius={12} />
        <View className="flex-1 gap-2">
          <Skeleton colorMode="light" width="70%" height={14} radius={6} />
          <Skeleton colorMode="light" width="45%" height={12} radius={6} />
        </View>
        <Skeleton colorMode="light" width={40} height={20} radius={6} />
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LoadingPlaceholder() {
  return (
    <View className="flex-1 px-4 pt-6">
      {/* Mascot + speech bubble */}
      <View className="mb-6 flex-row items-end justify-end">
        {/* Pulsing avocado mascot */}
        <View className="flex-row items-start px-6 py-4">
          <Image
            source={AVOCADO_LOADING}
            style={{ width: 100, height: 120 }}
            resizeMode="contain"
          />
          <View
            className="ml-2 flex-1 rounded-2xl px-4 py-3 shadow-sm"
            style={{ backgroundColor: colors.voca.greenLight }}
          >
            <TypeWriterEffect
              content="Chúng tôi đang tính toán để gợi ý thực đơn phù hợp nhất cho bạn, vui lòng đợi trong giây lát..."
              minDelay={10}
              maxDelay={20}
            />
          </View>
        </View>
      </View>
      {/* Thinking dots */}
      <View className="mb-6 flex-row items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <MotiView
            key={i}
            from={{ opacity: 0.3, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            transition={{
              type: 'timing',
              duration: 600,
              loop: true,
              repeatReverse: true,
              delay: i * 200,
            }}
            className="size-2 rounded-full bg-green-500"
          />
        ))}
      </View>

      {/* Skeleton cards */}
      <View className="rounded-2xl bg-green-50/50 p-4">
        <Skeleton colorMode="light" width="40%" height={16} radius={8} />
        <View className="mt-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonMealCard key={i} />
          ))}
        </View>
      </View>
    </View>
  );
}
