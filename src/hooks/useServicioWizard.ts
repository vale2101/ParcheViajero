import { useCallback, useEffect, useRef, useState } from 'react';
import type { LayoutChangeEvent, ScrollViewInstance } from 'react-native';
import { useForm } from 'react-hook-form';
import { getCategorias, type Categoria } from '../api/categoria';
import { getMunicipios, type Municipio } from '../api/municipio';
import { createServicio, subirImagenesServicio, type ImagenLocal } from '../api/servicio';
import { MAX_IMAGENES, elegirImagenes } from '../utils/seleccionarImagenes';
import { PATRON_PRECIO, PATRON_TELEFONO } from '../utils/validacionesServicio';
import { useUbicacionServicio } from './useUbicacionServicio';
import { logError, mensajeErrorUsuario } from '../utils/errorApp';
import { useAlert } from '../context/AlertContext';

export const TOTAL_PASOS = 5;
export const NOMBRES_PASOS = ['Básico', 'Ubicación', 'Contacto', 'Imágenes', 'Resumen'] as const;

export interface WizardForm {
  nombre: string;
  descripcion: string;
  telefono: string;
  horario_atencion: string;
  precio: string;
}

export interface ErroresWizard {
  categoria?: string;
  municipio?: string;
  ubicacion?: string;
}

const CAMPOS_POR_PASO: Record<number, (keyof WizardForm)[]> = {
  0: ['nombre', 'descripcion'],
  2: ['telefono', 'horario_atencion', 'precio'],
};

const ORDEN_ANCLAS: Record<number, string[]> = {
  0: ['nombre', 'descripcion', 'categoria'],
  1: ['municipio', 'ubicacion'],
  2: ['telefono', 'horario_atencion', 'precio'],
};

const CLAVES_ERROR_PASO: Record<number, (keyof ErroresWizard)[]> = {
  0: ['categoria'],
  1: ['municipio', 'ubicacion'],
};

function camposInvalidos(v: WizardForm, gratuito: boolean): (keyof WizardForm)[] {
  const malos: (keyof WizardForm)[] = [];
  if (v.nombre.trim().length < 3) malos.push('nombre');
  if (v.descripcion.trim().length < 10) malos.push('descripcion');
  if (v.telefono && !PATRON_TELEFONO.test(v.telefono)) malos.push('telefono');
  if (!gratuito && v.precio && (!PATRON_PRECIO.test(v.precio) || Number(v.precio) <= 0)) {
    malos.push('precio');
  }
  return malos;
}

