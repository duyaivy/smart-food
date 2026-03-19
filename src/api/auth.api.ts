import request from './common/axios.config';

export type MyProfile = {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
};

export type UpdateMyProfileInput = {
  name: string;
  email: string;
  age: number;
  heightCm: number;
  weightKg: number;
};

const URL_MY_PROFILE = '/users/me';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function mapMyProfile(data: unknown): MyProfile {
  if (!isRecord(data)) {
    return {
      name: '',
      email: '',
      age: 0,
      heightCm: 0,
      weightKg: 0,
    };
  }

  const name = readString(data.name, '');
  const email = readString(data.email, '');
  const age = readNumber(data.age, 0);

  const heightCm = readNumber(
    data.heightCm ?? data.height ?? data.height_cm,
    0
  );
  const weightKg = readNumber(
    data.weightKg ?? data.weight ?? data.weight_kg,
    0
  );

  return { name, email, age, heightCm, weightKg };
}

export async function getMyProfile(): Promise<MyProfile> {
  const response = await request.get(URL_MY_PROFILE);
  return mapMyProfile(response.data);
}

export async function updateMyProfile(
  input: UpdateMyProfileInput
): Promise<MyProfile> {
  const payload = {
    name: input.name,
    email: input.email,
    age: input.age,
    heightCm: input.heightCm,
    weightKg: input.weightKg,
  };

  const response = await request.put(URL_MY_PROFILE, payload);
  return mapMyProfile(response.data);
}
