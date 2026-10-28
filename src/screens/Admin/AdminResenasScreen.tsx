import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/Button';
import AdminSubHeader from '../../components/AdminSubHeader';
import ResenaAdminCard from '../../components/ResenaAdminCard';
import SearchBar from '../../components/SearchBar';
import ConfirmDialog from '../../components/ConfirmDialog';
import { eliminarResenaAdmin, type ResenaAdmin } from '../../api/admin';
import { useAdminResenas } from '../../hooks/useAdminResenas';
import { styles } from '../../styles/Admin.styles';

const FILTROS: { valor: number | null; etiqueta: string }[] = [
  { valor: null, etiqueta: 'Todas' },
  { valor: 5, etiqueta: '5 ★' },
  { valor: 4, etiqueta: '4 ★' },
  { valor: 3, etiqueta: '3 ★' },
  { valor: 2, etiqueta: '2 ★' },
  { valor: 1, etiqueta: '1 ★' },
];

export default function AdminResenasScreen() {
  const [q, setQ] = useState('');
  const [calificacion, setCalificacion] = useState<number | null>(null);
  const { resenas, cargando, cargado, error, recargar, quitar } = useAdminResenas(q, calificacion);

  const [porBorrar, setPorBorrar] = useState<ResenaAdmin | null>(null);
  const [borrando, setBorrando] = useState(false);
  const [errorBorrado, setErrorBorrado] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const borrandoRef = useRef(false);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(null), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  async function eliminar() {
    if (!porBorrar || borrandoRef.current) return;
    borrandoRef.current = true;
    setBorrando(true);
    setErrorBorrado(null);
    try {
      await eliminarResenaAdmin(porBorrar._id);
      quitar(porBorrar._id);
      setPorBorrar(null);
      setAviso('Reseña eliminada correctamente');
    } catch (e) {
      setErrorBorrado((e as Error).message || 'No se pudo eliminar la reseña');
    } finally {
      borrandoRef.current = false;
      setBorrando(false);
    }
  }

  const hayFiltros = !!q.trim() || calificacion !== null;

  return (
    <View style={styles.screen}>
      <AdminSubHeader titulo="Reseñas" volverA="/admin/inicio" />

      <View style={[styles.wrap, styles.headerBox]}>
        <SearchBar value={q} onChange={setQ} placeholder="Buscar por autor, servicio o comentario" />
        <View style={styles.chipsRow}>
          {FILTROS.map((f) => {
            const activo = f.valor === calificacion;
            return (
              <Pressable
                key={f.etiqueta}
                style={[styles.chip, activo && styles.chipActive]}
                onPress={() => setCalificacion(f.valor)}
                accessibilityRole="button"
                accessibilityState={{ selected: activo }}>
                <Text style={[styles.chipText, activo && styles.chipTextActive]}>{f.etiqueta}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <FlatList
        data={resenas}
        keyExtractor={(r) => r._id}
        contentContainerStyle={styles.content}
        refreshing={cargando && cargado}
        onRefresh={recargar}
        ListHeaderComponent={
          <View style={{ gap: 12 }}>
            {!!aviso && (
              <View style={styles.okBox} accessibilityLiveRegion="polite">
                <Ionicons name="checkmark-circle" size={20} color="#059669" />
                <Text style={styles.okText}>{aviso}</Text>
              </View>
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
          cargando && !cargado ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color="#0147B9" />
              <Text style={styles.centerText}>Cargando reseñas…</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyBox}>
              <View style={styles.emptyIcon}>
                <Ionicons name="chatbubbles-outline" size={40} color="#0147B9" />
              </View>
              <Text style={styles.emptyTitle}>
                {hayFiltros ? 'No hay reseñas con esos filtros' : 'Aún no hay reseñas'}
              </Text>
            </View>
          ) : (
            <></>
          )
        }
        renderItem={({ item }) => (
          <ResenaAdminCard
            resena={item}
            ocupado={borrando}
            onEliminar={() => {
              setErrorBorrado(null);
              setPorBorrar(item);
            }}
          />
        )}
      />

      <ConfirmDialog
        visible={!!porBorrar}
        titulo="Eliminar reseña"
        mensaje={`¿Eliminar la reseña de ${porBorrar?.autor_nombre ?? 'este usuario'} sobre «${porBorrar?.servicio_nombre ?? 'el servicio'}»? Esta acción no se puede deshacer.`}
        confirmarTexto="Eliminar"
        cargando={borrando}
        error={errorBorrado}
        onCancel={() => setPorBorrar(null)}
        onConfirm={eliminar}
      />
    </View>
  );
}