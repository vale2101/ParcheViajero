import { useEffect, useState } from 'react';
import { getServicios, type Servicio } from '../api/servicio';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { getResenas, type Resena } from '../api/resena';

export function useMapaData() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [serviciosRes, categoriasRes, municipiosRes, resenasRes] = await Promise.all([
          getServicios(),
          getCategorias(),
          getMunicipios(),
          getResenas(),
        ]);
        setServicios(serviciosRes.data);
        setCategorias(categoriasRes.data);
        setMunicipios(municipiosRes.data);
        setResenas(resenasRes.data);
      } catch {
        // se puede mostrar un toast/error aquí si se quiere
      }
    }

    cargarDatos();
  }, []);

  return { servicios, categorias, municipios, resenas };
}