import * as React from 'react';

import { Text, View } from '@/components/ui';

import type { LegalBlock } from './legal-content';

type BulletListProps = {
  items: string[];
};

function BulletList({ items }: BulletListProps): React.JSX.Element {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-2">
          <Text className="leading-6 text-neutral-500 dark:text-neutral-400">
            {'\u2022'}
          </Text>
          <Text className="flex-1 leading-6 text-neutral-700 dark:text-neutral-200">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

type LegalBlocksProps = {
  blocks: LegalBlock[];
};

export function LegalBlocks({ blocks }: LegalBlocksProps): React.JSX.Element {
  return (
    <View className="gap-3">
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <Text
              key={`${block.type}-${index}`}
              className="leading-6 text-neutral-700 dark:text-neutral-200"
            >
              {block.text}
            </Text>
          );
        }

        return (
          <BulletList key={`${block.type}-${index}`} items={block.items} />
        );
      })}
    </View>
  );
}
