import { useCallback, useMemo, useState } from 'react';
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
import type { Servicio } from '../../api/servicio';
import { getCategoriaVisual } from '../../utils/categoriaVisual';
import { promedioPorServicio } from '../../utils/promedioResenas';
import { colors, spacing } from '../../styles/theme';
import { styles } from '../../styles/UsuarioInicio.styles';

export default function InicioScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { foto } = useFotoPerfil();
  const { esFavorito, toggleFavorito } = useFavoritos();
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

  const nombreCorto = user?.nombre?.split(' ')[0] ?? 'viajero';
  const inicial = (user?.nombre?.trim()?.[0] || user?.email?.[0] || '?').toUpperCase();

  const categoriaDe = useCallback(
    (s: Servicio) => categoriasPorId[s.categoria_id],
    [categoriasPorId],
  );
  const promedioDe = useCallback((id: string) => notas[id]?.promedio, [notas]);

  const like = useCallback(
    (s: Servicio) => {
      if (!esFavorito(s._id)) void toggleFavorito(s._id);
      setDescartados((prev) => [...prev, s._id]);
    },
    [esFavorito, toggleFavorito],
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
      <View style={[styles.screen, { paddingTop: insets.top + spacing.md, padding: spacing.lg, gap: spacing.lg }]}>
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
      <View style={[styles.screen, { paddingTop: insets.top + spacing.xl, padding: spacing.lg }]}>
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
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <View style={{ gap: spacing.lg }}>
              <TarjetaSaludo
                titulo={`Hola, ${nombreCorto}`}
                subtitulo="Descubre un parche en Caldas"
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
        onClose={() => setSeleccionado(null)}
        onDejarResena={() => setResenando(true)}
      />
      <ServicioReviewModal
        visible={resenando}
        servicio={seleccionado}
        onClose={() => setResenando(false)}
      />
    </View>
  );
}
