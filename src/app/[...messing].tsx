import { Link, Stack } from 'expo-router';

import { Text, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="mb-4 text-2xl font-bold">Không có trang này.</Text>

        <Link href={ROUTE.TAB.HOME} className="mt-4">
          <Text className="text-blue-500 underline">
            Quay về trang chủ! {ROUTE.TAB.HOME}
          </Text>
        </Link>
      </View>
    </>
  );
}
