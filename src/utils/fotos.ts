import { Image } from 'expo-image';

export function prefetchFotos(
  urls: Array<string | undefined | null>,
  limite = 2,
): void {
  const unicas = [
    ...new Set(
      urls.filter(
        (u): u is string =>
          typeof u === 'string' && /^https?:\/\//i.test(u),
      ),
    ),
  ].slice(0, limite);

  if (unicas.length === 0) return;

  setTimeout(() => {
    void Image.prefetch(unicas, 'disk');
  }, 450);
}

export function urlsPortada(
  servicios: Array<{ imagenes?: Array<{ url_imagen?: string }> }>,
): string[] {
  return servicios
    .map((s) => s.imagenes?.[0]?.url_imagen)
    .filter((u): u is string => !!u);
}
