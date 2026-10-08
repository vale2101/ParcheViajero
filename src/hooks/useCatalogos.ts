import { useEffect, useState } from 'react';
import type { PickerOption } from '../components/PickerField';
import { getCategorias } from '../api/categoria';
import { getMunicipios } from '../api/municipio';

// Carga las categorías y municipios cuando "activo" es true (modal abierto)
export function useCatalogos(activo: boolean) {
  const [categorias, setCategorias] = useState<PickerOption[]>([]);
  const [municipios, setMunicipios] = useState<PickerOption[]>([]);

  useEffect(() => {
    if (!activo) return;

    getCategorias()
      .then(({ data }) => setCategorias(data.map((c) => ({ id: c._id, nombre: c.nombre }))))
      .catch(() => setCategorias([]));

    getMunicipios()
      .then(({ data }) => setMunicipios(data.map((m) => ({ id: m._id, nombre: m.nombre }))))
      .catch(() => setMunicipios([]));
  }, [activo]);

  return { categorias, municipios };
}
