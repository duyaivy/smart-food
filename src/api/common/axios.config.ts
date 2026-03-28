import { Env } from '@env';
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { router } from 'expo-router';

import { ROUTE } from '@/constants/route';
import { signIn, signOut, useAuth } from '@/lib/auth';
import type { TokenType } from '@/lib/auth/utils';

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_PREFIX = '/auth';

const URL_LOGIN = `${AUTH_PREFIX}/login`;
const URL_SIGNUP = `${AUTH_PREFIX}/register`;
const URL_LOGOUT = `${AUTH_PREFIX}/logout`;
const URL_REFRESH_TOKEN = `${AUTH_PREFIX}/refresh-tokens`;

function isAxiosUnauthorizedError(error: AxiosError) {
  return error.response?.status === 401;
}

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string
) {
  if (!config.headers) return;
  const value = `Bearer ${token}`;

  const headers = config.headers as unknown as {
    set?: (key: string, value: string) => void;
    Authorization?: string;
  };

  if (typeof headers.set === 'function') {
    headers.set('Authorization', value);
    return;
  }

  config.headers.Authorization = value;
}

function getTokenFromState(): TokenType | null {
  return useAuth.getState().token;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractErrorMessage(data: unknown): string {
  if (!isRecord(data)) return 'Có lỗi xảy ra';

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }

  if (isRecord(data.data) && typeof data.data.message === 'string') {
    return data.data.message;
  }

  return 'Có lỗi xảy ra';
}

function extractTokenPair(data: unknown): TokenType | null {
  if (!isRecord(data)) return null;

  // { code, message, data: { user, tokens: { access: { token }, refresh: { token } } } }
  if (isRecord(data.data) && isRecord(data.data.tokens)) {
    const tokens = data.data.tokens as Record<string, unknown>;
    const access = isRecord(tokens.access) ? tokens.access.token : undefined;
    const refresh = isRecord(tokens.refresh) ? tokens.refresh.token : undefined;

    if (typeof access === 'string' && typeof refresh === 'string') {
      return { access, refresh };
    }
  }

  // { data: { access: { token }, refresh: { token } } }
  if (isRecord(data.data)) {
    const inner = data.data as Record<string, unknown>;
    const access = isRecord(inner.access) ? inner.access.token : undefined;
    const refresh = isRecord(inner.refresh) ? inner.refresh.token : undefined;

    if (typeof access === 'string' && typeof refresh === 'string') {
      return { access, refresh };
    }
  }

  // { tokens: { access: { token }, refresh: { token } } }
  if (isRecord(data.tokens)) {
    const tokens = data.tokens as Record<string, unknown>;
    const access = isRecord(tokens.access) ? tokens.access.token : undefined;
    const refresh = isRecord(tokens.refresh) ? tokens.refresh.token : undefined;

    if (typeof access === 'string' && typeof refresh === 'string') {
      return { access, refresh };
    }
  }

  // { access: string, refresh: string }
  if (typeof data.access === 'string' && typeof data.refresh === 'string') {
    return {
      access: data.access,
      refresh: data.refresh,
    };
  }

  // { accessToken: string, refreshToken: string }
  if (
    typeof data.accessToken === 'string' &&
    typeof data.refreshToken === 'string'
  ) {
    return {
      access: data.accessToken,
      refresh: data.refreshToken,
    };
  }

  return null;
}

function extractAccessToken(data: unknown): string | null {
  if (!isRecord(data)) return null;

  // { data: { access: { token } } }
  if (isRecord(data.data)) {
    const inner = data.data as Record<string, unknown>;

    if (isRecord(inner.access) && typeof inner.access.token === 'string') {
      return inner.access.token;
    }

    if (typeof inner.accessToken === 'string') {
      return inner.accessToken;
    }

    if (typeof inner.access_token === 'string') {
      return inner.access_token;
    }
  }

  // { access: { token } }
  if (isRecord(data.access) && typeof data.access.token === 'string') {
    return data.access.token;
  }

  if (typeof data.accessToken === 'string') return data.accessToken;
  if (typeof data.access_token === 'string') return data.access_token;

  return null;
}

function syncTokensToStores(tokens: TokenType) {
  signIn(tokens);
}

function clearAuthAndRedirectToLogin() {
  signOut();
  router.replace(ROUTE.AUTH.SIGNIN);
}

