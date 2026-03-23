import { useRouter } from 'expo-router';
import React from 'react';

import type { LoginFormProps } from '@/app/(stacks)/auth/login/login-form';
import { LoginForm } from '@/app/(stacks)/auth/login/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { ROUTE } from '@/constants/route';
import { useAuth } from '@/lib/auth';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const setUser = useAuth.use.setUser();
  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    signIn({ access: 'access-token', refresh: 'refresh-token' });
    setUser({ name: data.name || 'name', email: data.email });
    router.push(ROUTE.TAB.HOME);
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
