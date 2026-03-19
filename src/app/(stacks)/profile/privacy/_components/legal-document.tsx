import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

import { LEGAL_SECTIONS } from './legal-content';
import { LegalSection } from './legal-section';

export function LegalDocument(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1">
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 gap-8 p-4 pb-10">
          <View className="gap-2">
            <Text className="leading-6 text-neutral-600 dark:text-neutral-300">
              Vui lòng đọc kỹ trước khi sử dụng SmartFood.
            </Text>
          </View>

          {LEGAL_SECTIONS.map((section) => (
            <LegalSection key={section.id} section={section} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
