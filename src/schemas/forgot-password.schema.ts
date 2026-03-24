import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Email không hợp lệ'),
});

export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;