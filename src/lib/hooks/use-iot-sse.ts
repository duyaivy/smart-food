import { useEffect, useRef } from 'react';
import EventSource from 'react-native-sse';

import { showMessage } from '@/lib/common/show-message';
import { Env } from '@/lib/env';
import { useIotScanStore } from '@/lib/stores/use-iot-scan-store';

type IotSseConnectedPayload = {
  deviceUid: string;
};

type IotSseScanResultPayload = {
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

const MOCK_NUTRITION = {
  protein: 12,
  carb: 8,
  fat: 5,
  confidence: 50,
};

function normalizeBaseUrl(value?: string) {
  if (!value) return '';
  return value.endsWith('/v1') ? value.slice(0, -3) : value;
}

function buildStreamUrl(deviceUid: string) {
  const baseUrl = normalizeBaseUrl(Env.API_URL);

  if (!baseUrl) {
    throw new Error('Thiếu Env.API_URL để mở SSE stream');
  }

  return `${baseUrl}/v1/iot/devices/${encodeURIComponent(deviceUid)}/stream`;
}

export function useIotSse(deviceUid?: string | null) {
  const eventSourceRef = useRef<EventSource<'connected' | 'scan-result'> | null>(
    null
  );

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
          calories: payload.calories,
          protein: payload.protein ?? MOCK_NUTRITION.protein,
          carb: payload.carb ?? MOCK_NUTRITION.carb,
          fat: payload.fat ?? MOCK_NUTRITION.fat,
          confidence: payload.confidence ?? MOCK_NUTRITION.confidence,
          weight: payload.weight,
          status: payload.status,
          message: payload.message,
          imageUrl: payload.imageUrl,
          source: 'sse',
        });

        showMessage({
          message:
            payload.status === 'DONE'
              ? 'Đã nhận kết quả quét mới'
              : 'Thiết bị gửi kết quả quét thất bại',
          description: payload.message,
          type: payload.status === 'DONE' ? 'success' : 'warning',
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