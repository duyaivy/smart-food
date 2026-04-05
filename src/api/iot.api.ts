import type {
  IotDevice,
  IotDeviceStatus,
  IotScanResultPayload,
  PairDevicePayload,
} from '@/models/interfaces/iot';
import { type SuccessResponse } from '@/models/interfaces/common';

import http from './common/axios.config';

const IOT_URL = '/iot';

export const iotApi = {
  pairDevice: (data: PairDevicePayload) =>
    http.post<SuccessResponse<IotDevice>>(`${IOT_URL}/devices/pair`, data),

  getMyDevices: () =>
    http.get<SuccessResponse<IotDevice[]>>(`${IOT_URL}/devices`),

  getDeviceStatus: (deviceUid: string) =>
    http.get<SuccessResponse<IotDeviceStatus>>(
      `${IOT_URL}/devices/${deviceUid}/status`
    ),

  unpairDevice: (deviceUid: string) =>
    http.delete<SuccessResponse<IotDevice>>(
      `${IOT_URL}/devices/${deviceUid}/pair`
    ),

  getDeviceStreamUrl: (deviceUid: string) =>
    `${IOT_URL}/devices/${deviceUid}/stream`,
};

export type {
  IotDevice,
  IotDeviceStatus,
  IotScanResultPayload,
  PairDevicePayload,
};