import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import StarRating from './StarRating';
import { useMisResenas } from '../hooks/useMisResenas';
import { validarCalificacion } from '../utils/validaciones';
import { styles } from '../styles/MisResenasSection.styles';

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