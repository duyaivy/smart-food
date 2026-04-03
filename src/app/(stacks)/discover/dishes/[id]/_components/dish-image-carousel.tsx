import React, { useState } from 'react';
import { useWindowDimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

import { Image, View } from '@/components/ui';
import { cn } from '@/lib/common/utils';

type Props = {
  images: string[];
};

export function DishImageCarousel({ images }: Props) {
  const { width } = useWindowDimensions();
  const carouselWidth = width - 32;
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View className="relative">
      <Carousel
        loop={images.length > 1}
        width={carouselWidth}
        height={220}
        data={images}
        pagingEnabled
        snapEnabled
        autoPlay={true}
        autoPlayInterval={3000}
        onSnapToItem={setActiveIndex}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            contentFit="fill"
            transition={200}
            className=" size-full rounded-2xl bg-neutral-100"
          />
        )}
      />

      {images.length > 1 ? (
        <View className="absolute bottom-2 right-1/2 mt-3 translate-x-1/2 flex-row items-center justify-center gap-2">
          {images.map((_, index) => (
            <View
              key={`carousel-dot-${index}`}
              className={cn(
                'size-3 rounded-full',
                index === activeIndex ? 'bg-primary-700' : 'bg-white'
              )}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
