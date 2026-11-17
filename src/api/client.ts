import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetch as expoFetch } from 'expo/fetch';
import { Platform } from 'react-native';
import {
  ErrorSesionExpirada,
  esMensajeTecnico,
  logError,
  MENSAJE_ERROR_ACCION,
  MENSAJE_ERROR_BASE,
  MENSAJE_ERROR_CONEXION,
} from '../utils/errorApp';

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'https://parcheviajero.onrender.com/api';

const TOKEN_KEY = 'parche_viajero_token';

let token: string | null = null;
let onSesionExpirada: (() => Promise<void> | void) | null = null;
let cierrePor401EnCurso = false;

export function setOnSesionExpirada(
  handler: (() => Promise<void> | void) | null,
): void {
  onSesionExpirada = handler;
}

function esRutaSinCerrarSesion(path: string): boolean {
  return (
    path.includes('/usuarios/login') ||
    path.includes('/usuarios/createUsuario') ||
    path.includes('/usuarios/logout')
  );
}

async function manejar401(path: string, teniaToken: boolean): Promise<void> {
  if (esRutaSinCerrarSesion(path) || !teniaToken || cierrePor401EnCurso) {
    return;
  }

  cierrePor401EnCurso = true;
  try {
    await onSesionExpirada?.();
  } catch (err) {
    logError('No se pudo cerrar la sesión expirada', err);
  }
}

function mensajeHttp(data: Record<string, unknown>): string | null {
  if (typeof data['message'] === 'string') {
    return data['message'];
  }
  if (typeof data['error'] === 'string') {
    return data['error'];
  }
  if (
    Array.isArray(data['error']) &&
    data['error'].every((item) => typeof item === 'string')
  ) {
    return (data['error'] as string[]).join('\n');
  }
  return null;
}

export async function requestForm<T>(path: string, form: FormData): Promise<T> {
  const savedToken = await getToken();

  let response: Response;
  const enviar = Platform.OS === 'web' ? fetch : expoFetch;
  try {
    response = await enviar(`${API_URL}${path}`, {
      method: 'POST',
      headers: savedToken ? { Authorization: `Bearer ${savedToken}` } : {},
      body: form,
    });
  } catch (err) {
    logError(`No se pudo subir archivos a ${API_URL}${path}`, err);
    throw new Error(MENSAJE_ERROR_CONEXION);
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    throw await errorDesdeRespuesta(path, response.status, data, !!savedToken);
  }

  return data as T;
}

export async function setToken(value: string | null): Promise<void> {
  token = value;

  if (value === null) {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } else {
    cierrePor401EnCurso = false;
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
    throw await errorDesdeRespuesta(
      path,
      response.status,
      data,
      !!savedToken,
    );
  }

  return data as T;
}

async function errorDesdeRespuesta(
  path: string,
  status: number,
  data: Record<string, unknown>,
  teniaToken: boolean,
): Promise<Error> {
  const message = mensajeHttp(data);
  const esLogout = path.includes('/usuarios/logout');
  const esLoginORegistro =
    path.includes('/usuarios/login') || path.includes('/usuarios/createUsuario');

  if (status === 401 && !esLoginORegistro && !esLogout) {
    await manejar401(path, teniaToken);
    return new ErrorSesionExpirada();
  }

  const silenciar401Publico =
    status === 401 &&
    esLoginORegistro &&
    typeof message === 'string' &&
    /no autenticad/i.test(message);

  if (!silenciar401Publico) {
    logError(`Error ${status} en ${path}`, data);
  }

  if (status >= 500) {
    return new Error(MENSAJE_ERROR_BASE);
  }

  if (status === 401 && esLoginORegistro) {
    if (message && !esMensajeTecnico(message)) {
      return new Error(message);
    }
    return new Error(
      'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
    );
  }

  if (status === 403) {
    if (message && !esMensajeTecnico(message)) {
      return new Error(message);
    }
    return new Error(
      teniaToken
        ? 'No tienes permiso para esta acción.'
        : 'No se pudo iniciar sesión. Verifica tus datos e inténtalo de nuevo.',
    );
  }

  return new Error(
    message && !esMensajeTecnico(message) ? message : MENSAJE_ERROR_ACCION,
  );
}
