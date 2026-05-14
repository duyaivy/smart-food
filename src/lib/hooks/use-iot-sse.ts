import { useEffect, useRef } from 'react';
import { DeviceEventEmitter } from 'react-native';
import EventSource from 'react-native-sse';

import { showMessage } from '@/lib/common/show-message';
import { Env } from '@/lib/env';
import { useIotScanStore } from '@/lib/stores/use-iot-scan-store';
import {
  type IotSseConnectedPayload,
  type IotSseScanResultPayload,
} from '@/models/types/iot-sse';

export const IOT_ADD_TO_FRIDGE_EVENT = 'iot:add-to-fridge';

export type IotAddToFridgeEventPayload = {
  ingredientName: string;
  quantity: string;
};
function buildStreamUrl(deviceUid: string) {
  const baseUrl = Env.API_URL;

  if (!baseUrl) {
    throw new Error('Thiếu Env.API_URL để mở SSE stream');
  }

  return `${baseUrl}/iot/devices/${encodeURIComponent(deviceUid)}/stream`;
}

function openAddFridgeItemSheet(payload: IotSseScanResultPayload) {
  DeviceEventEmitter.emit(IOT_ADD_TO_FRIDGE_EVENT, {
    ingredientName: payload.ingredientName ?? '',
    quantity:
      payload.weight === null || payload.weight === undefined
        ? ''
        : String(payload.weight),
  } satisfies IotAddToFridgeEventPayload);
}

export function useIotSse(deviceUid?: string | null) {
  const eventSourceRef = useRef<EventSource<
    'connected' | 'scan-result'
  > | null>(null);

  useEffect(() => {
    if (!deviceUid) {
      return;
    }

    const streamUrl = buildStreamUrl(deviceUid);
    const addRecord = useIotScanStore.getState().addRecord;

    const es = new EventSource<'connected' | 'scan-result'>(streamUrl, {
      headers: {
        Accept: 'text/event-stream',
      },
      pollingInterval: 0,
    });

    eventSourceRef.current = es;

    es.addEventListener('connected', (event) => {
      try {
        JSON.parse(
          (event as { data?: string }).data ?? '{}'
        ) as IotSseConnectedPayload;
      } catch {
        // ignore parse error for connected event
      }
    });

    es.addEventListener('scan-result', (event) => {
      try {
        const payload = JSON.parse(
          (event as { data?: string }).data ?? '{}'
        ) as IotSseScanResultPayload;

        addRecord({
          deviceUid: payload.deviceUid,
          ingredientName: payload.ingredientName,
          ingredientId: payload.ingredientId,
          calories: payload.calories,
          protein: payload.protein,
          carb: payload.carb,
          fat: payload.fat,
          predictedConfidence: payload.predictedConfidence,
          weight: payload.weight,
          status: payload.status,
          message: payload.message,
          imageUrl: payload.imageUrl,
          source: 'sse',
        });

        if (payload.status === 'DONE') {
          showMessage({
            message: 'Đã nhận kết quả quét mới',
            description:
              payload.message ||
              `${payload.ingredientName ?? 'Nguyên liệu'} - ${
                payload.weight
              } g`,
            type: 'success',
            duration: 10000,
            actionLabel: 'Thêm vào tủ lạnh',
            onActionPress: () => {
              openAddFridgeItemSheet(payload);
            },
          });

          return;
        }

        showMessage({
          message: 'Thiết bị gửi kết quả quét thất bại',
          description: payload.message,
          type: 'warning',
          duration: 2500,
        });
      } catch {
        showMessage({
          message: 'Không thể xử lý dữ liệu từ thiết bị',
          type: 'warning',
          duration: 2500,
        });
      }
    });

    es.addEventListener('error', () => {
      // keep silent for now to avoid noisy UX
    });

    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [deviceUid]);
}
