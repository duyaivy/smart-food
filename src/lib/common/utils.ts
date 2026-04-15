import { type ClassValue, clsx } from 'clsx';
import { Linking } from 'react-native';
import { twMerge } from 'tailwind-merge';
import type { StoreApi, UseBoundStore } from 'zustand';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function openLinkInBrowser(url: string) {
  Linking.canOpenURL(url).then((canOpen) => canOpen && Linking.openURL(url));
}

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

type Params = Record<string, string | number | boolean | null | undefined>;

export function generatePath(
  path: string,
  pathParams: Params = {},
  queryParams: Params = {}
): string {
  let result = path;

  result = result.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    const value = pathParams[key];

    if (value === undefined || value === null) {
      throw new Error(`Missing parameter: ${key}`);
    }

    return encodeURIComponent(String(value));
  });

  result = result.replace(/\/+/g, '/');

  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${result}?${queryString}` : result;
}