export function useServicioWizard() {
  const { errorVital } = useAlert();
  const [paso, setPaso] = useState(0);
  const [direccionAnim, setDireccionAnim] = useState<1 | -1>(1);

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true);
  const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null);

  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [municipioId, setMunicipioId] = useState<string | null>(null);
  const [gratuito, setGratuito] = useState(false);

  const [imagenes, setImagenes] = useState<ImagenLocal[]>([]);
  const [avisoImagenes, setAvisoImagenes] = useState<string | null>(null);
  const [errorImagenes, setErrorImagenes] = useState<string | null>(null);

  const [errores, setErrores] = useState<ErroresWizard>({});
  const [enviando, setEnviando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const enviandoRef = useRef(false);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const anclas = useRef<Record<string, number>>({});

  const ubicacion = useUbicacionServicio();
  const { confirmada, reiniciar: reiniciarUbicacion } = ubicacion;

  const form = useForm<WizardForm>({
    mode: 'onChange',
    defaultValues: { nombre: '', descripcion: '', telefono: '', horario_atencion: '', precio: '' },
  });
  const valores = form.watch();

  const cargarCatalogos = useCallback(async () => {
    setCargandoCatalogos(true);
    setErrorCatalogos(null);
    try {
      const [c, m] = await Promise.all([getCategorias(), getMunicipios()]);
      setCategorias(c.data);
      setMunicipios(m.data);
    } catch (e) {
      logError('No se pudieron cargar categorías y municipios', e);
      setErrorCatalogos(mensajeErrorUsuario(e, 'No hemos podido obtener los datos'));
    } finally {
      setCargandoCatalogos(false);
    }
  }, []);

  useEffect(() => {
    cargarCatalogos();
  }, [cargarCatalogos]);

  const ancla = useCallback(
    (nombre: string) => (e: LayoutChangeEvent) => {
      anclas.current[nombre] = e.nativeEvent.layout.y;
    },
    [],
  );

  const desplazarA = useCallback((nombre: string) => {
    setTimeout(() => {
      const y = anclas.current[nombre];
      if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
    }, 80);
  }, []);

  const seleccionarCategoria = useCallback((id: string) => {
    setCategoriaId(id);
    setErrores((prev) => ({ ...prev, categoria: undefined }));
  }, []);

  const seleccionarMunicipio = useCallback(
    (id: string) => {
      if (id === municipioId) return;
      const m = municipios.find((x) => x._id === id);
      setMunicipioId(id);
      setErrores((prev) => ({ ...prev, municipio: undefined, ubicacion: undefined }));
      // Limpia dirección, marcador y confirmación del municipio anterior y centra el mapa
      reiniciarUbicacion(m?.nombre ?? null);
    },
    [municipioId, municipios, reiniciarUbicacion],
  );

  const cambiarGratuito = useCallback(
    (valor: boolean) => {
      setGratuito(valor);
      if (valor) {
        form.setValue('precio', '');
        form.clearErrors('precio');
      }
    },
    [form],
  );

  const agregarImagenes = useCallback(async () => {
    const { imagenes: nuevas, rechazadas } = await elegirImagenes(MAX_IMAGENES - imagenes.length);
    setAvisoImagenes(rechazadas.length ? rechazadas.join(' ') : null);
    if (nuevas.length > 0) setImagenes((prev) => [...prev, ...nuevas].slice(0, MAX_IMAGENES));
  }, [imagenes.length]);

  const quitarImagen = useCallback((uri: string) => {
    setImagenes((prev) => prev.filter((i) => i.uri !== uri));
  }, []);

  useEffect(() => {
    if (confirmada) setErrores((prev) => ({ ...prev, ubicacion: undefined }));
  }, [confirmada]);

  const validarPaso = useCallback(
    async (n: number): Promise<boolean> => {
      const nuevos: ErroresWizard = {};

      if (n === 0 && !categoriaId) nuevos.categoria = 'Selecciona una categoría';
      if (n === 1) {
        if (!municipioId) nuevos.municipio = 'Selecciona el municipio del servicio';
        else if (!confirmada) {
          nuevos.ubicacion =
            'Escribe la dirección y marca el punto en el mapa para continuar';
        }
      }

      let campos = CAMPOS_POR_PASO[n] ?? [];
      if (n === 2 && gratuito) campos = campos.filter((c) => c !== 'precio');
      const formOk = campos.length > 0 ? await form.trigger(campos) : true;

      const claves = CLAVES_ERROR_PASO[n] ?? [];
      if (claves.length > 0) {
        setErrores((prev) => {
          const limpio = { ...prev };
          claves.forEach((k) => delete limpio[k]);
          return { ...limpio, ...nuevos };
        });
      }

      const ok = formOk && Object.keys(nuevos).length === 0;

      if (!ok) {
        const primero = (ORDEN_ANCLAS[n] ?? []).find((nombre) => {
          if (nombre in nuevos) return true;
          return !!form.getFieldState(nombre as keyof WizardForm).error;
        });
        if (primero) desplazarA(primero);
      }

      return ok;
    },
    [categoriaId, municipioId, confirmada, gratuito, form, desplazarA],
  );

  const siguiente = useCallback(async () => {
    if (paso >= TOTAL_PASOS - 1) return;
    if (!(await validarPaso(paso))) return;
    setDireccionAnim(1);
    setPaso((p) => p + 1);
  }, [paso, validarPaso]);

  const anterior = useCallback(() => {
    if (paso === 0) return;
    setDireccionAnim(-1);
    setPaso((p) => p - 1);
  }, [paso]);

  const irAPaso = useCallback(
    (n: number) => {
      if (n >= paso || n < 0) return;
      setDireccionAnim(-1);
      setPaso(n);
    },
    [paso],
  );

  const volverAPasoConErrores = useCallback(
    (destino: number) => {
      setDireccionAnim(-1);
      setPaso(destino);
      setTimeout(() => {
        validarPaso(destino);
      }, 200);
    },
    [validarPaso],
  );

  const enviar = useCallback(async () => {
    if (enviandoRef.current) return;
    setErrorEnvio(null);
    setErrorImagenes(null);

    const v = form.getValues();

    const malos = camposInvalidos(v, gratuito);
    if (malos.length > 0) {
      volverAPasoConErrores(malos[0] === 'telefono' || malos[0] === 'precio' ? 2 : 0);
      return;
    }
    if (!categoriaId) return volverAPasoConErrores(0);
    if (!municipioId || !confirmada) return volverAPasoConErrores(1);

    enviandoRef.current = true;
    setEnviando(true);

    try {
      const creado = await createServicio({
        categoria_id: categoriaId,
        municipio_id: municipioId,
        nombre: v.nombre.trim(),
        descripcion: v.descripcion.trim(),
        direccion: confirmada.direccion,
        latitud: confirmada.latitud,
        longitud: confirmada.longitud,
        telefono: v.telefono.trim() || undefined,
        horario_atencion: v.horario_atencion.trim() || undefined,
        precio: gratuito || !v.precio ? undefined : Number(v.precio),
      });


      const servicioId = creado.data?._id;
      if (imagenes.length > 0 && servicioId) {
        try {
          await subirImagenesServicio(servicioId, imagenes);
        } catch (e) {
          setErrorImagenes(
            `El servicio se envió, pero las fotos no se pudieron subir (${(e as Error).message}). Puedes agregarlas desde tu perfil, en «Editar».`,
          );
        }
      }
      setEnviado(true);
    } catch (e) {
      setErrorEnvio(
        errorVital(
          'No se pudo enviar el servicio',
          e,
          'Error en la base de datos. Inténtalo más tarde.',
          'No se pudo publicar',
        ),
      );
    } finally {
      enviandoRef.current = false;
      setEnviando(false);
    }
  }, [form, gratuito, categoriaId, municipioId, confirmada, imagenes, volverAPasoConErrores, errorVital]);

  return {
    paso,
    direccionAnim,
    siguiente,
    anterior,
    irAPaso,
    enviar,
    enviando,
    enviado,
    errorEnvio,
    form,
    valores,
    categorias,
    municipios,
    cargandoCatalogos,
    errorCatalogos,
    cargarCatalogos,
    categoriaId,
    seleccionarCategoria,
    municipioId,
    seleccionarMunicipio,
    gratuito,
    cambiarGratuito,
    ubicacion,
    errores,
    scrollRef,
    ancla,
    imagenes,
    avisoImagenes,
    errorImagenes,
    agregarImagenes,
    quitarImagen,
    categoriaSeleccionada: categorias.find((c) => c._id === categoriaId),
    municipioSeleccionado: municipios.find((m) => m._id === municipioId),
  };
}