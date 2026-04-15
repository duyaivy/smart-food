export function formatLastSeenAt(value?: string | null) {
  if (!value) return 'Chưa có dữ liệu';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa có dữ liệu';
  }

  return date.toLocaleString('vi-VN');
}

export function formatRecordedAt(value: number) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Chưa có dữ liệu';
  }

  return date.toLocaleString('vi-VN');
}
