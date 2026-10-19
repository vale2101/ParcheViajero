import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import type { EstadoFiltro } from '../api/admin';
import { useAdminServicios } from '../hooks/useAdminServicios';
import { useCatalogosAdmin } from '../hooks/useCatalogosAdmin';
import FiltrosPanel from './FiltrosPanel';
import Segmented from './Segmented';
import SearchBar from './SearchBar';
import ServicioAdminCard from './ServicioAdminCard';
import { styles } from '../styles/Admin.styles';

interface Props {
  titulo: string;
  subtitulo: string;
  tabs: { valor: EstadoFiltro; etiqueta: string }[];
  vacios: Partial<Record<EstadoFiltro, string>>;
}

export default function ServiciosAdminLista({ titulo, subtitulo, tabs, vacios }: Props) {
  const router = useRouter();
  const [estado, setEstado] = useState<EstadoFiltro>(tabs[0]?.valor ?? 'todos');
  const [q, setQ] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [dias, setDias] = useState<number | null>(null);
  const [verFiltros, setVerFiltros] = useState(false);

  const { categorias, municipios } = useCatalogosAdmin();
  const { servicios, cargando, cargado, error, recargar } = useAdminServicios({
    estado,
    q,
    categoriaId,
    municipioId,
    dias,
  });

  const hayFiltros = !!q.trim() || !!categoriaId || !!municipioId || !!dias;

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <View style={[styles.wrap, styles.headerBox]}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.subtitle}>{subtitulo}</Text>
        <Segmented valor={estado} opciones={tabs} onChange={setEstado} />
        <SearchBar value={q} onChange={setQ} placeholder="Buscar por servicio, negocio o municipio" />
        <Pressable
          style={styles.filterToggle}
          onPress={() => setVerFiltros((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: verFiltros }}>
          <Ionicons name="options-outline" size={20} color="#0147B9" />
          <Text style={styles.filterToggleText}>{verFiltros ? 'Ocultar filtros' : 'Filtros'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={servicios}
        keyExtractor={(s) => s._id}
        contentContainerStyle={styles.content}
        refreshing={cargando && cargado}
        onRefresh={recargar}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            {verFiltros && (
              <FiltrosPanel
                categorias={categorias}
                municipios={municipios}
                categoriaId={categoriaId}
                municipioId={municipioId}
                dias={dias}
                onCategoria={setCategoriaId}
                onMunicipio={setMunicipioId}
                onDias={setDias}
              />
            )}
            {!!error && (
              <View style={styles.errorCard}>
                <Ionicons name="cloud-offline-outline" size={22} color="#dc2626" />
                <Text style={styles.errorText}>{error}</Text>
                <Button text="Volver a intentar" onPress={recargar} secondary />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          cargando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#0147B9" />
              <Text style={styles.centerText}>Cargando…</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="checkmark-done-outline" size={40} color="#0147B9" />
              </View>
              <Text style={styles.emptyTitle}>
                {hayFiltros ? 'No hay resultados con esos filtros' : (vacios[estado] ?? 'No hay servicios')}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <ServicioAdminCard servicio={item} onPress={() => router.push(`/admin/servicio/${item._id}`)} />
        )}
      />
    </View>
  );
}