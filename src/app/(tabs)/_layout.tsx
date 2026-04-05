import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { CustomTabBar } from '@/components/ui/tab-bar/custom-tab-bar';
import { ROUTE } from '@/constants/route';
import { useAuth, useIsFirstTime } from '@/lib';
export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 0);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href={ROUTE.AUTH.ONBOARDING} />;
  }
  if (status === 'signOut') {
    return <Redirect href={ROUTE.AUTH.SIGNIN} />;
  }

  return (
    <Tabs
      tabBar={(props: any) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarButtonTestID: 'home-tab',
        }}
      />

      <Tabs.Screen
        name="discover/index"
        options={{
          title: 'Discover',
          tabBarButtonTestID: 'discover-tab',
        }}
      />

      <Tabs.Screen
        name="cooking/index"
        options={{
          title: 'Cooking',
          tabBarButtonTestID: 'cooking-tab',
        }}
      />

      <Tabs.Screen
        name="fridge/index"
        options={{
          title: 'Fridge',
          tabBarButtonTestID: 'fridge-tab',
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarButtonTestID: 'profile-tab',
        }}
      />
    </Tabs>
  );
}
