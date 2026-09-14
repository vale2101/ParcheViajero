const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';

let token: string | null = null;

export function setToken(value: string | null): void {
  token = value;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * @param path 
 * @param body 
 * @param method 
 */
export async function request<T>(
  path: string,
  body?: unknown,
  method?: HttpMethod,
): Promise<T> {
  const serializedBody = body === undefined ? undefined : JSON.stringify(body);
  const finalMethod = method ?? (serializedBody === undefined ? 'GET' : 'POST');

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: finalMethod,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: serializedBody,
    });
  } catch {
    throw new Error(`No se pudo conectar con ${API_URL}. ¿Está encendido el servidor?`);
  }

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    let message: string | null = null;

    if (typeof data['message'] === 'string') {
      message = data['message'];
    } else if (typeof data['error'] === 'string') {
      message = data['error'];
    } else if (Array.isArray(data['error']) && data['error'].every((e) => typeof e === 'string')) {
      message = (data['error'] as string[]).join('\n');
    }

    throw new Error(message ?? `Error ${response.status} al llamar ${path}`);
  }

  return data as T;
}