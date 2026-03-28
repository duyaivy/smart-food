import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Tên phải có ít nhất 2 ký tự')
    .max(50, 'Tên quá dài'),
  gender: z.boolean({ invalid_type_error: 'Giới tính là bắt buộc' }),
  birthday: z
    .date({ invalid_type_error: 'Ngày sinh là bắt buộc' })
    .min(
      new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
      'Ngày sinh không hợp lệ'
    )
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 16)),
      'Tuổi phải từ 16 tuổi trở lên'
    ),
  height: z
    .number({ invalid_type_error: 'Chiều cao là bắt buộc' })
    .int('Chiều cao không hợp lệ'),
  weight: z
    .number({ invalid_type_error: 'Cân nặng là bắt buộc' })
    .int('Cân nặng không hợp lệ'),
});
export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
