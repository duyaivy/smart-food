export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

export function toDueDateIso(value: string | undefined | null): string | null {
  if (!value) return null;

  const trimmed = String(value).trim();
  if (!trimmed) return null;

  const date = new Date(`${trimmed}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export function formatDateInput(value?: Date | string | null): string {
  if (!value) return '';

  const date = new Date(value as string);

  if (Number.isNaN(date.getTime())) return '';

  return date.toISOString().slice(0, 10);
}
