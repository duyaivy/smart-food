import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { storage } from '@/lib/common/storage';
import { createSelectors } from '@/lib/common/utils';
import { createMmkvZustandStorage } from '@/lib/stores/mmkv-zustand-storage';
import { type IUser } from '@/models/interfaces/user';

import { useLogoutMutation } from '../hooks/queries/auth.query';
import { getToken, removeToken, type TokenType } from './utils';

export type AuthStatus = 'idle' | 'signOut' | 'signIn';

export type AuthState = {
  token: TokenType | null;
  status: AuthStatus;
  userInfor: IUser | null;
  userInforUpdatedAt: number | null;

  setUserInfor: (userInfor: IUser | null, updatedAt?: number) => void;
  signIn: (token: TokenType) => void;
  signOut: () => void;
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
      userInforUpdatedAt: null,
      signIn: (token) => {
        set({ status: 'signIn', token });
      },
      setUserInfor: (userInfor, updatedAt) => {
        set({
          userInfor,
          userInforUpdatedAt: userInfor ? (updatedAt ?? Date.now()) : null,
        });
      },

      signOut: () => {
        set({
          status: 'signOut',
          token: null,
          userInfor: null,
          userInforUpdatedAt: null,
        });
        // legacy cleanup (older code persisted token under the `token` key)
        removeToken();
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
      partialize: ({ token, userInfor, userInforUpdatedAt }) => ({
        token,
        userInfor,
        userInforUpdatedAt,
      }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);

export const useAuth = createSelectors(_useAuth);
