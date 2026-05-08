export type IotSseConnectedPayload = {
  deviceUid: string;
};

export type IotSseScanResultPayload = {
  deviceUid: string;
  ingredientName?: string;
  ingredientId: string;
  calories: number;
  protein?: number;
  carb?: number;
  fat?: number;
  predictedConfidence?: number;
  weight: number;
  status: 'DONE' | 'FAILED';
  message: string;
  imageUrl: string;
};
