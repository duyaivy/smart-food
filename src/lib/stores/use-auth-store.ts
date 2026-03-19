import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  name: string;
  email: string;
  password: string;
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
      setAuthenticated: ({ name, email, password, isAuthenticated }) =>
        set({ name, email, password, isAuthenticated }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
