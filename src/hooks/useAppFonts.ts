import { useFonts, Fredoka_700Bold } from '@expo-google-fonts/fredoka';

export function useAppFonts(): boolean {
  const [loaded] = useFonts({
    Fredoka_700Bold,
  });

  return loaded;
}