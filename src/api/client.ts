import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  esMensajeTecnico,
  logError,
  MENSAJE_ERROR_ACCION,
  MENSAJE_ERROR_BASE,
  MENSAJE_ERROR_CONEXION,
  MENSAJE_ERROR_SESION,
} from '../utils/errorApp';

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

export async function getStoredToken(): Promise<string | null> {
  return getToken();
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
  } catch (err) {
    logError(`No se pudo conectar con ${API_URL}${path}`, err);
    throw new Error(MENSAJE_ERROR_CONEXION);
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

    const sinSesion =
      response.status === 401 &&
      typeof message === 'string' &&
      /no autenticad/i.test(message);

    if (!sinSesion) {
      logError(`Error ${response.status} en ${finalMethod} ${path}`, data);
    }

    if (response.status >= 500) {
      throw new Error(MENSAJE_ERROR_BASE);
    }

    if (response.status === 401 || response.status === 403) {
      if (message && !esMensajeTecnico(message)) {
        throw new Error(message);
      }

      throw new Error(
        savedToken
          ? MENSAJE_ERROR_SESION
          : 'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
      );
    }

    throw new Error(
      message && !esMensajeTecnico(message)
        ? message
        : MENSAJE_ERROR_ACCION,
    );
  }

  return data as T;
}
