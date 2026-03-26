import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên quá dài'),
  age: z
    .number({ invalid_type_error: 'Tuổi là bắt buộc' })
    .int('Tuổi không hợp lệ')
    .min(16, 'Tuổi phải từ 16 tuổi trở lên'),
  height: z
    .number({ invalid_type_error: 'Chiều cao là bắt buộc' })
    .int('Chiều cao không hợp lệ'),
  weight: z
    .number({ invalid_type_error: 'Cân nặng là bắt buộc' })
    .int('Cân nặng không hợp lệ'),
});
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
