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

type CategoryConfig = {
  label: string;
  iconName: string;
  color: string;
};

const CATEGORY_CONFIG: Record<number, CategoryConfig> = {
  1: { label: 'Rau củ', iconName: 'eco', color: '#22c55e' },
  2: { label: 'Thịt tươi', iconName: 'set-meal', color: '#ef4444' },
  3: { label: 'Hải sản', iconName: 'set-meal', color: '#3b82f6' },
  4: { label: 'Trứng & sữa', iconName: 'egg', color: '#eab308' },
  5: { label: 'Đậu & ngũ cốc', iconName: 'grain', color: '#f97316' },
  6: { label: 'Gia vị', iconName: 'nature', color: '#8b5cf6' },
  7: { label: 'Tinh bột', iconName: 'spa', color: '#fec76f' },
  8: { label: 'Trái cây', iconName: 'apple', color: '#ef4444' },
};

const DEFAULT_CATEGORY = {
  label: 'Khác',
  iconName: 'nature',
  color: '#6b7280',
};

export const getCategoryConfig = (categoryId?: number) =>
  categoryId != null
    ? (CATEGORY_CONFIG[categoryId] ?? DEFAULT_CATEGORY)
    : DEFAULT_CATEGORY;
