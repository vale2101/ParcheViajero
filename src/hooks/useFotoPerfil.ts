import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export function useFotoPerfil() {
  const { user } = useAuth();
  const [foto, setFoto] = useState<string | null>(null);

  const clave = user ? `foto_${user._id}` : null;

  // Cargar la foto guardada de este usuario
  useEffect(() => {
    if (!clave) return;

    AsyncStorage.getItem(clave)
      .then((uri) => setFoto(uri))
      .catch(() => setFoto(null));
  }, [clave]);

  async function cambiarFoto() {
    if (!clave) return;

    // Pedir permiso para entrar a la galería
    const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permiso.granted) return;

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (resultado.canceled) return;

    const uri = resultado.assets[0].uri;
    setFoto(uri);
    await AsyncStorage.setItem(clave, uri);
  }

  return { foto, cambiarFoto };
}
