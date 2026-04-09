export const queryKeys = {
  me: ['me'],
  syncDish: ['sync-dish'],

  iotDevices: ['iot-devices'],
  iotDeviceStatus: (deviceUid: string) => ['iot-device-status', deviceUid],
  iotScanRecords: ['iot-scan-records'],
} as const;