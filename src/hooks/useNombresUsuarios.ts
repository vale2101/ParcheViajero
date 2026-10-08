import { useEffect, useRef, useState } from 'react';
import { getUsuarioById } from '../api/usuario';
import type { Resena } from '../api/resena';

// Busca el nombre de quien escribió cada reseña (guarda un diccionario id -> nombre)
export function useNombresUsuarios(resenas: Resena[]) {
  const [nombres, setNombres] = useState<Record<string, string>>({});
  const yaPedidos = useRef<Set<string>>(new Set());

  useEffect(() => {
    resenas.forEach((r) => {
      if (yaPedidos.current.has(r.usuario_id)) return;
      yaPedidos.current.add(r.usuario_id);

      getUsuarioById(r.usuario_id)
        .then(({ data }) => setNombres((prev) => ({ ...prev, [r.usuario_id]: data.nombre })))
        .catch(() => {
          // si falla, la tarjeta muestra "Viajero"
        });
    });
  }, [resenas]);

  return nombres;
}
