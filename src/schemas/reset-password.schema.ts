import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    token: z.string().trim().min(1, 'Token không được để trống'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;