import { FridgeItemPriority } from '@/models/types/fridge';

export const priorityOptions = [
  FridgeItemPriority.VERY_HIGH,
  FridgeItemPriority.HIGH,
  FridgeItemPriority.MEDIUM,
  FridgeItemPriority.LOW,
] as const;

export type PriorityOption = (typeof priorityOptions)[number];
