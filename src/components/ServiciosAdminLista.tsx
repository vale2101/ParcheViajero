import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../components/Button';
import AdminHeader from '../components/AdminHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import { eliminarServicioAdmin, type EstadoFiltro, type ServicioAdmin } from '../api/admin';
import { useAdmin } from '../context/AdminContext';
import { useAdminServicios } from '../hooks/useAdminServicios';
import { useCatalogosAdmin } from '../hooks/useCatalogosAdmin';
import { useEliminacionConfirmada } from '../hooks/useEliminacionConfirmada';
import FiltrosPanel from './FiltrosPanel';
import Segmented from './Segmented';
import SearchBar from './SearchBar';
import ServicioAdminCard from './ServicioAdminCard';
import { colors } from '../styles/theme';
import { styles } from '../styles/Admin.styles';

interface Props {
  titulo: string;
  subtitulo: string;
  tabs: { valor: EstadoFiltro; etiqueta: string }[];
  vacios: Partial<Record<EstadoFiltro, string>>;
}

export default function ServiciosAdminLista({ titulo, subtitulo, tabs, vacios }: Props) {
  const router = useRouter();
  const { estado: estadoParam, destino } = useLocalSearchParams<{ estado?: string; destino?: string }>();
  const destinoAplicado = useRef<string | undefined>(undefined);
  const [estado, setEstado] = useState<EstadoFiltro>(tabs[0]?.valor ?? 'todos');
  const [q, setQ] = useState('');
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [dias, setDias] = useState<number | null>(null);
  const [verFiltros, setVerFiltros] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const borrado = useEliminacionConfirmada<ServicioAdmin>();

  const { resumen, refrescar } = useAdmin();
  const { categorias, municipios } = useCatalogosAdmin();

  const { servicios, cargando, cargado, error, recargar, quitar } = useAdminServicios({
    estado,
    q,
    categoriaId,
    municipioId,
    dias,
  });

  const hayFiltros = !!q.trim() || !!categoriaId || !!municipioId || !!dias;

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  const estadosDisponibles = tabs.map((t) => t.valor).join(',');

  useEffect(() => {
    const marca = primerParam(destino);
    const pedido = primerParam(estadoParam);
    if (!marca || destinoAplicado.current === marca) return;
    if (!pedido || !estadosDisponibles.split(',').includes(pedido)) return;
    destinoAplicado.current = marca;
    setEstado(pedido as EstadoFiltro);
    setQ('');
    setCategoriaId(null);
    setMunicipioId(null);
    setDias(null);
  }, [destino, estadoParam, estadosDisponibles]);

  return (
    <View style={styles.screen}>
      <AdminHeader />

      <View style={[styles.wrap, styles.headerBox]}>
        <Text style={styles.title}>{titulo}</Text>
        <Text style={styles.subtitle}>{subtitulo}</Text>

        {tabs[0]?.valor === 'pendiente' && resumen ? (
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.doradoSuave,
                borderColor: colors.dorado,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.doradoTexto }]}>
              {resumen.pendientes} pendientes
            </Text>
          </View>
        ) : null}

        <Segmented valor={estado} opciones={tabs} onChange={setEstado} />

        <SearchBar
          value={q}
          onChange={setQ}
          placeholder="Buscar por servicio, negocio o municipio"
        />

        <Pressable
          style={styles.filterToggle}
          onPress={() => setVerFiltros((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: verFiltros }}
        >
          <Ionicons name="options-outline" size={20} color={colors.azul} />
          <Text style={styles.filterToggleText}>
            {verFiltros ? 'Ocultar filtros' : 'Filtros'}
          </Text>
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
            {!!aviso && (
              <View style={styles.okBox} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle" size={20} color={colors.verde} />
                <Text style={styles.okText}>{aviso}</Text>
              </View>
            )}
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
                <Ionicons
                  name="cloud-offline-outline"
                  size={22}
                  color={colors.rojo}
                />
                <Text style={styles.errorText}>{error}</Text>
                <Button
                  text="Volver a intentar"
                  onPress={recargar}
                  secondary
                />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          cargando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.azul} />
              <Text style={styles.centerText}>Cargando…</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons
                  name="checkmark-done-outline"
                  size={40}
                  color={colors.azul}
                />
              </View>

              <Text style={styles.emptyTitle}>
                {hayFiltros
                  ? 'No hay resultados con esos filtros'
                  : (vacios[estado] ?? 'No hay servicios')}
              </Text>
            </View>
          ) : undefined
        }
        renderItem={({ item }) => (
          <ServicioAdminCard
            servicio={item}
            ocupado={borrado.borrando}
            onPress={() => router.push(`/admin/servicio/${item._id}`)}
            onEliminar={() => borrado.pedir(item)}
          />
        )}
      />

      <ConfirmDialog
        visible={!!borrado.objetivo}
        titulo="Eliminar servicio"
        mensaje={`¿Estás seguro de que deseas eliminar «${borrado.objetivo?.nombre ?? 'este establecimiento'}»? Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar"
        cargando={borrado.borrando}
        error={borrado.error}
        onCancel={borrado.cancelar}
        onConfirm={() =>
          void borrado.confirmar(async (servicio) => {
            await eliminarServicioAdmin(servicio._id);
            quitar(servicio._id);
            setAviso('Servicio eliminado correctamente');
            void refrescar();
          })
        }
      />
    </View>
  );
}

function primerParam(valor: string | string[] | undefined): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}
