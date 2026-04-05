import { router } from 'expo-router';
import React from 'react';
import { Scale, TriangleAlert, Wifi, WifiOff } from 'lucide-react-native';

import {
  FocusAwareStatusBar,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { useIotSse } from '@/lib/hooks/use-iot-sse';
import { useGetDeviceStatusQuery } from '@/lib/hooks/queries/iot.query';
import { useIotScanStore } from '@/lib/stores/use-iot-scan-store';
import { useIotStore } from '@/lib/stores/use-iot-store';

function formatLastSeenAt(value?: string | null) {
  if (!value) return 'Chưa có dữ liệu';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';

  return date.toLocaleString('vi-VN');
}

function formatRecordedAt(value: number) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Chưa có dữ liệu';
  return date.toLocaleString('vi-VN');
}

function WarningConnectCard() {
  return (
    <View className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
      <View className="flex-row items-start gap-3">
        <View className="mt-0.5">
          <TriangleAlert size={22} color="#d97706" />
        </View>

        <View className="flex-1">
          <Text className="text-base font-semibold text-amber-800">
            Bạn chưa kết nối cân thông minh
          </Text>
          <Text className="mt-1 text-sm leading-5 text-amber-700">
            Hãy ghép nối thiết bị để nhận dữ liệu nguyên liệu trực tiếp khi nấu
            ăn và đồng bộ với ứng dụng.
          </Text>

          <Pressable
            onPress={() => router.push(ROUTE.STACK.PROFILE.SMART_SCALE)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
            className="mt-3 self-start rounded-xl bg-primary px-4 py-3"
          >
            <Text className="font-semibold text-white">Kết nối ngay</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function DeviceLiveCard({
  deviceUid,
  isOnline,
  lastSeenAt,
}: {
  deviceUid: string;
  isOnline: boolean;
  lastSeenAt?: string | null;
}) {
  return (
    <View className="mt-5 rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Scale size={20} color="#f97316" />
          <Text className="text-lg font-semibold text-black">Cân thông minh</Text>
        </View>

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
      </View>

      <Text className="mt-2 text-sm text-neutral-500">{deviceUid}</Text>

      <View className="mt-4 flex-row items-center gap-2">
        {isOnline ? (
          <Wifi size={18} color="#f97316" />
        ) : (
          <WifiOff size={18} color="#9ca3af" />
        )}
        <Text className="text-sm text-neutral-600">
          Cập nhật lần cuối: {formatLastSeenAt(lastSeenAt)}
        </Text>
      </View>

      <Pressable
        onPress={() => router.push(ROUTE.STACK.PROFILE.SMART_SCALE)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.8 : 1,
        })}
        className="mt-4 self-start rounded-xl border border-orange-200 px-4 py-3"
      >
        <Text className="font-medium text-primary">Quản lý thiết bị</Text>
      </Pressable>
    </View>
  );
}

function ScanRecordCard({
  ingredientName,
  calories,
  protein,
  carb,
  fat,
  confidence,
  weight,
  status,
  recordedAt,
}: {
  ingredientName: string | null;
  calories: number | null;
  protein: number | null;
  carb: number | null;
  fat: number | null;
  confidence: number | null;
  weight: number;
  status: 'DONE' | 'FAILED';
  recordedAt: number;
}) {
  const isDone = status === 'DONE';

  return (
    <View className="rounded-2xl border border-neutral-200 bg-white p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-black">
            {ingredientName ?? 'Chưa nhận diện được'}
          </Text>
          <Text className="mt-1 text-sm text-neutral-500">
            Độ chính xác: {confidence ?? 50}%
          </Text>
        </View>

        <View
          className={`rounded-full px-3 py-1 ${
            isDone ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              isDone ? 'text-green-700' : 'text-red-600'
            }`}
          >
            {status}
          </Text>
        </View>
      </View>

      <View className="mt-4 gap-2">
        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Khối lượng</Text>
          <Text className="font-medium text-black">{weight} g</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Calories</Text>
          <Text className="font-medium text-black">
            {calories ?? 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Protein</Text>
          <Text className="font-medium text-black">
            {protein ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Carb</Text>
          <Text className="font-medium text-black">
            {carb ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Fat</Text>
          <Text className="font-medium text-black">
            {fat ?? 'Chưa có dữ liệu'} g
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-neutral-600">Thời gian ghi nhận</Text>
          <Text className="max-w-[55%] text-right font-medium text-black">
            {formatRecordedAt(recordedAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function DiscoverScreen() {
  const device = useIotStore((state) => state.device);
  const records = useIotScanStore((state) => state.records);

  useIotSse(device?.deviceUid);

  const { data: statusData } = useGetDeviceStatusQuery(device?.deviceUid);

  const currentStatus = statusData?.data;
  const currentDeviceRecords = React.useMemo(() => {
    if (!device?.deviceUid) return [];
    return records.filter((record) => record.deviceUid === device.deviceUid);
  }, [device?.deviceUid, records]);

  return (
    <SafeAreaView className="flex-1 px-4">
      <FocusAwareStatusBar />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-2xl font-bold">Khám phá</Text>

        <View className="mt-4 flex flex-row gap-2">
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
                <View className="mt-3 gap-3">
                  {currentDeviceRecords.map((record) => (
                    <ScanRecordCard
                      key={record.id}
                      ingredientName={record.ingredientName}
                      calories={record.calories}
                      protein={record.protein}
                      carb={record.carb}
                      fat={record.fat}
                      confidence={record.confidence}
                      weight={record.weight}
                      status={record.status}
                      recordedAt={record.recordedAt}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}