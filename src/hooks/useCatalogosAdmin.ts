import { useEffect, useState } from 'react';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';

export function useCatalogosAdmin() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    getCategorias().then((r) => setCategorias(r.data)).catch(() => {});
    getMunicipios().then((r) => setMunicipios(r.data)).catch(() => {});
  }, []);

  return { categorias, municipios };
}