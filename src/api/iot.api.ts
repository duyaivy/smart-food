import { type SuccessResponse } from '@/models/interfaces/common';

import http from './common/axios.config';

const IOT_URL = '/iot';

export type PairDevicePayload = {
  deviceUid: string;
  apiKey: string;
};

export type IotDevice = {
  id: number;
  deviceUid: string;
  ownerId: number | null;
  createdAt?: string;
};

export type IotDeviceStatus = {
  deviceUid: string;
  isOnline: boolean;
  batteryLevel: number | null;
  wifiSsid: string | null;
  signalStrength: number | null;
  lastSeenAt: string | null;
};

export type IotScanResultPayload = {
  deviceUid: string;
  ingredientName: string | null;
  calories: number | null;
  weight: number;
  status: 'DONE' | 'FAILED';
  message: string;
  imageUrl: string;
};

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
    http.delete<SuccessResponse<IotDevice>>(`${IOT_URL}/devices/${deviceUid}/pair`),

  getDeviceStreamUrl: (deviceUid: string) =>
    `${IOT_URL}/devices/${deviceUid}/stream`,
};