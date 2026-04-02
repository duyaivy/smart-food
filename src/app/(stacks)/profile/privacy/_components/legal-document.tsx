import type { ListRenderItemInfo } from '@shopify/flash-list';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { FocusAwareStatusBar, List, SafeAreaView } from '@/components/ui';

import { flattenLegalDocument, type LegalRow } from './flatten-legal-document';
import { LEGAL_SECTIONS } from './legal-content';
import { LegalRowItem } from './legal-row-item';

const SAFE_AREA_EDGES = ['bottom'] as const;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});

export function LegalDocument(): React.JSX.Element {
  const rows = React.useMemo(() => flattenLegalDocument(LEGAL_SECTIONS), []);

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<LegalRow>) => <LegalRowItem row={item} />,
    []
  );

  const keyExtractor = React.useCallback((item: LegalRow) => item.key, []);
  const getItemType = React.useCallback((item: LegalRow) => item.type, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />
      <List
        data={rows}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        estimatedItemSize={120}
        contentContainerStyle={styles.contentContainer}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
