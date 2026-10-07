import type { Servicio } from '../api/servicio';
import type { MapFiltersValue } from '../components/MapFilters';

export function filtrarServicios(servicios: Servicio[], filtros: MapFiltersValue): Servicio[] {
  const query = filtros.query.trim().toLowerCase();

  return servicios.filter((s) => {
    if (filtros.categoriaId && s.categoria_id !== filtros.categoriaId) return false;
    if (filtros.municipioId && s.municipio_id !== filtros.municipioId) return false;
    if (query && !s.nombre.toLowerCase().includes(query)) return false;
    return true;
  });
}