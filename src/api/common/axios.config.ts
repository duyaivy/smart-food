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

// NOTE: Repo hiện chưa có constants auth URL; giữ cấu trúc logic cũ bằng default path.
// Nếu backend khác path, chỉ cần update các hằng số này.
const URL_LOGIN = '/login';
const URL_SIGNUP = '/signup';
const URL_LOGOUT = '/logout';
const URL_SESSION_ACCESS_TOKEN = '/session/access-token';

function isAxiosUnauthorizedError(error: AxiosError) {
  return error.response?.status === 401;
}

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string
) {
  if (!config.headers) return;
  const value = `Bearer ${token}`;

  // Axios v1 có thể dùng AxiosHeaders instance
  const headers = config.headers as unknown as {
    set?: (key: string, value: string) => void;
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

function extractTokenPair(data: unknown): TokenType | null {
  if (!data || typeof data !== 'object') return null;

  const record = data as Record<string, unknown>;

  // { accessToken: { accessToken: string, refreshToken: string } }
  const accessTokenContainer = record.accessToken;
  if (accessTokenContainer && typeof accessTokenContainer === 'object') {
    const inner = accessTokenContainer as Record<string, unknown>;
    const access = inner.accessToken;
    const refresh = inner.refreshToken;
    if (typeof access === 'string' && typeof refresh === 'string') {
      return { access, refresh };
    }
  }

  // { accessToken: string, refreshToken: string }
  if (
    typeof record.accessToken === 'string' &&
    typeof record.refreshToken === 'string'
  ) {
    return { access: record.accessToken, refresh: record.refreshToken };
  }

  // { access: string, refresh: string }
  if (typeof record.access === 'string' && typeof record.refresh === 'string') {
    return { access: record.access, refresh: record.refresh };
  }

  return null;
}

function extractAccessToken(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const record = data as Record<string, unknown>;
  if (typeof record.access_token === 'string') return record.access_token;
  if (typeof record.accessToken === 'string') return record.accessToken;
  return null;
}

function syncTokensToStores(tokens: TokenType) {
  signIn(tokens);
}

function clearAuthAndRedirectToLogin() {
  signOut();
  router.replace(ROUTE.AUTH.LOGIN);
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
      baseURL: `${serverUrl}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.refreshInstance = axios.create({
      baseURL: `${serverUrl}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.instance.interceptors.request.use(
      (config) => {
        const tokens = getTokenFromState();
        this.token = tokens?.access ?? '';
        this.refreshToken = tokens?.refresh ?? '';
        if (this.token && config.headers) {
          setAuthorizationHeader(config, this.token);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
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
        } else if (url === URL_SESSION_ACCESS_TOKEN) {
          const accessToken = extractAccessToken(response.data);
          if (accessToken) {
            this.token = accessToken;
            const tokens = getTokenFromState();
            const refresh = tokens?.refresh ?? this.refreshToken;
            if (refresh) syncTokensToStores({ access: accessToken, refresh });
          }
        }
        return response;
      },
      (error: AxiosError) => {
        // Unauthorized (401) has many cases
        // - Token is not correct
        // - Token is not passed
        // - Token is expired

        // If 401
        if (isAxiosUnauthorizedError(error)) {
          const config = error.config as RequestConfigWithRetry | undefined;
          if (!config) {
            clearAuthAndRedirectToLogin();
            return Promise.reject(error);
          }

          // tránh loop: request refresh cũng 401 thì logout luôn
          if (config.url === URL_SESSION_ACCESS_TOKEN) {
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

        return Promise.reject(error);
      }
    );
  }

  private handleRefreshToken(): Promise<TokenType> {
    const tokens = getTokenFromState();
    const refresh = tokens?.refresh ?? this.refreshToken;
    if (!refresh) return Promise.reject(new Error('Missing refresh token'));

    // payload generic; backend có thể khác, nhưng vẫn giữ được flow retry/clear
    return this.refreshInstance
      .post(URL_SESSION_ACCESS_TOKEN, { refreshToken: refresh })
      .then((response) => {
        const nextTokens = extractTokenPair(response.data);
        if (nextTokens) return nextTokens;

        const accessToken = extractAccessToken(response.data);
        if (accessToken) return { access: accessToken, refresh };

        return Promise.reject(new Error('Invalid refresh token response'));
      });
  }
}

const request = new Http().instance;
export default request;
