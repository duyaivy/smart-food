import { router } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';

import {
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { HeaderNoBack } from '@/components/ui/header-no-back';
import { ROUTE } from '@/constants/route';
import { useGetDeviceStatusQuery } from '@/lib/hooks/queries/iot.query';
import { useDiscoverPrivacy } from '@/lib/hooks/use-discover-privacy';
import { useIotSse } from '@/lib/hooks/use-iot-sse';
import { useIotScanStore } from '@/lib/stores/use-iot-scan-store';
import { useIotStore } from '@/lib/stores/use-iot-store';

import { DeviceLiveCard } from './_components/device-live-card';
import { PrivacyModal } from './_components/privacy-modal';
import { ScanRecordCard } from './_components/scan-record-card';
import { WarningConnectCard } from './_components/warning-connect-card';

export default function DiscoverScreen() {
  const device = useIotStore((state) => state.device);
  const records = useIotScanStore((state) => state.records);

  const [hasSeenDiscoverPrivacy, setHasSeenDiscoverPrivacy] =
    useDiscoverPrivacy();

  useIotSse(device?.deviceUid);

  const { data: statusData } = useGetDeviceStatusQuery(device?.deviceUid);

  const currentStatus = statusData?.data;

  const currentDeviceRecords = React.useMemo(() => {
    if (!device?.deviceUid) return [];
    return records.filter((record) => record.deviceUid === device.deviceUid);
  }, [device?.deviceUid, records]);

  const [openPrivacyModal, setOpenPrivacyModal] = React.useState(false);

  React.useEffect(() => {
    if (!hasSeenDiscoverPrivacy) {
      setOpenPrivacyModal(true);
    }
  }, [hasSeenDiscoverPrivacy]);

  const handleConfirmPrivacy = () => {
    setHasSeenDiscoverPrivacy(true);
    setOpenPrivacyModal(false);
  };

  const renderScanRecord = React.useCallback(
    ({ item: record }: { item: (typeof currentDeviceRecords)[number] }) => (
      <ScanRecordCard
        ingredientName={record.ingredientName}
        calories={record.calories}
        protein={record.protein}
        carb={record.carb}
        fat={record.fat}
        confidence={record.predictedConfidence}
        weight={record.weight}
        status={record.status}
        recordedAt={record.recordedAt}
      />
    ),
    []
  );

  const renderRecordSeparator = React.useCallback(
    () => <View className="h-3" />,
    []
  );

  return (
    <SafeAreaView className="flex-1 px-4">
      <FocusAwareStatusBar />

      <PrivacyModal
        visible={openPrivacyModal}
        onConfirm={handleConfirmPrivacy}
      />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <HeaderNoBack title="Khám phá" />
        <View className="mt-4 flex-row gap-2">
          <Pressable
            onPress={() => router.push(ROUTE.STACK.DISCOVER.DISH_LIST)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
            className="flex-1 rounded-lg bg-primary p-4"
          >
            <Text className="text-center text-lg font-semibold text-white">
              Công thức Món ăn
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push(ROUTE.STACK.DISCOVER.INGREDIENT)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
            className="flex-1 rounded-lg bg-secondary p-4"
          >
            <Text className="text-center text-lg font-semibold text-white">
              Nguyên liệu thô
            </Text>
          </Pressable>
        </View>

        {!device ? (
          <WarningConnectCard />
        ) : (
          <>
            <DeviceLiveCard
              deviceUid={device.deviceUid}
              isOnline={currentStatus?.isOnline ?? false}
              lastSeenAt={currentStatus?.lastSeenAt}
            />

            <View className="mt-5">
              <Text className="text-lg font-semibold text-black">
                Kết quả nhận diện gần đây
              </Text>

              {currentDeviceRecords.length === 0 ? (
                <View className="mt-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5">
                  <Text className="text-center text-neutral-500">
                    Chưa có dữ liệu từ cân thông minh. Khi thiết bị gửi kết quả
                    quét, thông tin sẽ hiển thị tại đây.
                  </Text>
                </View>
              ) : (
                <FlatList
                  className="mt-3"
                  data={currentDeviceRecords}
                  renderItem={renderScanRecord}
                  keyExtractor={(record) => String(record.recordedAt)}
                  ItemSeparatorComponent={renderRecordSeparator}
                  scrollEnabled={false}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
