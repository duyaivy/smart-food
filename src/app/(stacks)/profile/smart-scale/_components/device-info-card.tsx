import React from 'react';
import { Battery, Radio, Wifi, WifiOff } from 'lucide-react-native';

import { Text, View } from '@/components/ui';
import { formatLastSeenAt } from '@/lib/utils/date-time';
import { type IotDeviceStatus } from '@/api/iot.api';
import { DeviceStatusBadge } from './device-status-badge';

type Props = {
  status?: IotDeviceStatus | null;
};

export function DeviceInfoCard({ status }: Props) {
  return (
    <View className="rounded-3xl border border-neutral-200 bg-white px-5 py-5">
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-lg font-semibold text-black">Thông tin thiết bị</Text>
        <DeviceStatusBadge isOnline={status?.isOnline ?? false} />
      </View>

      <View className="mt-4 gap-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {status?.isOnline ? (
              <Wifi size={18} color="#f97316" />
            ) : (
              <WifiOff size={18} color="#9ca3af" />
            )}
            <Text className="text-neutral-700">Trạng thái</Text>
          </View>
          <Text className="font-medium text-black">
            {status?.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Battery size={18} color="#f97316" />
            <Text className="text-neutral-700">Pin</Text>
          </View>
          <Text className="font-medium text-black">
            {status?.batteryLevel ?? '--'}%
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Wifi size={18} color="#f97316" />
            <Text className="text-neutral-700">Wi-Fi</Text>
          </View>
          <Text className="max-w-[55%] text-right font-medium text-black">
            {status?.wifiSsid ?? 'Chưa có dữ liệu'}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <Radio size={18} color="#f97316" />
            <Text className="text-neutral-700">Tín hiệu</Text>
          </View>
          <Text className="font-medium text-black">
            {status?.signalStrength ?? '--'} dBm
          </Text>
        </View>

        <View className="flex-row items-start justify-between">
          <Text className="text-neutral-700">Cập nhật lần cuối</Text>
          <Text className="max-w-[55%] text-right font-medium text-black">
            {formatLastSeenAt(status?.lastSeenAt)}
          </Text>
        </View>

        {!status && (
          <Text className="text-center text-sm text-neutral-400">
            Thiết bị đã ghép nối nhưng chưa có dữ liệu heartbeat gần đây.
          </Text>
        )}
      </View>
    </View>
  );
}