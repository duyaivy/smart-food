import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { type IUser } from '@/models/interfaces/user';

import { getToken, removeToken, type TokenType } from './utils';

export type AuthStatus = 'idle' | 'signOut' | 'signIn';

export type AuthUser = {
  name: string;
  email: string;
};

export type AuthState = {
  token: TokenType | null;
  user: AuthUser | null;
  status: AuthStatus;
  userInfor: IUser | null;

  setUserInfor: (userInfor: IUser) => void;
  signIn: (token: TokenType) => void;
  signOut: () => void;
  setUser: (user: AuthUser | null) => void;
  updateUser: (patch: Partial<AuthUser>) => void;
  hydrate: () => void;
};

const mmkvStateStorage = createMmkvZustandStorage(storage);

const _useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      status: 'idle',
      token: null,
      user: null,
      userInfor: null,
      signIn: (token) => {
        set({ status: 'signIn', token });
      },
      setUserInfor: (userInfor) => {
        set({ userInfor });
      },

      signOut: () => {
        set({ status: 'signOut', token: null, user: null });

        // legacy cleanup (older code persisted token under the `token` key)
        removeToken();
      },

      setUser: (user) => {
        set({ user });
      },

      updateUser: (patch) => {
        set((state) => {
          const nextUser = state.user
            ? { ...state.user, ...patch }
            : {
                name: patch.name ?? '',
                email: patch.email ?? '',
              };

          return { user: nextUser };
        });
      },

      hydrate: () => {
        const persistedToken = get().token;
        if (persistedToken) {
          set({ status: 'signIn' });
          removeToken();
          return;
        }

        const legacyToken = getToken();
        if (legacyToken) {
          set({ status: 'signIn', token: legacyToken });
          removeToken();
          return;
        }

        set({ status: 'signOut' });
      },
    }),
    {
      name: 'auth',
      version: 1,
      storage: createJSONStorage(() => mmkvStateStorage),
      partialize: ({ token, user }) => ({ token, user }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);

export const useAuth = createSelectors(_useAuth);
