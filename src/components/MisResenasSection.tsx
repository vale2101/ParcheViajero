import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import StarRating from './StarRating';
import { useAuth } from '../context/AuthContext';
import { deleteResena, getResenas, updateResena, type Resena } from '../api/resena';
import { getServicios, type Servicio } from '../api/servicio';

export default function MisResenasSection() {
  const { user } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [servicios, setServicios] = useState<Record<string, Servicio>>({});
  const [loading, setLoading] = useState(true);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [calificacionEdit, setCalificacionEdit] = useState(0);
  const [comentarioEdit, setComentarioEdit] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [errorEdit, setErrorEdit] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [{ data: todasResenas }, { data: todosServicios }] = await Promise.all([
        getResenas(),
        getServicios(),
      ]);

      const mias = todasResenas.filter((r) => r.usuario_id === user._id);
      const mapaServicios = Object.fromEntries(todosServicios.map((s) => [s._id, s]));

      setResenas(mias);
      setServicios(mapaServicios);
    } catch {
      setResenas([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  function iniciarEdicion(resena: Resena) {
    setEditandoId(resena._id);
    setCalificacionEdit(resena.calificacion);
    setComentarioEdit(resena.comentario ?? '');
    setErrorEdit(null);
  }

  function cancelarEdicion() {
    setEditandoId(null);
    setErrorEdit(null);
  }

  async function guardarEdicion(id: string) {
    if (calificacionEdit < 1) {
      setErrorEdit('Selecciona una calificación de 1 a 5 estrellas');
      return;
    }

    setGuardando(true);
    setErrorEdit(null);
    try {
      await updateResena(id, {
        calificacion: calificacionEdit,
        comentario: comentarioEdit.trim() || undefined,
      });
      setResenas((prev) =>
        prev.map((r) =>
          r._id === id
            ? { ...r, calificacion: calificacionEdit, comentario: comentarioEdit.trim() || undefined }
            : r,
        ),
      );
      setEditandoId(null);
    } catch (err) {
      setErrorEdit((err as Error).message);
    } finally {
      setGuardando(false);
    }
  }

  async function handleDelete(id: string) {
    setBorrandoId(id);
    try {
      await deleteResena(id);
      setResenas((prev) => prev.filter((r) => r._id !== id));
    } catch {
      // se puede mostrar un error si se desea
    } finally {
      setBorrandoId(null);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mis reseñas</Text>

      {loading ? (
        <Text style={styles.placeholder}>Cargando tus reseñas…</Text>
      ) : resenas.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>Aún no has escrito ninguna reseña</Text>
        </View>
      ) : (
        <FlatList
          data={resenas}
          keyExtractor={(item) => item._id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const servicio = servicios[item.servicio_id];
            const editando = editandoId === item._id;

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.servicioNombre}>
                    {servicio?.nombre ?? 'Servicio eliminado'}
                  </Text>
                  {!editando && (
                    <View style={styles.actionsRow}>
                      <Pressable onPress={() => iniciarEdicion(item)} hitSlop={8}>
                        <Text style={styles.editText}>Editar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleDelete(item._id)}
                        disabled={borrandoId === item._id}
                        hitSlop={8}>
                        <Text style={styles.deleteText}>
                          {borrandoId === item._id ? 'Borrando…' : 'Eliminar'}
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>

                {editando ? (
                  <View style={styles.editBox}>
                    <StarRating value={calificacionEdit} onChange={setCalificacionEdit} />

                    <TextInput
                      style={styles.textarea}
                      value={comentarioEdit}
                      onChangeText={setComentarioEdit}
                      placeholder="¿Qué tal estuvo tu experiencia?"
                      placeholderTextColor="#a3a3a3"
                      multiline
                      numberOfLines={3}
                    />

                    {!!errorEdit && <Text style={styles.errorTextInline}>{errorEdit}</Text>}

                    <View style={styles.editActionsRow}>
                      <Pressable onPress={cancelarEdicion} hitSlop={8} disabled={guardando}>
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => guardarEdicion(item._id)}
                        hitSlop={8}
                        disabled={guardando}>
                        <Text style={styles.saveText}>
                          {guardando ? 'Guardando…' : 'Guardar'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : (
                  <>
                    <StarRating value={item.calificacion} readonly size={16} />
                    {!!item.comentario && <Text style={styles.comentario}>{item.comentario}</Text>}
                  </>
                )}

                {!!item.fecha && (
                  <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                )}
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A8A' },
  placeholder: { color: '#a3a3a3', fontSize: 14 },
  emptyBox: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 20,
    alignItems: 'center',
  },
  list: { gap: 12 },
  card: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 14,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicioNombre: { fontSize: 15, fontWeight: '600', color: '#1E3A8A', flexShrink: 1 },
  actionsRow: { flexDirection: 'row', gap: 14 },
  editText: { fontSize: 12, fontWeight: '600', color: '#1E3A8A' },
  deleteText: { fontSize: 12, fontWeight: '600', color: '#dc2626' },
  comentario: { fontSize: 14, color: '#171717' },
  fecha: { fontSize: 11, color: '#a3a3a3' },
  editBox: { gap: 10 },
  textarea: {
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#FDFBF6',
    padding: 10,
    fontSize: 14,
    color: '#171717',
    textAlignVertical: 'top',
    minHeight: 70,
  },
  errorTextInline: { fontSize: 12, fontWeight: '500', color: '#dc2626' },
  editActionsRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16 },
  cancelText: { fontSize: 13, fontWeight: '600', color: '#a3a3a3' },
  saveText: { fontSize: 13, fontWeight: '700', color: '#1E3A8A' },
});