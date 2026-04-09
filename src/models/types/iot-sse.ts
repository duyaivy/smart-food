export type IotSseConnectedPayload = {
  deviceUid: string;
};

export type IotSseScanResultPayload = {
  deviceUid: string;
  ingredientName: string | null;
  calories: number | null;
  protein?: number | null;
  carb?: number | null;
  fat?: number | null;
  confidence?: number | null;
  weight: number;
  status: 'DONE' | 'FAILED';
  message: string;
  imageUrl: string;
};