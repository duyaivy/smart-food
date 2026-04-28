import { z } from 'zod';

import { FridgeItemPriority } from '@/models/types/fridge';

export const createFridgeItemSchema = z.object({
  ingredientId: z.number().int().positive(),
  quantity: z.number().positive(),
  dueDate: z.string().datetime(),
  priority: z.nativeEnum(FridgeItemPriority),
});

export const updateFridgeItemSchema = z.object({
  quantity: z.number().nonnegative().optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.nativeEnum(FridgeItemPriority).optional(),
});

export type CreateFridgeItemSchema = z.infer<typeof createFridgeItemSchema>;
export type UpdateFridgeItemSchema = z.infer<typeof updateFridgeItemSchema>;
