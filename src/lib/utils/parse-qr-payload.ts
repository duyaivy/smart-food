export type ParsedIotQrPayload = {
  deviceUid: string;
  apiKey: string;
};

function isValidPayload(value: unknown): value is ParsedIotQrPayload {
  if (!value || typeof value !== 'object') return false;

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.deviceUid === 'string' &&
    payload.deviceUid.trim().length > 0 &&
    typeof payload.apiKey === 'string' &&
    payload.apiKey.trim().length > 0
  );
}

export function parseQrPayload(rawValue: string): ParsedIotQrPayload | null {
  const trimmed = rawValue.trim();

  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as unknown;

    if (!isValidPayload(parsed)) return null;

    return {
      deviceUid: parsed.deviceUid.trim(),
      apiKey: parsed.apiKey.trim(),
    };
  } catch {
    return null;
  }
}