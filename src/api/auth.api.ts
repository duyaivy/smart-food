import request from './common/axios.config';

export type ApiSuccessResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type AuthTokenItem = {
  token: string;
  expires: string | Date;
};

export type AuthTokens = {
  access: AuthTokenItem;
  refresh: AuthTokenItem;
};

export type AuthUser = {
  id: number;
  email: string;
  name: string;
  avatar?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  height?: number | null;
  weight?: number | null;
  age?: number | null;
};

export type AuthPayload = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type SignInInput = {
  email: string;
  password: string;
};

export type SignUpInput = {
  name: string;
  email: string;
  password: string;
  avatar?: string | null;
  height?: number | null;
  weight?: number | null;
  age?: number | null;
};

export type LogoutInput = {
  refreshToken: string;
};

export type RefreshTokenInput = {
  refreshToken: string;
};

export type ForgotPasswordInput = {
  email: string;
};

export type ResetPasswordInput = {
  token: string;
  password: string;
};

export type MyProfile = {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
  avatar?: string | null;
  role?: string;
  isEmailVerified?: boolean;
};

export type UpdateMyProfileInput = {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
};

const URL_MY_PROFILE = '/users/me';
const URL_LOGIN = 'v1/auth/login';
const URL_REGISTER = 'v1/auth/register';
const URL_LOGOUT = 'v1/auth/logout';
const URL_REFRESH_TOKENS = 'v1/auth/refresh-tokens';
const URL_FORGOT_PASSWORD = 'v1/auth/forgot-password';
const URL_RESET_PASSWORD = 'v1/auth/reset-password';
const URL_SEND_VERIFICATION_EMAIL = 'v1/auth/send-verification-email';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function readNullableString(value: unknown): string | null | undefined {
  if (typeof value === 'string') return value;
  if (value === null) return null;
  return undefined;
}

function readBoolean(value: unknown, fallback = false): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function unwrapResponseData<T>(responseData: unknown): T {
  if (isRecord(responseData) && 'data' in responseData) {
    return responseData.data as T;
  }
  return responseData as T;
}

function mapTokenItem(data: unknown): AuthTokenItem {
  if (!isRecord(data)) {
    return {
      token: '',
      expires: '',
    };
  }

  return {
    token: readString(data.token, ''),
    expires: readString(data.expires, ''),
  };
}

function mapAuthTokens(data: unknown): AuthTokens {
  if (!isRecord(data)) {
    return {
      access: { token: '', expires: '' },
      refresh: { token: '', expires: '' },
    };
  }

  return {
    access: mapTokenItem(data.access),
    refresh: mapTokenItem(data.refresh),
  };
}

function mapAuthUser(data: unknown): AuthUser {
  if (!isRecord(data)) {
    return {
      id: 0,
      email: '',
      name: '',
    };
  }

  return {
    id: readNumber(data.id, 0),
    email: readString(data.email, ''),
    name: readString(data.name, ''),
    avatar: readNullableString(data.avatar),
    role: readString(data.role, ''),
    isEmailVerified: readBoolean(data.isEmailVerified, false),
    createdAt: readString(data.createdAt, ''),
    updatedAt: readString(data.updatedAt, ''),
    height:
      data.height === null
        ? null
        : typeof data.height === 'undefined'
          ? undefined
          : readNumber(data.height, 0),
    weight:
      data.weight === null
        ? null
        : typeof data.weight === 'undefined'
          ? undefined
          : readNumber(data.weight, 0),
    age:
      data.age === null
        ? null
        : typeof data.age === 'undefined'
          ? undefined
          : readNumber(data.age, 0),
  };
}

function mapAuthPayload(data: unknown): AuthPayload {
  if (!isRecord(data)) {
    return {
      user: {
        id: 0,
        email: '',
        name: '',
      },
      tokens: {
        access: { token: '', expires: '' },
        refresh: { token: '', expires: '' },
      },
    };
  }

  return {
    user: mapAuthUser(data.user),
    tokens: mapAuthTokens(data.tokens),
  };
}

function mapMyProfile(data: unknown): MyProfile {
  if (!isRecord(data)) {
    return {
      name: '',
      email: '',
      age: 0,
      heightCm: 0,
      weightKg: 0,
      avatar: null,
      role: '',
      isEmailVerified: false,
    };
  }

  const name = readString(data.name, '');
  const email = readString(data.email, '');
  const age = readNumber(data.age, 0);

  const heightCm = readNumber(data.heightCm ?? data.height ?? data.height_cm, 0);
  const weightKg = readNumber(data.weightKg ?? data.weight ?? data.weight_kg, 0);

  return {
    name,
    email,
    age,
    heightCm,
    weightKg,
    avatar: readNullableString(data.avatar) ?? null,
    role: readString(data.role, ''),
    isEmailVerified: readBoolean(data.isEmailVerified, false),
  };
}

export async function signIn(input: SignInInput): Promise<AuthPayload> {
  const response = await request.post<ApiSuccessResponse<AuthPayload>>(URL_LOGIN, {
    email: input.email,
    password: input.password,
  });

  return mapAuthPayload(unwrapResponseData<AuthPayload>(response.data));
}

export async function signUp(input: SignUpInput): Promise<AuthPayload> {
  const response = await request.post<ApiSuccessResponse<AuthPayload>>(URL_REGISTER, {
    name: input.name,
    email: input.email,
    password: input.password,
    avatar: input.avatar ?? null,
    height: input.height ?? null,
    weight: input.weight ?? null,
    age: input.age ?? null,
  });

  return mapAuthPayload(unwrapResponseData<AuthPayload>(response.data));
}

export async function logout(input: LogoutInput): Promise<void> {
  await request.post<ApiSuccessResponse<null>>(URL_LOGOUT, {
    refreshToken: input.refreshToken,
  });
}

export async function refreshTokens(input: RefreshTokenInput): Promise<AuthTokens> {
  const response = await request.post<ApiSuccessResponse<AuthTokens>>(URL_REFRESH_TOKENS, {
    refreshToken: input.refreshToken,
  });

  return mapAuthTokens(unwrapResponseData<AuthTokens>(response.data));
}

export async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  await request.post<ApiSuccessResponse<null>>(URL_FORGOT_PASSWORD, {
    email: input.email,
  });
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await request.post<ApiSuccessResponse<null>>(URL_RESET_PASSWORD, {
    token: input.token,
    password: input.password,
  });
}

export async function sendVerificationEmail(): Promise<void> {
  await request.post<ApiSuccessResponse<null>>(URL_SEND_VERIFICATION_EMAIL);
}

export async function getMyProfile(): Promise<MyProfile> {
  const response = await request.get<ApiSuccessResponse<unknown>>(URL_MY_PROFILE);
  return mapMyProfile(unwrapResponseData<unknown>(response.data));
}

export async function updateMyProfile(input: UpdateMyProfileInput): Promise<MyProfile> {
  const payload = {
    name: input.name,
    email: input.email,
    age: input.age,
    height: input.heightCm,
    weight: input.weightKg,
  };

  const response = await request.put<ApiSuccessResponse<unknown>>(URL_MY_PROFILE, payload);
  return mapMyProfile(unwrapResponseData<unknown>(response.data));
}