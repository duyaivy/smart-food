import { z } from 'zod';

import { toDueDateIso } from '@/lib/utils/date-time';
import { FridgeItemPriority } from '@/models/types/fridge';

const dueDateInputSchema = z
  .string()
  .trim()
  .refine((value) => Boolean(toDueDateIso(value)), {
    message: 'Ngày hết hạn không hợp lệ. Định dạng đúng: DD-MM-YYYY.',
  });

const quantityInputSchema = (message: string, allowZero = false) =>
  z
    .string()
    .trim()
    .refine(
      (value) => {
        const parsed = Number(value);

        if (!Number.isFinite(parsed)) return false;

        return allowZero ? parsed >= 0 : parsed > 0;
      },
      { message }
    );

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

export const addFridgeItemFormSchema = z.object({
  ingredientId: z
    .number()
    .int()
    .positive('Vui lòng chọn nguyên liệu có sẵn trong danh sách.'),
  ingredientText: z.string().trim().min(1, 'Vui lòng nhập tên nguyên liệu.'),
  quantity: quantityInputSchema('Số lượng phải lớn hơn 0.'),
  dueDate: dueDateInputSchema,
  priority: z.nativeEnum(FridgeItemPriority),
});

export const editFridgeItemFormSchema = z.object({
  quantity: quantityInputSchema('Số lượng không hợp lệ.', true),
  dueDate: dueDateInputSchema,
  priority: z.nativeEnum(FridgeItemPriority),
});

export type CreateFridgeItemSchema = z.infer<typeof createFridgeItemSchema>;
export type UpdateFridgeItemSchema = z.infer<typeof updateFridgeItemSchema>;
export type AddFridgeItemFormValues = z.infer<typeof addFridgeItemFormSchema>;
export type EditFridgeItemFormValues = z.infer<typeof editFridgeItemFormSchema>;
