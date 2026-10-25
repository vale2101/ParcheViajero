import { Text, TextInput, View, type LayoutChangeEvent } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Loader from '../components/Loader';
import LocationPickerMap from '../components/LocationPickerMap';
import PickerField from '../components/PickerField';
import type { Municipio } from '../api/municipio';
import type { useUbicacionServicio } from '../hooks/useUbicacionServicio';
import { styles } from '../styles/ServicioWizard.styles';

type Ubicacion = ReturnType<typeof useUbicacionServicio>;

interface Props {
  municipios: Municipio[];
  cargando: boolean;
  error: string | null;
  onReintentar: () => void;
  municipioId: string | null;
  municipioNombre?: string | undefined;
  onSeleccionarMunicipio: (id: string) => void;
  ubicacion: Ubicacion;
  errorMunicipio?: string | undefined;
  errorUbicacion?: string | undefined;
  ancla: (nombre: string) => (e: LayoutChangeEvent) => void;
}

const ICONO_VERIFICACION = {
  dentro: { name: 'checkmark-circle', color: '#059669' },
  aproximada: { name: 'help-circle', color: '#B45309' },
  fuera: { name: 'warning', color: '#dc2626' },
} as const;

export default function StepUbicacion({
  municipios,
  cargando,
  error,
  onReintentar,
  municipioId,
  municipioNombre,
  onSeleccionarMunicipio,
  ubicacion,
  errorMunicipio,
  errorUbicacion,
  ancla,
}: Props) {
  const u = ubicacion;
  const verif = u.verificacion ? ICONO_VERIFICACION[u.verificacion.estado] : null;

  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Ubicación del servicio</Text>
      <Text style={styles.stepSubtitle}>
        Elige el municipio, escribe la dirección y marca el lugar exacto con el pin.
      </Text>

      <View onLayout={ancla('municipio')} style={styles.block}>
        {cargando ? (
          <Loader tipo="compacto" texto="Cargando municipios…" />
        ) : error ? (
          <View style={styles.retryBox}>
            <Text style={styles.retryText}>{error}</Text>
            <Button text="Volver a intentar" onPress={onReintentar} secondary />
          </View>
        ) : (
          <PickerField
            label="Municipio"
            value={municipioId}
            options={municipios.map((m) => ({ id: m._id, nombre: m.nombre }))}
            onChange={onSeleccionarMunicipio}
            placeholder="Selecciona un municipio"
            error={errorMunicipio}
          />
        )}

        {!!municipioNombre && (
          <View style={styles.municipioBadge}>
            <Ionicons name="business-outline" size={18} color="#0147B9" />
            <Text style={styles.municipioBadgeText}>
              Municipio seleccionado: <Text style={{ fontWeight: '700' }}>{municipioNombre}</Text>
            </Text>
          </View>
        )}
      </View>

      {!!municipioId && (
        <>
          <View onLayout={ancla('ubicacion')} style={styles.block}>
            <Text style={styles.label}>Dirección del servicio</Text>
            <TextInput
              style={styles.input}
              value={u.texto}
              onChangeText={u.editarTexto}
              autoCapitalize="sentences"
              placeholder="Ej. Calle 65 # 23-40"
              placeholderTextColor="#a3a3a3"
            />
            <Text style={styles.helpText}>Escríbela como la conocen tus clientes.</Text>
          </View>

          {!!u.aviso && (
            <View style={styles.notice}>
              <Ionicons name="information-circle" size={20} color="#B45309" />
              <Text style={styles.noticeText}>{u.aviso}</Text>
            </View>
          )}

          <View style={styles.block}>
            <View style={[styles.mapBadge, !!u.marcador && styles.mapBadgeService]}>
              <Ionicons name={u.marcador ? 'pin' : 'map-outline'} size={18} color="#0147B9" />
              <Text style={styles.mapBadgeText}>
                {u.marcador
                  ? 'Ubicación del servicio (arrastra el pin para ajustarla)'
                  : `Vista general de ${municipioNombre}: toca el mapa para colocar el pin`}
              </Text>
            </View>

            <LocationPickerMap
              vista={u.vista}
              marcador={u.marcador}
              onMarcadorChange={u.moverMarcador}
              height={320}
            />
            <Text style={styles.helpText}>
              Acerca el mapa con los botones + / − y toca el punto exacto de tu negocio.
            </Text>
          </View>

          {!!u.verificacion && !!verif && (
            <View style={styles.locCard}>
              <View style={styles.locRow}>
                <Ionicons name={verif.name} size={20} color={verif.color} />
                <Text style={[styles.locText, { color: verif.color }]}>{u.verificacion.detalle}</Text>
              </View>

              {u.confirmada ? (
                <View style={styles.confirmedBox}>
                  <Ionicons name="checkmark-circle" size={22} color="#059669" />
                  <Text style={styles.confirmedText}>Ubicación lista</Text>
                </View>
              ) : (
                !u.direccionValida && (
                  <View style={styles.locRow}>
                    <Ionicons name="create-outline" size={20} color="#B45309" />
                    <Text style={[styles.locText, { color: '#B45309' }]}>
                      Escribe la dirección del servicio para continuar.
                    </Text>
                  </View>
                )
              )}
            </View>
          )}

          {!!errorUbicacion && <Text style={styles.errorText}>{errorUbicacion}</Text>}
        </>
      )}
    </View>
  );
}