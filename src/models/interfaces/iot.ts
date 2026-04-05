export type IotScanRecordStatus = 'DONE' | 'FAILED';

export type PairDevicePayload = {
  deviceUid: string;
  apiKey: string;
};

export type IotDevice = {
  id: number;
  deviceUid: string;
  ownerId: number | null;
  createdAt?: string | null;
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
  protein?: number | null;
  carb?: number | null;
  fat?: number | null;
  confidence?: number | null;
  weight: number;
  status: IotScanRecordStatus;
  message: string;
  imageUrl: string;
};

export type IotScanRecord = {
  id: string;
  deviceUid: string;
  ingredientName: string | null;
  calories: number | null;
  protein: number | null;
  carb: number | null;
  fat: number | null;
  confidence: number | null;
  weight: number;
  status: IotScanRecordStatus;
  message: string;
  imageUrl: string;
  recordedAt: number;
  source: 'local' | 'sse' | 'sync';
};

export type IotPairedDevice = {
  id: number;
  deviceUid: string;
  ownerId: number | null;
  createdAt?: string | null;
  pairedAt: number;
};

export type StoredIotDeviceStatus = IotDeviceStatus & {
  fetchedAt: number;
};