export class Http {
  instance: AxiosInstance;
  private token: string;
  private refreshToken: string;
  private refreshTokenRequest: Promise<TokenType> | null;
  private refreshInstance: AxiosInstance;

  constructor(baseUrl?: string) {
    const serverUrl = baseUrl ?? Env.API_URL;
    const tokens = getTokenFromState();

    this.token = tokens?.access ?? '';
    this.refreshToken = tokens?.refresh ?? '';
    this.refreshTokenRequest = null;

    this.instance = axios.create({
      baseURL: serverUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.refreshInstance = axios.create({
      baseURL: serverUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const latestTokens = getTokenFromState();
        this.token = latestTokens?.access ?? '';
        this.refreshToken = latestTokens?.refresh ?? '';

        if (this.token && config.headers) {
          setAuthorizationHeader(config, this.token);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.instance.interceptors.response.use(
      (response) => {
        const url = response.config.url ?? '';

        if (url === URL_LOGIN || url === URL_SIGNUP) {
          const tokens = extractTokenPair(response.data);
          if (tokens) {
            this.token = tokens.access;
            this.refreshToken = tokens.refresh;
            syncTokensToStores(tokens);
          }
        } else if (url === URL_LOGOUT) {
          this.token = '';
          this.refreshToken = '';
          clearAuthAndRedirectToLogin();
        } else if (url === URL_REFRESH_TOKEN) {
          const tokens = extractTokenPair(response.data);

          if (tokens) {
            this.token = tokens.access;
            this.refreshToken = tokens.refresh;
            syncTokensToStores(tokens);
          } else {
            const accessToken = extractAccessToken(response.data);
            if (accessToken) {
              this.token = accessToken;
              const currentTokens = getTokenFromState();
              const refresh = currentTokens?.refresh ?? this.refreshToken;

              if (refresh) {
                syncTokensToStores({ access: accessToken, refresh });
              }
            }
          }
        }

        return response;
      },
      (error: AxiosError) => {
        if (isAxiosUnauthorizedError(error)) {
          const config = error.config as RequestConfigWithRetry | undefined;

          if (!config) {
            clearAuthAndRedirectToLogin();
            return Promise.reject(error);
          }

          // refresh request mà cũng 401 thì logout luôn
          if (config.url === URL_REFRESH_TOKEN) {
            clearAuthAndRedirectToLogin();
            return Promise.reject(error);
          }

          if (config._retry) {
            clearAuthAndRedirectToLogin();
            return Promise.reject(error);
          }

          config._retry = true;

          this.refreshTokenRequest = this.refreshTokenRequest
            ? this.refreshTokenRequest
            : this.handleRefreshToken().finally(() => {
                this.refreshTokenRequest = null;
              });

          return this.refreshTokenRequest
            .then((tokens) => {
              this.token = tokens.access;
              this.refreshToken = tokens.refresh;
              syncTokensToStores(tokens);
              setAuthorizationHeader(config, tokens.access);
              return this.instance(config);
            })
            .catch((refreshError) => {
              clearAuthAndRedirectToLogin();
              return Promise.reject(refreshError);
            });
        }

        const backendMessage = extractErrorMessage(error.response?.data);
        error.message = backendMessage || error.message || 'Có lỗi xảy ra';

        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken(): Promise<TokenType> {
    const tokens = getTokenFromState();
    const refresh = tokens?.refresh ?? this.refreshToken;

    if (!refresh) {
      return Promise.reject(new Error('Thiếu refresh token'));
    }

    return this.refreshInstance
      .post(URL_REFRESH_TOKEN, { refreshToken: refresh })
      .then((response) => {
        const nextTokens = extractTokenPair(response.data);
        if (nextTokens) {
          this.token = nextTokens.access;
          this.refreshToken = nextTokens.refresh;
          syncTokensToStores(nextTokens);
          return nextTokens;
        }

        const accessToken = extractAccessToken(response.data);
        if (accessToken) {
          const fallbackTokens = {
            access: accessToken,
            refresh,
          };

          this.token = fallbackTokens.access;
          this.refreshToken = fallbackTokens.refresh;
          syncTokensToStores(fallbackTokens);
          return fallbackTokens;
        }

        return Promise.reject(new Error('Response refresh token không hợp lệ'));
      });
  }
}

const request = new Http().instance;
export default request;