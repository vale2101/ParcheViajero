import { useCallback, useEffect, useRef, useState } from 'react';
import { getServicios, type Servicio } from '../api/servicio';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { getResenas, type Resena } from '../api/resena';
import { suscribirServiciosCambiados } from '../utils/serviciosSync';

export function useMapaData() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [resenas, setResenas] = useState<Resena[]>([]);
  const recargaEnCursoRef = useRef(false);

  const recargarServicios = useCallback(async () => {
    if (recargaEnCursoRef.current) return;

    recargaEnCursoRef.current = true;
    try {
      const serviciosRes = await getServicios();
      setServicios(serviciosRes.data);
    } catch {
    } finally {
      recargaEnCursoRef.current = false;
    }
  }, []);

  useEffect(() => {
    let activo = true;

    async function cargarDatos() {
      try {
        const [serviciosRes, categoriasRes, municipiosRes, resenasRes] = await Promise.all([
          getServicios(),
          getCategorias(),
          getMunicipios(),
          getResenas(),
        ]);
        if (!activo) return;
        setServicios(serviciosRes.data);
        setCategorias(categoriasRes.data);
        setMunicipios(municipiosRes.data);
        setResenas(resenasRes.data);
      } catch {
      }
    }

    cargarDatos();

    const unsuscribir = suscribirServiciosCambiados(() => {
      if (activo) {
        recargarServicios();
      }
    });

    return () => {
      activo = false;
      unsuscribir();
    };
  }, [recargarServicios]);

  return { servicios, categorias, municipios, resenas };
}
