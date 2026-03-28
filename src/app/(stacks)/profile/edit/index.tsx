import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { queryClient } from '@/api';
import {
  Button,
  ControlledInput,
  FocusAwareStatusBar,
  Input,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from '@/components/ui';
import { useAuth } from '@/lib';
import { useUploadMediaMutation } from '@/lib/hooks/queries/upload.query';
import { useUpdateMeMutation } from '@/lib/hooks/queries/user.query';
import {
  type EditProfileFormValues,
  editProfileSchema,
} from '@/schemas/profile.schema';

import AvatarPickerField from './_components/avatar-picker-field';
import NumberPickerField from './_components/number-picker-field';

const SAFE_AREA_EDGES = ['bottom'] as const;

const styles = StyleSheet.create({
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  grow: {
    flexGrow: 1,
  },
});

function buildRange(min: number, max: number, step: number = 1): number[] {
  const values: number[] = [];
  for (let value = min; value <= max; value += step) {
    values.push(value);
  }
  return values;
}

export default function EditProfileScreen(): React.JSX.Element {
  const userInfor = useAuth((state) => state.userInfor);
  const { mutateAsync: updateMe } = useUpdateMeMutation();
  const { mutateAsync: uploadMedia, isPending: isUploadingMedia } =
    useUploadMediaMutation();
  const birthdayValues = useMemo(() => buildRange(10, 100), []);
  const heightValues = useMemo(() => buildRange(80, 200), []);
  const weightValues = useMemo(() => buildRange(20, 150), []);

  const [avatar, setAvatar] = useState<string | undefined>(userInfor?.avatar);
  const {
    control,
    reset,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onChange',
    defaultValues: {
      name: userInfor?.name ?? '',
      birthday: userInfor?.birthday ?? new Date().getFullYear() - 25,
      gender: userInfor?.sex ?? true,
      height: userInfor?.height ?? 170,
      weight: userInfor?.weight ?? 65,
    },
  });

  useEffect(() => {
    if (!userInfor) return;

    reset(
      {
        name: userInfor.name ?? '',
        birthday: userInfor.birthday ?? new Date().getFullYear() - 25,
        gender: userInfor.sex ?? true,
        height: userInfor.height ?? 170,
        weight: userInfor.weight ?? 65,
      },
      { keepDirtyValues: true }
    );
  }, [reset, userInfor]);

  const onSubmit = handleSubmit(async (values) => {
    let avatarValue: string | undefined = undefined;

    if (avatar && avatar !== userInfor?.avatar) {
      const formData = new FormData();
      formData.append('file', {
        uri: avatar,
        name: `avatar_${userInfor?.id ?? 'temp'}.jpg`,
        type: 'image/jpeg',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      const avatarUrl = await uploadMedia(formData);
      avatarValue = avatarUrl.data.data;
    }
    const data = { ...values, avatar: avatarValue };
    await updateMe(data);
    queryClient.invalidateQueries({ queryKey: ['me'] });
    router.back();
  });

  return (
    <SafeAreaView className="flex-1" edges={SAFE_AREA_EDGES}>
      <FocusAwareStatusBar />

      <KeyboardAvoidingView
        style={styles.grow}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          // Ensures taps still fire when the keyboard is open (common on Android).
          keyboardShouldPersistTaps="always"
        >
          <AvatarPickerField
            name={userInfor?.name || ''}
            image={avatar}
            setImage={setAvatar}
          />
          <View className="gap-2">
            <ControlledInput<EditProfileFormValues>
              control={control}
              name="name"
              label="Họ và tên"
              placeholder="Nhập tên của bạn"
              autoCapitalize="words"
              returnKeyType="next"
            />
            <View className="">
              <Text className=" text-black">Email</Text>
              <Input value={userInfor?.email ?? ''} disabled />
            </View>

            <NumberPickerField<EditProfileFormValues>
              control={control}
              name="birthday"
              label="Tuổi"
              values={birthdayValues}
              unit="tuổi"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <NumberPickerField<EditProfileFormValues>
                  control={control}
                  name="height"
                  label="Chiều cao"
                  values={heightValues}
                  unit="cm"
                />
              </View>

              <View className="flex-1">
                <NumberPickerField<EditProfileFormValues>
                  control={control}
                  name="weight"
                  label="Cân nặng"
                  values={weightValues}
                  unit="kg"
                />
              </View>
            </View>
          </View>

          <View className="mt-4">
            <Button
              label="Lưu thay đổi"
              loading={isSubmitting || isUploadingMedia}
              className="bg-primary "
              disabled={!isValid || isSubmitting || isUploadingMedia}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
