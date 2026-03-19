import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  name: string;
  email: string;
  password: string;
  accessToken: string;
  refreshToken: string;

  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearAuth: () => void;
  setAuthenticated: (payload: {
    name: string;
    email: string;
    password: string;
    isAuthenticated: boolean;
  }) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      name: '',
      email: '',
      password: '',
      accessToken: '',
      refreshToken: '',
      setAuthenticated: ({ name, email, password, isAuthenticated }) =>
        set({ name, email, password, isAuthenticated }),
      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      clearAuth: () =>
        set({
          isAuthenticated: false,
          name: '',
          email: '',
          password: '',
          accessToken: '',
          refreshToken: '',
        }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
