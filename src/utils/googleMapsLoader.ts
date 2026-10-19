const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

let loading: Promise<void> | null = null;

export function loadGoogleMapsScript(): Promise<void> {
  if ((window as any).google?.maps) return Promise.resolve();

  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        reject(new Error('No se pudo cargar Google Maps'));
      };
      document.head.appendChild(script);
    });
  }

  return loading;
}