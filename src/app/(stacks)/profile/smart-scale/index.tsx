import React from 'react';
import { Alert, RefreshControl } from 'react-native';

import {
  FocusAwareStatusBar,
  SafeAreaView,
  ScrollView,
  View,
} from '@/components/ui';
import { useIotStore } from '@/lib/stores/use-iot-store';
import {
  useGetDeviceStatusQuery,
  useGetMyDevicesQuery,
  usePairDeviceMutation,
  useUnpairDeviceMutation,
} from '@/lib/hooks/queries/iot.query';

import { EmptyDeviceState } from './_components/empty-device-state';
import { DevicePreviewCard } from './_components/device-preview-card';
import { DeviceInfoCard } from './_components/device-info-card';
import { DeviceActions } from './_components/device-actions';

const SAFE_AREA_EDGES = ['bottom'] as const;

export default function SmartScaleScreen(): React.JSX.Element {
  const device = useIotStore((state) => state.device);

  const [deviceUidInput, setDeviceUidInput] = React.useState('');
  const [apiKeyInput, setApiKeyInput] = React.useState('');
  const [pairMethod, setPairMethod] = React.useState<'qr' | 'manual'>('qr');
  const [isRefreshing, setIsRefreshing] = React.useState(false);

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

  const handlePullToRefresh = async () => {
    if (!device?.deviceUid) return;

    setIsRefreshing(true);

    try {
      await refetchStatus();
    } finally {
      setIsRefreshing(false);
    }
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

  return (
    <SafeAreaView className="flex-1 bg-white" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 32,
        }}
        keyboardShouldPersistTaps="always"
        refreshControl={
          device ? (
            <RefreshControl
              refreshing={isRefreshing || isFetchingStatus}
              onRefresh={handlePullToRefresh}
            />
          ) : undefined
        }
      >
        {!device ? (
          <EmptyDeviceState
            pairMethod={pairMethod}
            deviceUidInput={deviceUidInput}
            apiKeyInput={apiKeyInput}
            isPairing={isPairing}
            onChangePairMethod={setPairMethod}
            onChangeDeviceUid={setDeviceUidInput}
            onChangeApiKey={setApiKeyInput}
            onPair={handlePair}
          />
        ) : (
          <View className="gap-4">
            <DevicePreviewCard />
            <DeviceInfoCard status={currentStatus} />
            <DeviceActions
              isUnpairing={isUnpairing}
              onUnpair={handleUnpair}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}