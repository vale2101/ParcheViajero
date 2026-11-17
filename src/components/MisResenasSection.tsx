import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import Loader from './Loader';
import FotoPlaceholder from './FotoPlaceholder';
import MarcoPolaroid from './MarcoPolaroid';
import StarRating from './StarRating';
import { useMisResenas } from '../hooks/useMisResenas';
import { validarCalificacion } from '../utils/validaciones';
import { colors } from '../styles/theme';
import { styles } from '../styles/MisResenasSection.styles';

const MAX_VISIBLES = 1;
const FOTO = { ancho: 72, alto: 72 };

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
        <View style={styles.titleWrap}>
          <Ionicons name="chatbubbles" size={18} color={colors.azul} />
          <Text style={styles.sectionTitle}>Mis reseñas</Text>
        </View>
        {resenas.length > 0 && (
          <Text style={styles.count}>
            {resenas.length} {resenas.length === 1 ? 'reseña' : 'reseñas'}
          </Text>
        )}
      </View>

      {loading ? (
        <Loader tipo="bloque" texto="Cargando tus reseñas…" />
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
              const foto = servicio?.imagenes?.[0]?.url_imagen;

              return (
                <View style={styles.card}>
                  <View style={styles.polaroidWrap}>
                    <MarcoPolaroid ancho={FOTO.ancho} alto={FOTO.alto} rotacion="-3deg">
                      {foto ? (
                        <Image
                          source={{ uri: foto }}
                          style={{ width: FOTO.ancho, height: FOTO.alto }}
                          contentFit="cover"
                          cachePolicy="disk"
                          accessibilityLabel={`Foto de ${servicio?.nombre ?? 'el establecimiento'}`}
                        />
                      ) : (
                        <FotoPlaceholder
                          plano
                          style={{ width: FOTO.ancho, height: FOTO.alto }}
                        />
                      )}
                    </MarcoPolaroid>
                  </View>

                  <View style={styles.body}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.servicioNombre} numberOfLines={2}>
                        {servicio?.nombre ?? 'Servicio eliminado'}
                      </Text>
                      {!editando && (
                        <View style={styles.actionsRow}>
                          <Pressable
                            onPress={() => iniciarEdicion(item)}
                            hitSlop={8}
                            style={styles.action}
                            accessibilityLabel="Editar reseña">
                            <Ionicons name="create-outline" size={15} color={colors.azul} />
                            <Text style={styles.editText}>Editar</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => eliminarResena(item._id)}
                            disabled={borrandoId === item._id}
                            hitSlop={8}
                            style={styles.action}
                            accessibilityLabel="Eliminar reseña">
                            <Ionicons name="trash-outline" size={15} color={colors.rojo} />
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
                          placeholderTextColor={colors.placeholder}
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
                      <View style={styles.fechaRow}>
                        <Ionicons name="calendar-outline" size={13} color={colors.textoSec} />
                        <Text style={styles.fecha}>
                          {new Date(item.fecha).toLocaleDateString()}
                        </Text>
                      </View>
                    )}
                  </View>
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
                color={colors.azul}
              />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
