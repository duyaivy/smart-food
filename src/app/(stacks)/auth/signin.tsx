import { SignInForm } from '@/app/(stacks)/auth/_components/sign-in-form';
import { ScrollView, View } from 'react-native';

export default function SignInScreen() {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerClassName="flex-1 items-center justify-center p-4 py-8  mt-safe"
      keyboardDismissMode="interactive"
    >
      <View className="w-full">
        <SignInForm />
      </View>
    </ScrollView>
  );
}
