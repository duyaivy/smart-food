import * as React from 'react';

import { Text, View } from '@/components/ui';

import type { LegalRow } from './flatten-legal-document';

type Props = {
  row: LegalRow;
};

function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const LegalRowItem = React.memo(function LegalRowItem({
  row,
}: Props): React.JSX.Element {
  if (row.type === 'section') {
    return (
      <View className={cx(!row.isFirstSection && 'mt-8', 'mb-4 gap-4')}>
        <View>
          <Text className="text-lg font-bold">
            {row.sectionId}. {row.title.toUpperCase()}
          </Text>
          <View className="mt-2 gap-1 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
            <Text className="text-sm text-neutral-600 dark:text-neutral-300">
              Ngày hiệu lực: {row.meta.effectiveDate}
            </Text>
            <Text className="text-sm text-neutral-600 dark:text-neutral-300">
              Đơn vị vận hành: {row.meta.operator}
            </Text>
            <Text className="text-sm text-neutral-600 dark:text-neutral-300">
              {row.meta.contactLabel}: {row.meta.contact}
            </Text>
          </View>
        </View>
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
