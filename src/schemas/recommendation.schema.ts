import { z } from 'zod';

export const recommendationSchema = z.object({
  planDays: z
    .number({
      required_error: 'Vui lòng chọn số ngày lập kế hoạch',
    })
    .min(1, 'Số ngày tối thiểu là 1')
    .max(30, 'Số ngày tối đa là 30'),
  avoidRepeats: z.boolean().default(true),
  mealGoal: z.enum(['REDUCE', 'MAINTAIN', 'INCREASE', 'CUSTOM'], {
    required_error: 'Vui lòng chọn mục tiêu bữa ăn',
  }),
  weightChange: z
    .number()
    .min(-1, 'Mức thay đổi tối thiểu là -1kg')
    .max(1, 'Mức thay đổi tối đa là 1kg'),
  mealStructure: z.object({
    breakfast: z.object({
      mainDish: z.number().min(0),
      soup: z.number().min(0),
      vegetable: z.number().min(0),
    }),
    lunch: z.object({
      mainDish: z.number().min(0),
      soup: z.number().min(0),
      vegetable: z.number().min(0),
    }),
    dinner: z.object({
      mainDish: z.number().min(0),
      soup: z.number().min(0),
      vegetable: z.number().min(0),
    }),
  }),
});

export type RecommendationSchemaType = z.infer<typeof recommendationSchema>;
