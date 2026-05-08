export const queryKeys = {
  me: ['me'],
  syncDish: ['sync-dish'],

  iotDevices: ['iot-devices'],
  iotDeviceStatus: (deviceUid: string) => ['iot-device-status', deviceUid],
  iotScanRecords: ['iot-scan-records'],

  recommendation: (jobId: number) => ['recommendation', jobId] as const,
} as const;
