import type { ListRenderItemInfo } from '@shopify/flash-list';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { FocusAwareStatusBar, List, SafeAreaView } from '@/components/ui';

import { ABOUT_SECTIONS } from './about-content';
import { AboutRowItem } from './about-row-item';
import { type AboutRow, flattenAboutDocument } from './flatten-about-document';

const SAFE_AREA_EDGES = ['bottom'] as const;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});

export function AboutDocument(): React.JSX.Element {
  const rows = React.useMemo(() => flattenAboutDocument(ABOUT_SECTIONS), []);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<AboutRow>) => <AboutRowItem row={item} />,
    []
  );

  const keyExtractor = React.useCallback((item: AboutRow) => item.key, []);
  const getItemType = React.useCallback((item: AboutRow) => item.type, []);

  return (
    <SafeAreaView className="flex-1" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />
      <List
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={110}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
