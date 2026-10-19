import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import LocationPickerMap from '../components/LocationPickerMap';
import type { Categoria } from '../api/categoria';
import type { Municipio } from '../api/municipio';
import type { WizardForm } from '../hooks/useServicioWizard';
import type { UbicacionConfirmada } from '../hooks/useUbicacionServicio';
import { getCategoriaVisual } from '../utils/categoriaVisual';
import { styles } from '../styles/ServicioWizard.styles';

interface Props {
  valores: WizardForm;
  categoria: Categoria | undefined;
  municipio: Municipio | undefined;
  gratuito: boolean;
  ubicacion: UbicacionConfirmada | null;
  onEditar: (paso: number) => void;
  errorEnvio: string | null;
}

function formatearPrecio(valor: string): string {
  return `$ ${valor.replace(/\B(?=(\d{3})+(?!\d))/g, '.')} COP`;
}

function Seccion({
  titulo,
  paso,
  onEditar,
  children,
}: {
  titulo: string;
  paso: number;
  onEditar: (paso: number) => void;
  children: ReactNode;
}) {
  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>{titulo}</Text>
        <Pressable onPress={() => onEditar(paso)} hitSlop={8} accessibilityRole="button">
          <Text style={styles.summaryEdit}>Editar</Text>
        </Pressable>
      </View>
      {children}
    </View>
  );
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View>
      <Text style={styles.summaryLabel}>{etiqueta}</Text>
      <Text style={styles.summaryValue}>{valor}</Text>
    </View>
  );
}

export default function StepResumen({
  valores,
  categoria,
  municipio,
  gratuito,
  ubicacion,
  onEditar,
  errorEnvio,
}: Props) {
  const visual = getCategoriaVisual(categoria?.nombre);
  const precio = gratuito
    ? 'Gratuito o no aplica'
    : valores.precio
      ? formatearPrecio(valores.precio)
      : 'No indicado';

  return (
    <View style={styles.stepBody}>
      <Text style={styles.stepTitle}>Resumen</Text>
      <Text style={styles.stepSubtitle}>Revisa la información antes de enviarla.</Text>

      <Seccion titulo="Servicio" paso={0} onEditar={onEditar}>
        <Fila etiqueta="Nombre" valor={valores.nombre.trim()} />
        <Fila etiqueta="Descripción" valor={valores.descripcion.trim()} />
        <Fila
          etiqueta="Categoría"
          valor={categoria ? `${visual.emoji} ${categoria.nombre}` : 'Sin categoría'}
        />
      </Seccion>

      <Seccion titulo="Ubicación" paso={1} onEditar={onEditar}>
        <Fila etiqueta="Municipio" valor={municipio?.nombre ?? '—'} />
        <Fila etiqueta="Dirección confirmada" valor={ubicacion?.direccion ?? '—'} />

        {!!ubicacion && (
          <LocationPickerMap
            vista={{ lat: ubicacion.latitud, lng: ubicacion.longitud, zoom: 16, token: 1 }}
            marcador={{ lat: ubicacion.latitud, lng: ubicacion.longitud }}
            interactivo={false}
            height={200}
          />
        )}
      </Seccion>

      <Seccion titulo="Contacto y condiciones" paso={2} onEditar={onEditar}>
        <Fila etiqueta="Teléfono" valor={valores.telefono.trim() || 'No indicado'} />
        <Fila etiqueta="Horario de atención" valor={valores.horario_atencion.trim() || 'No indicado'} />
        <Fila etiqueta="Precio" valor={precio} />
      </Seccion>

      <Seccion titulo="Imágenes" paso={3} onEditar={onEditar}>
        <Text style={styles.summaryValue}>No disponibles por ahora (falta soporte en el servidor).</Text>
      </Seccion>

      <View style={styles.notice}>
        <Text style={styles.noticeText}>
          Al enviar, tu servicio quedará «Pendiente de aprobación». No se publicará hasta que un
          administrador lo revise.
        </Text>
      </View>

      {!!errorEnvio && (
        <View style={styles.errorBox}>
          <Text style={styles.errorBoxText}>{errorEnvio}</Text>
        </View>
      )}
    </View>
  );
}