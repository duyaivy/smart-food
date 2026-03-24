import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import * as React from 'react';
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
import { useUpdateMeMutation } from '@/lib/hooks/queries/user.query';
import {
  type EditProfileFormValues,
  editProfileSchema,
} from '@/schemas/profile.schema';

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
  const ageValues = React.useMemo(() => buildRange(10, 100), []);
  const heightValues = React.useMemo(() => buildRange(80, 200), []);
  const weightValues = React.useMemo(() => buildRange(20, 150), []);

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
      age: userInfor?.age ?? 25,
      height: userInfor?.height ?? 170,
      weight: userInfor?.weight ?? 65,
    },
  });

  React.useEffect(() => {
    if (!userInfor) return;

    reset(
      {
        name: userInfor.name ?? '',
        age: userInfor.age ?? 25,
        height: userInfor.height ?? 170,
        weight: userInfor.weight ?? 65,
      },
      { keepDirtyValues: true }
    );
  }, [reset, userInfor]);

  const onSubmit = handleSubmit(async (values) => {
    await updateMe(values);
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
              name="age"
              label="Tuổi"
              values={ageValues}
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
              loading={isSubmitting}
              className="bg-primary "
              disabled={!isValid || isSubmitting}
              onPress={onSubmit}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
