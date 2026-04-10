export const calcKcal = (
  carb?: number,
  protein?: number,
  fat?: number
): number => Math.round((carb || 0) * 4 + (protein || 0) * 4 + (fat || 0) * 9);
