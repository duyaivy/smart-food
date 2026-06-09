import type { GetMealHistoryParams } from '@/models/interfaces/meal';

export const queryKeys = {
  me: ['me'],
  syncDish: ['sync-dish'],

  iotDevices: ['iot-devices'],
  iotDeviceStatus: (deviceUid: string) => ['iot-device-status', deviceUid],
  iotScanRecords: ['iot-scan-records'],

  recommendation: (jobId: number) => ['recommendation', jobId] as const,

  mealHistory: (params?: GetMealHistoryParams) =>
    ['meal-history', params] as const,
  mealHistoryDetail: (id: number) => ['meal-history-detail', id] as const,

  nutritionDaily: (date: string) => ['nutrition-daily', date] as const,
  nutritionWeekly: (week: string) => ['nutrition-weekly', week] as const,
  nutritionRemaining: (date: string) => ['nutrition-remaining', date] as const,
} as const;
