import React from 'react';
import { Scale } from 'lucide-react-native';
import { router } from 'expo-router';

import { Button, Input, Text, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';

type Props = {
  pairMethod: 'qr' | 'manual';
  deviceUidInput: string;
  apiKeyInput: string;
  isPairing: boolean;
  onChangePairMethod: React.Dispatch<React.SetStateAction<'qr' | 'manual'>>;
  onChangeDeviceUid: (value: string) => void;
  onChangeApiKey: (value: string) => void;
  onPair: () => Promise<void>;
};

export function EmptyDeviceState({
  pairMethod,
  deviceUidInput,
  apiKeyInput,
  isPairing,
  onChangePairMethod,
  onChangeDeviceUid,
  onChangeApiKey,
  onPair,
}: Props) {
  const handleOpenQrScanner = () => {
    router.push(ROUTE.STACK.PROFILE.SMART_SCALE_SCAN_QR);
  };

  return (
    <View className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-10">
      <View className="items-center">
        <View className="mb-4 size-20 items-center justify-center rounded-full bg-primary/10">
          <Scale size={32} color="#f97316" />
        </View>

        <Text className="text-center text-2xl font-semibold text-black">
          Chưa kết nối cân thông minh
        </Text>

        <Text className="mt-3 text-center text-base leading-6 text-neutral-500">
          Bạn có thể quét mã QR để kết nối nhanh hoặc nhập thủ công thông tin
          thiết bị để ghép nối với ứng dụng.
        </Text>
      </View>

      <View className="mt-6 gap-3">
        <Button
          label="Quét mã QR"
          className="bg-primary"
          onPress={handleOpenQrScanner}
        />

        <Button
          label="Nhập thủ công"
          variant="outline"
          className="border-orange-200"
          textClassName="text-primary text-lg"
          onPress={() =>
            onChangePairMethod((prev) => (prev === 'manual' ? 'qr' : 'manual'))
          }
        />
      </View>

      {pairMethod === 'manual' && (
        <View className="mt-6 gap-3">
          <View>
            <Text className="mb-1 text-black">Device UID</Text>
            <Input
              value={deviceUidInput}
              onChangeText={onChangeDeviceUid}
              placeholder="Ví dụ: esp32_kitchen_01"
              autoCapitalize="none"
            />
          </View>

          <View>
            <Text className="mb-1 text-black">API Key</Text>
            <Input
              value={apiKeyInput}
              onChangeText={onChangeApiKey}
              placeholder="Nhập mã xác thực thiết bị"
              autoCapitalize="none"
            />
          </View>

          <Button
            label="Liên kết thiết bị"
            className="bg-primary"
            loading={isPairing}
            disabled={isPairing}
            onPress={onPair}
          />
        </View>
      )}

      {pairMethod === 'qr' && (
        <Text className="mt-4 text-center text-sm text-neutral-400">
          Hãy dùng camera để quét mã QR chứa deviceUid và apiKey của thiết bị.
        </Text>
      )}
    </View>
  );
}