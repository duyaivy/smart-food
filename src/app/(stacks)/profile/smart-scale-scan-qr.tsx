import React from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { usePairDeviceMutation } from '@/lib/hooks/queries/iot.query';
import { parseQrPayload } from '@/lib/utils/parse-qr-payload';

const SAFE_AREA_EDGES = ['bottom'] as const;

export default function SmartScaleScanQrScreen(): React.JSX.Element {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanned, setIsScanned] = React.useState(false);

  const { mutateAsync: pairDevice, isPending: isPairing } =
    usePairDeviceMutation();

  const handleScan = async ({ data }: { data: string }) => {
    if (isScanned || isPairing) return;

    setIsScanned(true);

    const payload = parseQrPayload(data);

    if (!payload) {
      Alert.alert(
        'Mã QR không hợp lệ',
        'QR cần chứa JSON gồm deviceUid và apiKey.'
      );
      setIsScanned(false);
      return;
    }

    try {
      await pairDevice(payload);
      router.back();
    } catch {
      setIsScanned(false);
    }
  };

  if (!permission) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white px-6" edges={SAFE_AREA_EDGES}>
        <FocusAwareStatusBar />
        <Text className="text-center text-base text-neutral-600">
          Đang kiểm tra quyền camera...
        </Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 bg-white px-6" edges={SAFE_AREA_EDGES}>
        <FocusAwareStatusBar />
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-2xl font-semibold text-black">
            Cần quyền camera
          </Text>
          <Text className="mt-3 text-center text-base leading-6 text-neutral-500">
            Hãy cấp quyền camera để quét mã QR của cân thông minh.
          </Text>

          <View className="mt-6 w-full">
            <Button
              label="Cho phép truy cập camera"
              className="bg-primary"
              onPress={requestPermission}
            />
          </View>

          <View className="mt-3 w-full">
            <Button
              label="Nhập thủ công"
              variant="outline"
              className="border-orange-200"
              textClassName="text-primary text-lg"
              onPress={() => router.replace(ROUTE.STACK.PROFILE.SMART_SCALE)}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />

      <View className="flex-1">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={handleScan}
        />

        <View className="absolute inset-x-0 bottom-0 bg-black/65 px-6 py-8">
          <Text className="text-center text-xl font-semibold text-white">
            Đưa mã QR vào khung hình
          </Text>
          <Text className="mt-2 text-center text-base leading-6 text-neutral-200">
            QR cần chứa deviceUid và apiKey của thiết bị.
          </Text>

          <View className="mt-5">
            <Button
              label={isScanned || isPairing ? 'Đang xử lý...' : 'Quét lại'}
              variant="outline"
              className="border-white"
              textClassName="text-white text-lg"
              disabled={isPairing}
              onPress={() => setIsScanned(false)}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}