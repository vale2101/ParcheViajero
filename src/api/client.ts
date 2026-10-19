
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'http://192.168.0.102:3000/api';

const TOKEN_KEY = 'parche_viajero_token';

let token: string | null = null;

export async function setToken(value: string | null): Promise<void> {
  token = value;

  if (value === null) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, value);
  }
}

async function getToken(): Promise<string | null> {
  if (token !== null) {
    return token;
  }

  token = await AsyncStorage.getItem(TOKEN_KEY);
  return token;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function request<T>(
  path: string,
  body?: unknown,
  method?: HttpMethod,
): Promise<T> {
  const serializedBody =
    body === undefined ? undefined : JSON.stringify(body);

  const finalMethod =
    method ?? (serializedBody === undefined ? 'GET' : 'POST');

  const savedToken = await getToken();

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: finalMethod,
      headers: {
        'Content-Type': 'application/json',
        ...(savedToken
          ? { Authorization: `Bearer ${savedToken}` }
          : {}),
      },
      body: serializedBody,
    });
  } catch {
    throw new Error(
      `No se pudo conectar con ${API_URL}. ¿Está encendido el servidor?`,
    );
  }

  const data = (await response.json().catch(() => ({}))) as Record<
    string,
    unknown
  >;

  if (!response.ok) {
    let message: string | null = null;

    if (typeof data['message'] === 'string') {
      message = data['message'];
    } else if (typeof data['error'] === 'string') {
      message = data['error'];
    } else if (
      Array.isArray(data['error']) &&
      data['error'].every((item) => typeof item === 'string')
    ) {
      message = (data['error'] as string[]).join('\n');
    }

    throw new Error(
      message ?? `Error ${response.status} al llamar ${path}`,
    );
  }

  return data as T;
}
