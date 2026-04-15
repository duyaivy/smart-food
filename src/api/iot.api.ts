import http from '@api/common/axios.config';

import { generatePath } from '@/lib/common/utils';
import { type SuccessResponse } from '@/models/interfaces/common';
import type {
  IotDevice,
  IotDeviceStatus,
  IotScanResultPayload,
  PairDevicePayload,
} from '@/models/interfaces/iot';

const PAIR_DEVICE_URL = `/iot/devices/pair`;
const DEVICES_URL = `/iot/devices`;
const DEVICE_STATUS_URL = `/iot/devices/:deviceUid/status`;
const UNPAIR_DEVICE_URL = `/iot/devices/:deviceUid/pair`;
const DEVICE_STREAM_URL = `/iot/devices/:deviceUid/stream`;

export const iotApi = {
  pairDevice: (data: PairDevicePayload) =>
    http.post<SuccessResponse<IotDevice>>(PAIR_DEVICE_URL, data),

  getMyDevices: () => http.get<SuccessResponse<IotDevice[]>>(DEVICES_URL),

  getDeviceStatus: (deviceUid: string) =>
    http.get<SuccessResponse<IotDeviceStatus>>(
      generatePath(DEVICE_STATUS_URL, { deviceUid })
    ),

  unpairDevice: (deviceUid: string) =>
    http.delete<SuccessResponse<IotDevice>>(
      generatePath(UNPAIR_DEVICE_URL, { deviceUid })
    ),

  getDeviceStreamUrl: (deviceUid: string) =>
    generatePath(DEVICE_STREAM_URL, { deviceUid }),
};

export type {
  IotDevice,
  IotDeviceStatus,
  IotScanResultPayload,
  PairDevicePayload,
};
