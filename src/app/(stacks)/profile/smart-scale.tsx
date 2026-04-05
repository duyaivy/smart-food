import React from 'react';
import { Scale } from 'lucide-react-native';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';

const SAFE_AREA_EDGES = ['bottom'] as const;

export default function SmartScaleScreen(): React.JSX.Element {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="always"
      >
        <View className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-10">
          <View className="items-center">
            <View className="mb-4 size-20 items-center justify-center rounded-full bg-primary/10">
              <Scale size={32} color="#f97316" />
            </View>

            <Text className="text-center text-2xl font-semibold text-black">
              Chưa kết nối cân thông minh
            </Text>

            <Text className="mt-3 text-center text-base leading-6 text-neutral-500">
              Kết nối thiết bị để xem trạng thái cân và nhận dữ liệu nguyên liệu
              trực tiếp trên ứng dụng.
            </Text>
          </View>

          <View className="mt-6">
            <Button
              label="Kết nối thiết bị"
              className="bg-primary"
              onPress={() => {}}
            />
          </View>

          <Text className="mt-3 text-center text-sm text-neutral-400">
            Bước tiếp theo sẽ triển khai pair thủ công và quét QR.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}