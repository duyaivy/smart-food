import { useMutation, useQuery } from '@tanstack/react-query';
import { type AxiosError } from 'axios';

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

export const useGetMyDevicesQuery = () => {
  const device = useIotStore((state) => state.device);
  const lastSyncedAt = useIotStore((state) => state.lastSyncedAt);

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

  return useQuery<
    SuccessResponse<IotDevice[]>,
    AxiosError,
    SuccessResponse<IotDevice | null>
  >({
    queryKey: queryKeys.iotDevices,
    queryFn: async () => {
      const response = await iotApi.getMyDevices();
      const data = response.data;
      const latestDevice = data.data[0] ?? null;

      const { setDevice, clearDevice } = useIotStore.getState();

      if (!latestDevice) {
        clearDevice();
      } else {
        setDevice({
          id: latestDevice.id,
          deviceUid: latestDevice.deviceUid,
          ownerId: latestDevice.ownerId,
          createdAt: latestDevice.createdAt ?? null,
        });
      }

      return data;
    },
    select: (response) => ({
      ...response,
      data: response.data[0] ?? null,
    }),
    initialData,
    initialDataUpdatedAt: lastSyncedAt ?? undefined,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });
};

export const useGetDeviceStatusQuery = (deviceUid?: string | null) => {
  const status = useIotStore((state) => state.status);
  const lastSyncedAt = useIotStore((state) => state.lastSyncedAt);

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

  return useQuery<
    SuccessResponse<IotDeviceStatus>,
    AxiosError,
    SuccessResponse<IotDeviceStatus>
  >({
    queryKey: deviceUid
      ? queryKeys.iotDeviceStatus(deviceUid)
      : ['iot-device-status', 'unknown'],
    queryFn: async () => {
      if (!deviceUid) {
        throw new Error('Thiếu deviceUid');
      }

      const response = await iotApi.getDeviceStatus(deviceUid);
      const data = response.data;

      useIotStore.getState().setStatus({
        deviceUid: data.data.deviceUid,
        isOnline: data.data.isOnline,
        batteryLevel: data.data.batteryLevel,
        wifiSsid: data.data.wifiSsid,
        signalStrength: data.data.signalStrength,
        lastSeenAt: data.data.lastSeenAt,
      });

      return data;
    },
    select: (response) => ({
      ...response,
      data: {
        deviceUid: response.data.deviceUid,
        isOnline: response.data.isOnline,
        batteryLevel: response.data.batteryLevel,
        wifiSsid: response.data.wifiSsid,
        signalStrength: response.data.signalStrength,
        lastSeenAt: response.data.lastSeenAt,
      },
    }),
    enabled: !!deviceUid,
    initialData,
    initialDataUpdatedAt: lastSyncedAt ?? undefined,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
    retry: 3,
  });
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

      queryClient.setQueryData<SuccessResponse<IotDevice[]>>(
        queryKeys.iotDevices,
        {
          message: response.data.message,
          data: [device],
        },
      );

      await Promise.all([
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as unknown[];

            if (!Array.isArray(queryKey) || queryKey.length === 0) {
              return false;
            }

            const [rootKey] = queryKey;
            return rootKey === queryKeys.iotDevices[0];
          },
        }),
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as unknown[];

            if (!Array.isArray(queryKey) || queryKey.length < 2) {
              return false;
            }

            const [rootKey, secondKey] = queryKey;

            return (
              rootKey === 'iot-device-status' &&
              secondKey === device.deviceUid
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

            const [rootKey] = queryKey;
            return rootKey === queryKeys.iotDevices[0];
          },
        }),
        queryClient.removeQueries({
          predicate: (query) => {
            const queryKey = query.queryKey as unknown[];

            if (!Array.isArray(queryKey) || queryKey.length < 2) {
              return false;
            }

            const [rootKey, secondKey] = queryKey;

            return rootKey === 'iot-device-status' && secondKey === deviceUid;
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