import * as React from 'react';

import { Text, View } from '@/components/ui';

import type { AboutRow } from './flatten-about-document';

type Props = {
  row: AboutRow;
};

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const AboutRowItem = React.memo(function AboutRowItem({
  row,
}: Props): React.JSX.Element {
  if (row.type === 'section') {
    return (
      <View className={cx(!row.isFirstSection && 'mt-8', 'mb-4 gap-4')}>
        <Text className="text-lg font-bold">
          {row.sectionId}. {row.title.toUpperCase()}
        </Text>
      </View>
    );
  }

  if (row.type === 'subsection-title') {
    return (
      <Text
        className={cx(
          !row.isFirstSubsectionInSection && 'mt-5',
          'mb-2 text-base font-semibold'
        )}
      >
        {row.subsectionId}. {row.title}
      </Text>
    );
  }

  if (row.type === 'paragraph') {
    return (
      <Text
        className={cx(
          !row.isFirstBlockInSubsection && 'mt-3',
          'leading-6 text-neutral-700 dark:text-neutral-200'
        )}
      >
        {row.text}
      </Text>
    );
  }

  return (
    <View
      className={cx(
        !row.isFirstBlockInSubsection && row.isFirstItemInBulletBlock && 'mt-3',
        !row.isFirstItemInBulletBlock && 'mt-2',
        'flex-row gap-2'
      )}
    >
      <Text className="leading-6 text-neutral-500 dark:text-neutral-400">
        {'\u2022'}
      </Text>
      <Text className="flex-1 leading-6 text-neutral-700 dark:text-neutral-200">
        {row.text}
      </Text>
    </View>
  );
});
