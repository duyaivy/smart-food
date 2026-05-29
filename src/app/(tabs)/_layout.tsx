import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { type ComponentProps, useCallback, useEffect } from 'react';

import { CustomTabBar } from '@/components/ui/tab-bar/custom-tab-bar';
import { ROUTE } from '@/constants/route';
import { useAuth, useIsFirstTime } from '@/lib';
import { useGetMyDevicesQuery } from '@/lib/hooks/queries/iot.query';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  const isAuthenticated = status !== 'signOut' && status !== 'idle';

  useGetMyDevicesQuery({ enabled: isAuthenticated });

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
      tabBar={(props: ComponentProps<typeof CustomTabBar>) => (
        <CustomTabBar {...props} />
      )}
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
        name="recommendation/index"
        options={{
          title: 'Gợi ý',
          tabBarButtonTestID: 'recommendation-tab',
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
