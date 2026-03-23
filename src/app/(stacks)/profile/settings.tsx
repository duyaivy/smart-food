import { Env } from '@env';
import { useRouter } from 'expo-router';

import { Item } from '@/components/settings/item';
import { ItemsContainer } from '@/components/settings/items-container';
import { LanguageItem } from '@/components/settings/language-item';
import { ThemeItem } from '@/components/settings/theme-item';
import { FocusAwareStatusBar, ScrollView, View } from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { useAuth } from '@/lib';

export default function SettingsScreen() {
  const router = useRouter();
  const signOut = useAuth.use.signOut();
  return (
    <>
      <FocusAwareStatusBar />
      <ScrollView>
        <View className="flex-1 px-4 pt-6">
          <ItemsContainer title="settings.generale">
            <LanguageItem />
            <ThemeItem />
          </ItemsContainer>

          <ItemsContainer title="settings.about">
            <Item text="settings.app_name" value={Env.NAME} />
            <Item text="settings.version" value={Env.VERSION} />
          </ItemsContainer>

          <ItemsContainer title="settings.links">
            <Item
              text="settings.privacy"
              onPress={() => router.push(ROUTE.STACK.PROFILE.PRIVACY)}
            />
            <Item
              text="settings.terms"
              onPress={() => router.push(ROUTE.STACK.PROFILE.PRIVACY)}
            />
          </ItemsContainer>

          <View className="my-8">
            <ItemsContainer>
              <Item text="settings.logout" onPress={signOut} />
            </ItemsContainer>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
