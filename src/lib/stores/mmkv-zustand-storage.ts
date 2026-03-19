import type { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export function createMmkvZustandStorage(mmkv: MMKV): StateStorage {
  return {
    getItem: (name) => mmkv.getString(name) ?? null,
    setItem: (name, value) => {
      mmkv.set(name, value);
    },
    removeItem: (name) => {
      mmkv.delete(name);
    },
  };
}
