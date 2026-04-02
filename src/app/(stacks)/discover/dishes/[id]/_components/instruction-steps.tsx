import React from 'react';

import { Text, View } from '@/components/ui';
import { type Instruction } from '@/models/interfaces/dish';

type Props = {
  instructions: Instruction[];
};

export function InstructionSteps({ instructions }: Props) {
  return (
    <View className="gap-4">
      {instructions.map((step, index) => (
        <View key={`${step.title}-${index}`}>
          <View className="mb-2 flex-row items-center gap-2">
            <View className="size-8 items-center justify-center rounded-full bg-secondary-600">
              <Text className="text-body-s font-semibold text-white">
                {index + 1}
              </Text>
            </View>

            <Text className="text-body-m font-semibold text-foreground">
              {step.title || `Bước ${index + 1}`}
            </Text>
          </View>
          <Text className="text-justify text-body-m leading-6 text-neutral-700">
            {step.content}
          </Text>
        </View>
      ))}
    </View>
  );
}
