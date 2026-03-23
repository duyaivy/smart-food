import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';

import { LegalBlocks } from '../../privacy/_components/legal-blocks';
import { type AboutDocumentSection } from './about-content';
type Props = {
  section: AboutDocumentSection;
};

export function AboutSection({ section }: Props): React.JSX.Element {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-lg font-bold">
          {section.id}. {section.title.toUpperCase()}
        </Text>
      </View>

      <View className="gap-5">
        {section.subsections.map((sub) => (
          <View key={sub.id} className="gap-2">
            <Text className="text-base font-semibold">
              {sub.id}. {sub.title}
            </Text>
            <LegalBlocks blocks={sub.blocks} />
          </View>
        ))}
      </View>
    </View>
  );
}
