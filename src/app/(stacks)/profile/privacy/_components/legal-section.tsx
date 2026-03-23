import { Text, View } from '@/components/ui';

import { LegalBlocks } from './legal-blocks';
import type { LegalDocumentSection } from './legal-content';

type Props = {
  section: LegalDocumentSection;
};

function SectionMeta({ section }: Props): React.JSX.Element {
  const contactLabel = section.meta.contactLabel ?? 'Liên hệ';

  return (
    <View className="mt-2 gap-1 rounded-xl bg-neutral-100 p-3 dark:bg-neutral-900">
      <Text className="text-sm text-neutral-600 dark:text-neutral-300">
        Ngày hiệu lực: {section.meta.effectiveDate}
      </Text>
      <Text className="text-sm text-neutral-600 dark:text-neutral-300">
        Đơn vị vận hành: {section.meta.operator}
      </Text>
      <Text className="text-sm text-neutral-600 dark:text-neutral-300">
        {contactLabel}: {section.meta.contact}
      </Text>
    </View>
  );
}

export function LegalSection({ section }: Props): React.JSX.Element {
  return (
    <View className="gap-4">
      <View>
        <Text className="text-lg font-bold">
          {section.id}. {section.title.toUpperCase()}
        </Text>
        <SectionMeta section={section} />
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
