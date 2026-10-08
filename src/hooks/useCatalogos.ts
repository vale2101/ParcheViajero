import { useEffect, useState } from 'react';
import { getCategorias } from '../api/categoria';
import { getMunicipios } from '../api/municipio';
import type { PickerOption } from '../components/PickerField';

export function useCatalogos(visible: boolean) {
  const [categorias, setCategorias] = useState<PickerOption[]>([]);
  const [municipios, setMunicipios] = useState<PickerOption[]>([]);

  useEffect(() => {
    if (!visible) return;

    getCategorias().then(({ data }) =>
      setCategorias(data.map((c) => ({ id: c._id, nombre: c.nombre }))),
    );
    getMunicipios().then(({ data }) =>
      setMunicipios(data.map((m) => ({ id: m._id, nombre: m.nombre }))),
    );
  }, [visible]);

  return { categorias, municipios };
}