import { Redirect } from 'expo-router';
import React from 'react';

import { ROUTE } from '@/constants/route';
import { useAuth, useIsFirstTime } from '@/lib';

export default function Index() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  if (isFirstTime) {
    return <Redirect href={ROUTE.AUTH.ONBOARDING} />;
  }

  if (status === 'signOut') {
    return <Redirect href={ROUTE.AUTH.SIGNIN} />;
  }

  return <Redirect href={ROUTE.TAB.HOME} />;
}
