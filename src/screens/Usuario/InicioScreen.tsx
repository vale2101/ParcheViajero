import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import Chip from '../../components/Chip';
import EmptyState from '../../components/EmptyState';
import EntradaPantalla from '../../components/EntradaPantalla';
import HojaMunicipio from '../../components/HojaMunicipio';
import SectionTitle from '../../components/SectionTitle';
import TarjetaSaludo from '../../components/TarjetaSaludo';
import ServicioMiniCard from '../../components/ServicioMiniCard';
import ServicioResenaModal from '../../components/ServicioResenaModal';
import ServicioReviewModal from '../../components/ServicioReviewModal';
import ServicioSwipeDeck from '../../components/ServicioSwipeDeck';
import { SkeletonAvatar, SkeletonCard, SkeletonText } from '../../components/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useFavoritos } from '../../context/FavoritosContext';
import { useFotoPerfil } from '../../hooks/useFotoPerfil';
import { useInicioViajero } from '../../hooks/useInicioViajero';
import { useUserLocation, type UserLocation } from '../../hooks/useUserLocation';
import type { Servicio } from '../../api/servicio';
import { getCategoriaVisual } from '../../utils/categoriaVisual';
import { nombreMunicipioCercano } from '../../utils/municipioCoords';
import { promedioPorServicio } from '../../utils/promedioResenas';
import { colors, spacing } from '../../styles/theme';
import { styles } from '../../styles/UsuarioInicio.styles';
import { useResponsive } from '../../hooks/useResponsive';

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  const { pad, maxContenido } = useResponsive();
  const router = useRouter();
  const { user, isGuest } = useAuth();
  const { foto } = useFotoPerfil();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const { obtenerUbicacion } = useUserLocation();
  const [coords, setCoords] = useState<UserLocation | null>(null);
  const { servicios, categorias, municipios, resenas, cargando, error, recargar } =
    useInicioViajero();

  const [query, setQuery] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [hojaMunicipio, setHojaMunicipio] = useState(false);
  const [descartados, setDescartados] = useState<string[]>([]);
  const [seleccionado, setSeleccionado] = useState<Servicio | null>(null);
  const [resenando, setResenando] = useState(false);

  const categoriasPorId = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c._id, c.nombre])),
    [categorias],
  );
  const notas = useMemo(() => promedioPorServicio(resenas), [resenas]);

  const filtrados = useMemo(() => {
    const q = query.trim().toLowerCase();
    return servicios.filter((s) => {
      if (descartados.includes(s._id)) return false;
      if (categoriaId && s.categoria_id !== categoriaId) return false;
      if (municipioId && s.municipio_id !== municipioId) return false;
      if (q && !s.nombre.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [servicios, descartados, categoriaId, municipioId, query]);

  const populares = useMemo(() => {
    return [...servicios]
      .filter((s) => {
        if (!notas[s._id]) return false;
        if (categoriaId && s.categoria_id !== categoriaId) return false;
        if (municipioId && s.municipio_id !== municipioId) return false;
        return true;
      })
      .sort((a, b) => (notas[b._id]?.promedio ?? 0) - (notas[a._id]?.promedio ?? 0))
      .slice(0, 8);
  }, [servicios, notas, categoriaId, municipioId]);

  const municipioNombre = municipios.find((m) => m._id === municipioId)?.nombre;

  useEffect(() => {
    let activo = true;
    void obtenerUbicacion().then((ubicacion) => {
      if (activo) setCoords(ubicacion);
    });
    return () => {
      activo = false;
    };
  }, [obtenerUbicacion]);

  const lugarActual = useMemo(() => {
    if (!coords) return null;
    const clave = nombreMunicipioCercano(coords.lat, coords.lng);
    if (!clave) return null;
    const plano = (texto: string) =>
      texto.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const oficial = municipios.find((m) => plano(m.nombre) === plano(clave))?.nombre;
    return oficial ?? clave.charAt(0).toUpperCase() + clave.slice(1);
  }, [coords, municipios]);

  const subtitulo = lugarActual
    ? `Descubre un parche en ${lugarActual}`
    : 'Descubre un parche cerca de ti';

  const nombreCorto = user?.nombre?.split(' ')[0] ?? 'viajero';
  const inicial = (user?.nombre?.trim()?.[0] || user?.email?.[0] || '?').toUpperCase();

  const categoriaDe = useCallback(
    (s: Servicio) => categoriasPorId[s.categoria_id],
    [categoriasPorId],
  );
  const promedioDe = useCallback((id: string) => notas[id]?.promedio, [notas]);

  const like = useCallback(
    (s: Servicio) => {
      if (!isGuest && !esFavorito(s._id)) void toggleFavorito(s._id);
      setDescartados((prev) => [...prev, s._id]);
    },
    [esFavorito, isGuest, toggleFavorito],
  );

  const dislike = useCallback(
    (s: Servicio) => {
      if (esFavorito(s._id)) void toggleFavorito(s._id);
      setDescartados((prev) => [...prev, s._id]);
    },
    [esFavorito, toggleFavorito],
  );

  if (cargando) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + spacing.md, padding: pad, gap: spacing.lg, maxWidth: maxContenido, alignSelf: 'center', width: '100%' }]}>
        <View style={styles.saludoFila}>
          <SkeletonAvatar />
          <View style={{ flex: 1, gap: spacing.sm }}>
            <SkeletonText width="50%" height={22} />
            <SkeletonText width="70%" height={14} />
          </View>
        </View>
        <SkeletonText width="100%" height={44} />
        <SkeletonCard alto={240} />
        <SkeletonCard alto={110} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top + spacing.xl, padding: pad, maxWidth: maxContenido, alignSelf: 'center', width: '100%' }]}>
        <View style={styles.errorCaja}>
          <Text style={styles.errorTexto}>{error}</Text>
          <Button text="Reintentar" onPress={() => void recargar()} secondary />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <EntradaPantalla>
        <FlatList
          data={[]}
          renderItem={() => null}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={[styles.lista, { paddingHorizontal: pad, maxWidth: maxContenido, alignSelf: 'center', width: '100%' }]}
          ListHeaderComponent={
            <View style={{ gap: spacing.lg }}>
              <TarjetaSaludo
                titulo={`Hola, ${nombreCorto}`}
                subtitulo={subtitulo}
                izquierda={
                  <View style={styles.avatar}>
                    {foto ? (
                      <Image source={{ uri: foto }} style={styles.avatarImg} />
                    ) : (
                      <Text style={styles.avatarLetra}>{inicial}</Text>
                    )}
                  </View>
                }
              />

              <View style={styles.buscador}>
                <Ionicons name="search" size={18} color={colors.textoSec} />
                <TextInput
                  style={styles.buscadorInput}
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Busca un lugar"
                  placeholderTextColor={colors.placeholder}
                  returnKeyType="search"
                  accessibilityLabel="Busca un lugar"
                />
              </View>

              <FlatList
                horizontal
                data={categorias}
                keyExtractor={(c) => c._id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsFila}
                ListHeaderComponent={
                  <Chip label="Todas" active={!categoriaId} onPress={() => setCategoriaId(null)} />
                }
                ListFooterComponent={
                  <Chip
                    label={municipioNombre ? `📍 ${municipioNombre}` : '📍 Municipio'}
                    active={!!municipioId}
                    onPress={() => setHojaMunicipio(true)}
                  />
                }
                renderItem={({ item }) => {
                  const visual = getCategoriaVisual(item.nombre);
                  return (
                    <Chip
                      label={`${visual.emoji} ${item.nombre}`}
                      active={categoriaId === item._id}
                      onPress={() =>
                        setCategoriaId(categoriaId === item._id ? null : item._id)
                      }
                    />
                  );
                }}
              />

              <ServicioSwipeDeck
                servicios={filtrados}
                categoriaDe={categoriaDe}
                promedioDe={promedioDe}
                esFavorito={esFavorito}
                mostrarAcciones={!isGuest}
                onLike={like}
                onDescartar={dislike}
                onAbrir={setSeleccionado}
                onReiniciar={() => setDescartados([])}
                onExplorarMapa={() => router.push('/usuario/mapa')}
              />

              <SectionTitle titulo="Populares" onVerTodo={() => router.push('/usuario/mapa')} />

              {populares.length === 0 ? (
                <EmptyState mensaje="Aún no hay lugares con reseñas." />
              ) : (
                <FlatList
                  horizontal
                  data={populares}
                  keyExtractor={(item) => item._id}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: spacing.md }}
                  renderItem={({ item }) => (
                    <ServicioMiniCard
                      servicio={item}
                      categoria={categoriaDe(item)}
                      promedio={promedioDe(item._id)}
                      onPress={() => setSeleccionado(item)}
                    />
                  )}
                />
              )}
            </View>
          }
        />
      </EntradaPantalla>

      <HojaMunicipio
        visible={hojaMunicipio}
        municipios={municipios}
        seleccionadoId={municipioId}
        onCerrar={() => setHojaMunicipio(false)}
        onElegir={(id) => {
          setMunicipioId(id);
          setHojaMunicipio(false);
        }}
      />

      <ServicioResenaModal
        visible={!!seleccionado && !resenando}
        servicio={seleccionado}
        categorias={categorias}
        municipios={municipios}
        mostrarAccionResena={!isGuest}
        onClose={() => setSeleccionado(null)}
        onDejarResena={() => {
          if (user && !isGuest) setResenando(true);
        }}
      />
      <ServicioReviewModal
        visible={resenando}
        servicio={seleccionado}
        puedeEnviar={!isGuest}
        onClose={() => setResenando(false)}
      />
    </View>
  );
}
