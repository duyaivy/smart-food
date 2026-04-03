import { Difficulty } from '@/models/types/dish';

export const ICON_SIZE_LARGE = 24;
export const ICON_SIZE_MEDIUM = 20;
export const ICON_SIZE_SMALL = 16;

export const TAB_ACTIVE_COLOR = '#FF5722';

export const DIFFICULTY_MAP: Record<
  Difficulty,
  { label: string; textClassName: string; iconClassName: string }
> = {
  [Difficulty.EASY]: {
    label: 'Dễ',
    textClassName: 'text-secondary-700',
    iconClassName: 'text-secondary-700',
  },
  [Difficulty.MEDIUM]: {
    label: 'Trung bình',
    textClassName: 'text-warning-700',
    iconClassName: 'text-warning-700',
  },
  [Difficulty.HARD]: {
    label: 'Khó',
    textClassName: 'text-primary-700',
    iconClassName: 'text-primary-700',
  },
};

export const fallbackIngredients = [
  { id: 1, name: 'Ức gà', quantity: '300g', isAvailable: true },
  { id: 2, name: 'Tiêu đen', quantity: '1 muỗng cà phê', isAvailable: true },
  { id: 3, name: 'Tỏi', quantity: '3 tép', isAvailable: false },
  { id: 4, name: 'Bơ lạt', quantity: '20g', isAvailable: false },
];
