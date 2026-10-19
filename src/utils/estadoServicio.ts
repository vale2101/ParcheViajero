import type { Ionicons } from '@expo/vector-icons';
import type { EstadoAprobacion } from '../api/servicio';

export interface EstadoVisual {
  texto: string;
  icono: keyof typeof Ionicons.glyphMap;
  fg: string;
  bg: string;
  borde: string;
}

export const ESTADOS: Record<EstadoAprobacion, EstadoVisual> = {
  pendiente: {
    texto: 'Pendiente de aprobación',
    icono: 'time-outline',
    fg: '#92400E',
    bg: '#FFF4D6',
    borde: '#FEBA03',
  },
  aprobado: {
    texto: 'Aprobado',
    icono: 'checkmark-circle',
    fg: '#047857',
    bg: '#E3F4EC',
    borde: '#059669',
  },
  rechazado: {
    texto: 'Rechazado',
    icono: 'close-circle',
    fg: '#B91C1C',
    bg: '#FDE8E8',
    borde: '#ef4444',
  },
};

export function getEstadoVisual(estado?: EstadoAprobacion): EstadoVisual {
  return ESTADOS[estado ?? 'pendiente'];
}