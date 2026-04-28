export function formatUnitLabel(unit?: string | null): string {
  if (!unit) return '';

  const u = String(unit).trim().toUpperCase();

  // common mappings
  if (u === 'NUMBER' || u === 'EA' || u === 'PC') return 'quả';
  if (u === 'GAM' || u === 'GRAM' || u === 'G') return 'g';
  if (u === 'ML') return 'ml';
  if (u === 'L') return 'l';

  // fallback: lowercase the original (keep short)
  return unit.toLowerCase();
}

export function isWeightUnit(unit?: string | null): boolean {
  if (!unit) return false;
  const u = String(unit).trim().toUpperCase();
  return u === 'GAM' || u === 'GRAM' || u === 'G' || u === 'ML' || u === 'L';
}
