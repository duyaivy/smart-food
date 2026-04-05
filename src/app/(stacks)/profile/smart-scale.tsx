import React from 'react';
import { Alert } from 'react-native';
import { Battery, Radio, Scale, ScanLine, Wifi, WifiOff } from 'lucide-react-native';

import {
  Button,
  FocusAwareStatusBar,
  Image,
  Input,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import {
  useGetDeviceStatusQuery,
  useGetMyDevicesQuery,
  usePairDeviceMutation,
  useUnpairDeviceMutation,
} from '@/lib/hooks/queries/iot.query';
import { useIotStore } from '@/lib/stores/use-iot-store';
import { router } from 'expo-router';
import { ROUTE } from '@/constants/route';

const SAFE_AREA_EDGES = ['bottom'] as const;
const MOCK_SCALE_IMAGE =
  'https://res.cloudinary.com/dr3wv6tee/image/upload/v1775380761/334732c9-8c64-453d-8483-9529bb009f63_dler5u.jpg';

function formatLastSeenAt(value?: string | null) {
  if (!value) return 'Chưa có dữ liệu';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

  return date.toLocaleString('vi-VN');
}

function DeviceStatusBadge({ isOnline }: { isOnline: boolean }) {
  return (
    <View
      className={`rounded-full px-3 py-1 ${
        isOnline ? 'bg-green-100' : 'bg-neutral-200'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isOnline ? 'text-green-700' : 'text-neutral-600'
        }`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </Text>
    </View>
  );
}

export default function SmartScaleScreen(): React.JSX.Element {
  const device = useIotStore((state) => state.device);

  const [deviceUidInput, setDeviceUidInput] = React.useState('');
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [pairMethod, setPairMethod] = React.useState<'qr' | 'manual'>('qr');

  useGetMyDevicesQuery();

  const {
    data: statusData,
    isFetching: isFetchingStatus,
    refetch: refetchStatus,
  } = useGetDeviceStatusQuery(device?.deviceUid);

  const { mutateAsync: pairDevice, isPending: isPairing } =
    usePairDeviceMutation();

  const { mutateAsync: unpairDevice, isPending: isUnpairing } =
    useUnpairDeviceMutation();

  const currentStatus = statusData?.data;

  const handlePair = async () => {
    const deviceUid = deviceUidInput.trim();
    const apiKey = apiKeyInput.trim();

    if (!deviceUid || !apiKey) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập deviceUid và apiKey.');
      return;
    }

    await pairDevice({
      deviceUid,
      apiKey,
    });

    setDeviceUidInput('');
    setApiKeyInput('');

    await refetchStatus();
  };

  const handleRefreshStatus = async () => {
    if (!device?.deviceUid) return;
    await refetchStatus();
  };

  const handleUnpair = () => {
    if (!device?.deviceUid) return;

    Alert.alert(
      'Ngắt liên kết thiết bị',
      'Bạn có chắc chắn muốn ngắt liên kết cân thông minh không?',
      [
        {
          text: 'Huỷ',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: async () => {
            await unpairDevice(device.deviceUid);
          },
        },
      ]
    );
  };

  const handleOpenQrScanner = () => {
    router.push(ROUTE.STACK.PROFILE.SMART_SCALE_SCAN_QR);
  };

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
        {!device ? (
          <View className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-10">
            <View className="items-center">

              <View className="mb-4 size-20 items-center justify-center rounded-full bg-primary/10">
                <Scale size={32} color="#f97316" />
              </View>

              <Text className="text-center text-2xl font-semibold text-black">
                Chưa kết nối cân thông minh
              </Text>

              <Text className="mt-3 text-center text-base leading-6 text-neutral-500">
                Bạn có thể quét mã QR để kết nối nhanh hoặc nhập thủ công thông
                tin thiết bị để ghép nối với ứng dụng.
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
                  setPairMethod((prev) => (prev === 'manual' ? 'qr' : 'manual'))
                }
              />
            </View>

            {pairMethod === 'manual' && (
              <View className="mt-6 gap-3">
                <View>
                  <Text className="mb-1 text-black">Device UID</Text>
                  <Input
                    value={deviceUidInput}
                    onChangeText={setDeviceUidInput}
                    placeholder="Ví dụ: esp32_kitchen_01"
                    autoCapitalize="none"
                  />
                </View>

                <View>
                  <Text className="mb-1 text-black">API Key</Text>
                  <Input
                    value={apiKeyInput}
                    onChangeText={setApiKeyInput}
                    placeholder="Nhập mã xác thực thiết bị"
                    autoCapitalize="none"
                  />
                </View>

                <Button
                  label="Liên kết thiết bị"
                  className="bg-primary"
                  loading={isPairing}
                  disabled={isPairing}
                  onPress={handlePair}
                />
              </View>
            )}

            {pairMethod === 'qr' && (
              <Text className="mt-4 text-center text-sm text-neutral-400">
                Hãy dùng camera để quét mã QR chứa deviceUid và apiKey của thiết
                bị.
              </Text>
            )}
          </View>
        ) : (
          <View className="gap-4">
            <View className="rounded-3xl border border-neutral-200 bg-neutral-50 px-6 py-8">
              <View className="items-center">
                <Image
                  source={{ uri: MOCK_SCALE_IMAGE }}
                  className="mb-5 h-44 w-full rounded-3xl"
                  contentFit="cover"
                  cachePolicy="memory-disk"
                />
              </View>
            </View>

            <View className="rounded-3xl border border-neutral-200 bg-white px-5 py-5">
              <Text className="text-lg font-semibold text-black">
                Thông tin thiết bị
              </Text>

              <View className="mt-4 gap-4">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    {currentStatus?.isOnline ? (
                      <Wifi size={18} color="#f97316" />
                    ) : (
                      <WifiOff size={18} color="#9ca3af" />
                    )}
                    <Text className="text-neutral-700">Trạng thái</Text>
                  </View>
                  <Text className="font-medium text-black">
                    {currentStatus?.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Battery size={18} color="#f97316" />
                    <Text className="text-neutral-700">Pin</Text>
                  </View>
                  <Text className="font-medium text-black">
                    {currentStatus?.batteryLevel ?? '--'}%
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Wifi size={18} color="#f97316" />
                    <Text className="text-neutral-700">Wi-Fi</Text>
                  </View>
                  <Text className="max-w-[55%] text-right font-medium text-black">
                    {currentStatus?.wifiSsid ?? 'Chưa có dữ liệu'}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <Radio size={18} color="#f97316" />
                    <Text className="text-neutral-700">Tín hiệu</Text>
                  </View>
                  <Text className="font-medium text-black">
                    {currentStatus?.signalStrength ?? '--'} dBm
                  </Text>
                </View>

                <View className="flex-row items-start justify-between">
                  <Text className="text-neutral-700">Cập nhật lần cuối</Text>
                  <Text className="max-w-[55%] text-right font-medium text-black">
                    {formatLastSeenAt(currentStatus?.lastSeenAt)}
                  </Text>
                </View>
              </View>
            </View>

            <View className="gap-3">
              <Button
                label="Làm mới trạng thái"
                className="bg-primary"
                loading={isFetchingStatus}
                disabled={isFetchingStatus}
                onPress={handleRefreshStatus}
              />

              <Button
                label="Ngắt liên kết"
                variant="outline"
                className="border-red-300"
                textClassName="text-red-600 text-lg"
                loading={isUnpairing}
                disabled={isUnpairing}
                onPress={handleUnpair}
              />
            </View>

            {!currentStatus && (
              <Text className="text-center text-sm text-neutral-400">
                Thiết bị đã ghép nối nhưng chưa có dữ liệu heartbeat gần đây.
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}