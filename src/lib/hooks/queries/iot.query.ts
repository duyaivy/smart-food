import { useMutation, useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import { useEffect } from 'react';

import { queryClient } from '@/api';
import {
  iotApi,
  type IotDevice,
  type IotDeviceStatus,
  type PairDevicePayload,
} from '@/api/iot.api';
import { queryKeys } from '@/constants/query-key';
import { showMessage } from '@/lib/common/show-message';
import { useIotScanStore } from '@/lib/stores/use-iot-scan-store';
import { useIotStore } from '@/lib/stores/use-iot-store';
import { type SuccessResponse } from '@/models/interfaces/common';

const getLatestDeviceFromList = (devices?: IotDevice[]) => {
  if (!devices?.length) return null;
  return devices[0] ?? null;
};

export const useGetMyDevicesQuery = () => {
  const device = useIotStore((state) => state.device);
  const lastSyncedAt = useIotStore((state) => state.lastSyncedAt);
  const setDevice = useIotStore((state) => state.setDevice);
  const clearDevice = useIotStore((state) => state.clearDevice);

  const initialData: SuccessResponse<IotDevice[]> | undefined = device
    ? {
        message: 'local-cache',
        data: [
          {
            id: device.id,
            deviceUid: device.deviceUid,
            ownerId: device.ownerId,
            createdAt: device.createdAt ?? undefined,
          },
        ],
      }
    : undefined;

  const query = useQuery<SuccessResponse<IotDevice[]>>({
    queryKey: queryKeys.iotDevices,
    queryFn: async () => {
      const response = await iotApi.getMyDevices();
      return response.data;
    },
    initialData,
    initialDataUpdatedAt: lastSyncedAt ?? undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (!query.data) return;

    const latestDevice = getLatestDeviceFromList(query.data.data);

    if (!latestDevice) {
      clearDevice();
      return;
    }

    setDevice({
      id: latestDevice.id,
      deviceUid: latestDevice.deviceUid,
      ownerId: latestDevice.ownerId,
      createdAt: latestDevice.createdAt ?? null,
    });
  }, [query.data, clearDevice, setDevice]);

  return query;
};

export const useGetDeviceStatusQuery = (deviceUid?: string | null) => {
  const status = useIotStore((state) => state.status);
  const lastSyncedAt = useIotStore((state) => state.lastSyncedAt);
  const setStatus = useIotStore((state) => state.setStatus);

  const initialData: SuccessResponse<IotDeviceStatus> | undefined =
    deviceUid && status?.deviceUid === deviceUid
      ? {
          message: 'local-cache',
          data: {
            deviceUid: status.deviceUid,
            isOnline: status.isOnline,
            batteryLevel: status.batteryLevel,
            wifiSsid: status.wifiSsid,
            signalStrength: status.signalStrength,
            lastSeenAt: status.lastSeenAt,
          },
        }
      : undefined;

  const query = useQuery<SuccessResponse<IotDeviceStatus>>({
    queryKey: deviceUid
      ? queryKeys.iotDeviceStatus(deviceUid)
      : ['iot-device-status', 'unknown'],
    queryFn: async () => {
      if (!deviceUid) {
        throw new Error('Thiếu deviceUid');
      }

      const response = await iotApi.getDeviceStatus(deviceUid);
      return response.data;
    },
    enabled: !!deviceUid,
    initialData,
    initialDataUpdatedAt: lastSyncedAt ?? undefined,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  useEffect(() => {
    if (!query.data?.data) return;
    setStatus(query.data.data);
  }, [query.data, setStatus]);

  return query;
};

export const usePairDeviceMutation = () =>
  useMutation({
    mutationFn: (payload: PairDevicePayload) => iotApi.pairDevice(payload),
    onSuccess: async (response: { data: SuccessResponse<IotDevice> }) => {
      const device = response.data.data;

      useIotStore.getState().setDevice({
        id: device.id,
        deviceUid: device.deviceUid,
        ownerId: device.ownerId,
        createdAt: device.createdAt ?? null,
      });

      queryClient.setQueryData(queryKeys.iotDevices, {
        message: response.data.message,
        data: [device],
      });

      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as unknown[];

            if (!Array.isArray(queryKey) || queryKey.length === 0) {
              return false;
            }

            const [rootKey, secondKey] = queryKey;

            return (
              rootKey === queryKeys.iotDevices[0] ||
              (rootKey === 'iot-device-status' && secondKey === device.deviceUid)
            );
          },
        }),
      ]);

      showMessage({
        message: 'Liên kết thiết bị thành công',
        type: 'success',
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ??
        (error instanceof Error
          ? error.message
          : 'Liên kết thiết bị thất bại');

      showMessage({
        message,
        type: 'error',
      });
    },
  });

export const useUnpairDeviceMutation = () =>
  useMutation({
    mutationFn: (deviceUid: string) => iotApi.unpairDevice(deviceUid),
    onSuccess: async (_response, deviceUid: string) => {
      useIotStore.getState().clearDevice();
      useIotScanStore.getState().removeRecordsByDeviceUid(deviceUid);

      await Promise.all([
        queryClient.removeQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as unknown[];

            if (!Array.isArray(queryKey) || queryKey.length === 0) {
              return false;
            }

            const [rootKey, secondKey] = queryKey;

            return (
              rootKey === queryKeys.iotDevices[0] ||
              (rootKey === 'iot-device-status' && secondKey === deviceUid)
            );
          },
        }),
      ]);

      showMessage({
        message: 'Ngắt liên kết thiết bị thành công',
        type: 'success',
      });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error.response?.data?.message ??
        (error instanceof Error
          ? error.message
          : 'Ngắt liên kết thiết bị thất bại');

      showMessage({
        message,
        type: 'error',
      });
    },
  });