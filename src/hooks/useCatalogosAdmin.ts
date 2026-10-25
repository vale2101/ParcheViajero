import { useEffect, useState } from 'react';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { logError } from '../utils/errorApp';

export function useCatalogosAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    getCategorias()
      .then((r) => setCategorias(r.data))
      .catch((e) => logError('No se pudieron cargar las categorías', e));
    getMunicipios()
      .then((r) => setMunicipios(r.data))
      .catch((e) => logError('No se pudieron cargar los municipios', e));
  }, []);

  return { categorias, municipios };
}