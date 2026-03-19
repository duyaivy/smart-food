import { useRouter } from 'expo-router';
import React from 'react';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';
import { useAuth } from '@/lib';
import useAuthStore from '@/lib/stores/use-auth-store';

export default function Login() {
  const router = useRouter();
  const signIn = useAuth.use.signIn();
  const { setAuthenticated } = useAuthStore();
  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    signIn({ access: 'access-token', refresh: 'refresh-token' });
    setAuthenticated({
      name: data.name || 'name',
      email: data.email,
      password: data.password,
      isAuthenticated: true,
    });
    router.push('/');
  };
  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} />
    </>
  );
}
