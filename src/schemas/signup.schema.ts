import { z } from 'zod';

export const signupSchema = z
  .object({
    name: z.string().trim().min(1, 'Tên không được để trống'),
    email: z.string().trim().email('Email không hợp lệ'),
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(8, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;