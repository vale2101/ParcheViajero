import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import StarRating from './StarRating';
import { useMisResenas } from '../hooks/useMisResenas';
import { validarCalificacion } from '../utils/validaciones';
import { styles } from '../styles/MisResenasSection.styles';

// Cuántas reseñas se ven antes de desplegar (la más reciente)
const MAX_VISIBLES = 1;

export default function MisResenasSection() {
  const {
    resenas,
    servicios,
    loading,
    borrandoId,
    editandoId,
    calificacionEdit,
    setCalificacionEdit,
    comentarioEdit,
    setComentarioEdit,
    guardando,
    errorEdit,
    setErrorEdit,
    iniciarEdicion,
    cancelarEdicion,
    guardarEdicion,
    eliminarResena,
  } = useMisResenas();

  const [expandido, setExpandido] = useState(false);

  // Las más recientes primero
  const ordenadas = [...resenas].sort(
    (a, b) => new Date(b.fecha ?? 0).getTime() - new Date(a.fecha ?? 0).getTime(),
  );
  const visibles = expandido ? ordenadas : ordenadas.slice(0, MAX_VISIBLES);
  const ocultas = ordenadas.length - MAX_VISIBLES;

  function handleGuardar(id: string) {
    const mensaje = validarCalificacion(calificacionEdit);
    if (mensaje) {
      setErrorEdit(mensaje);
      return;
    }
    guardarEdicion(id);
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Mis reseñas</Text>
        {resenas.length > 0 && <Text style={styles.count}>{resenas.length} reseñas</Text>}
      </View>

      {loading ? (
        <Text style={styles.placeholder}>Cargando tus reseñas…</Text>
      ) : resenas.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.placeholder}>Aún no has escrito ninguna reseña</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={visibles}
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
                          onPress={() => eliminarResena(item._id)}
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
                          onPress={() => handleGuardar(item._id)}
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
                      {!!item.comentario && (
                        <Text style={styles.comentario}>{item.comentario}</Text>
                      )}
                    </>
                  )}

                  {!!item.fecha && (
                    <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
                  )}
                </View>
              );
            }}
          />

          {ocultas > 0 && (
            <Pressable style={styles.verMasButton} onPress={() => setExpandido(!expandido)}>
              <Text style={styles.verMasText}>
                {expandido
                  ? 'Ver menos'
                  : `Ver mis otras ${ocultas} ${ocultas === 1 ? 'reseña' : 'reseñas'}`}
              </Text>
              <Ionicons
                name={expandido ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#0147B9"
              />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
