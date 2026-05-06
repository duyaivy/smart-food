import { toValidDate } from './format';

const DATE_INPUT_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function padDatePart(value: number) {
  return String(value).padStart(2, '0');
}

function parseDateInput(value: string): Date | null {
  const match = DATE_INPUT_PATTERN.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function parseDisplayDate(value?: Date | string | null): Date | null {
  if (typeof value === 'string') {
    const dateInput = parseDateInput(value);
    if (dateInput) return dateInput;
  }

  return toValidDate(value);
}

function startOfLocalDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ).getTime();
}

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

export function toDueDateIso(value: string | undefined | null): string | null {
  if (!value) return null;

  const date = parseDisplayDate(value);
  if (!date) return null;

  return date.toISOString();
}

export function formatDateInput(value?: Date | string | null): string {
  const date = parseDisplayDate(value);
  if (!date) return '';

  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-');
}

export function formatDateDisplay(value?: Date | string | null): string {
  const date = parseDisplayDate(value);
  if (!date) return '';

  return [
    padDatePart(date.getDate()),
    padDatePart(date.getMonth() + 1),
    date.getFullYear(),
  ].join('-');
}

export function getRemainingDueDays(value?: Date | string | null) {
  const date = parseDisplayDate(value);
  if (!date) return null;

  const todayStart = startOfLocalDay(new Date());
  const dueStart = startOfLocalDay(date);

  return Math.ceil((dueStart - todayStart) / MS_PER_DAY);
}

export function formatRemainingDueTime(value?: Date | string | null): string {
  const remainingDays = getRemainingDueDays(value);

  if (remainingDays === null) return 'Chưa có hạn dùng';
  if (remainingDays < 0) return `Quá hạn ${Math.abs(remainingDays)} ngày`;
  if (remainingDays === 0) return 'Hết hạn hôm nay';
  if (remainingDays === 1) return 'Còn 1 ngày';

  return `Còn ${remainingDays} ngày`;
}
