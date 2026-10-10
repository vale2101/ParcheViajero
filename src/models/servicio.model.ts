
import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type {
  IServicio,
  ICreateServicioInput,
} from "../interfaces/servicio.interface.js";

const COLLECTION = "servicios";

export type EstadoRevision = "aprobado" | "rechazado";

// GET: servicios aprobados para el mapa público
export async function getServicios_get(): Promise<IServicio[]> {
  const db = mongoConnector.getDb();

  return db
    .collection<IServicio>(COLLECTION)
    .find({ estado_aprobacion: "aprobado" })
    .toArray();
}

// GET: consultar un servicio por ID
export async function getServicioById_get(
  id: string,
): Promise<IServicio | null> {
  if (!ObjectId.isValid(id)) {
    throw new Error("Identificador de servicio inválido");
  }

  const db = mongoConnector.getDb();

  return db
    .collection<IServicio>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
}

// POST: crear servicio como pendiente
export async function createServicio_post(
  servicio: ICreateServicioInput,
): Promise<boolean> {
  try {
    const db = mongoConnector.getDb();

    if (
      !ObjectId.isValid(servicio.usuario_id) ||
      !ObjectId.isValid(servicio.categoria_id) ||
      !ObjectId.isValid(servicio.municipio_id)
    ) {
      throw new Error("Uno de los identificadores no es válido");
    }

    const usuarioDoc = await db
      .collection("usuarios")
      .findOne({ _id: new ObjectId(servicio.usuario_id) });

    if (!usuarioDoc) {
      throw new Error("El usuario dueño del servicio no existe");
    }

    const tipoUsuarioDoc = await db
      .collection("tipos_usuario")
      .findOne({ _id: usuarioDoc.tipo_usuario_id });

    if (!tipoUsuarioDoc || tipoUsuarioDoc.nombre !== "negocio") {
      throw new Error(
        "El usuario dueño del servicio debe ser de tipo 'negocio'",
      );
    }

    const categoriaDoc = await db
      .collection("categorias")
      .findOne({ _id: new ObjectId(servicio.categoria_id) });

    if (!categoriaDoc) {
      throw new Error("La categoría indicada no existe");
    }

    const municipioDoc = await db
      .collection("municipios")
      .findOne({ _id: new ObjectId(servicio.municipio_id) });

    if (!municipioDoc) {
      throw new Error("El municipio indicado no existe");
    }

    const doc: IServicio = {
      usuario_id: new ObjectId(servicio.usuario_id),
      categoria_id: new ObjectId(servicio.categoria_id),
      municipio_id: new ObjectId(servicio.municipio_id),
      nombre: servicio.nombre,
      latitud: servicio.latitud,
      longitud: servicio.longitud,

      ubicacion: {
        type: "Point",
        coordinates: [servicio.longitud, servicio.latitud],
      },

      fecha_creacion: new Date(),
      estado_aprobacion: "pendiente",

      ...(servicio.descripcion !== undefined && {
        descripcion: servicio.descripcion,
      }),
      ...(servicio.direccion !== undefined && {
        direccion: servicio.direccion,
      }),
      ...(servicio.telefono !== undefined && {
        telefono: servicio.telefono,
      }),
      ...(servicio.horario_atencion !== undefined && {
        horario_atencion: servicio.horario_atencion,
      }),
      ...(servicio.precio !== undefined && {
        precio: servicio.precio,
      }),
    };

    const response = await db
      .collection<IServicio>(COLLECTION)
      .insertOne(doc);

    return response.acknowledged;
  } catch (error: unknown) {
    console.error("Error al crear servicio:", error);
    throw error;
  }
}

// PUT: editar un servicio propio
// Los campos de aprobación no pueden ser modificados por el propietario.
export async function updateServicio_put(
  id: string,
  cambios: Partial<
    Omit<
      IServicio,
      | "_id"
      | "usuario_id"
      | "ubicacion"
      | "estado_aprobacion"
      | "fecha_revision"
      | "revisado_por"
      | "observacion_revision"
    >
  > & {
    categoria_id?: string;
    municipio_id?: string;
  },
  usuarioIdAutenticado: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(usuarioIdAutenticado)) {
    throw new Error("Identificador inválido");
  }

  const db = mongoConnector.getDb();
  const coleccion = db.collection<IServicio>(COLLECTION);
  const servicioExistente = await coleccion.findOne({
    _id: new ObjectId(id),
  });

  if (!servicioExistente) {
    return false;
  }

  if (servicioExistente.usuario_id.toString() !== usuarioIdAutenticado) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  const camposProtegidos = [
    "_id",
    "usuario_id",
    "ubicacion",
    "estado_aprobacion",
    "fecha_revision",
    "revisado_por",
    "observacion_revision",
  ];

  const datos: Record<string, unknown> = Object.fromEntries(
    Object.entries(cambios).filter(
      ([clave, valor]) =>
        valor !== undefined && !camposProtegidos.includes(clave),
    ),
  );

  if (datos.categoria_id !== undefined) {
    if (
      typeof datos.categoria_id !== "string" ||
      !ObjectId.isValid(datos.categoria_id)
    ) {
      throw new Error("Identificador de categoría inválido");
    }

    const categoriaDoc = await db.collection("categorias").findOne({
      _id: new ObjectId(datos.categoria_id),
    });

    if (!categoriaDoc) {
      throw new Error("La categoría indicada no existe");
    }

    datos.categoria_id = new ObjectId(datos.categoria_id);
  }

  if (datos.municipio_id !== undefined) {
    if (
      typeof datos.municipio_id !== "string" ||
      !ObjectId.isValid(datos.municipio_id)
    ) {
      throw new Error("Identificador de municipio inválido");
    }

    const municipioDoc = await db.collection("municipios").findOne({
      _id: new ObjectId(datos.municipio_id),
    });

    if (!municipioDoc) {
      throw new Error("El municipio indicado no existe");
    }

    datos.municipio_id = new ObjectId(datos.municipio_id);
  }

  if (datos.latitud !== undefined || datos.longitud !== undefined) {
    const nuevaLat =
      datos.latitud ?? servicioExistente.latitud;
    const nuevaLng =
      datos.longitud ?? servicioExistente.longitud;

    if (
      typeof nuevaLat !== "number" ||
      typeof nuevaLng !== "number" ||
      !Number.isFinite(nuevaLat) ||
      !Number.isFinite(nuevaLng) ||
      Math.abs(nuevaLat) > 90 ||
      Math.abs(nuevaLng) > 180
    ) {
      throw new Error("Las coordenadas no son válidas");
    }

    datos.latitud = nuevaLat;
    datos.longitud = nuevaLng;
    datos.ubicacion = {
      type: "Point",
      coordinates: [nuevaLng, nuevaLat],
    };
  }

  if (Object.keys(datos).length === 0) {
    return true;
  }

  // Si se modifica un servicio, debe revisarse de nuevo.
  const response = await coleccion.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...datos,
        estado_aprobacion: "pendiente",
      },
      $unset: {
        fecha_revision: "",
        revisado_por: "",
        observacion_revision: "",
      },
    },
  );

  return response.matchedCount > 0;
}

// PUT: aprobar o rechazar un servicio.
// adminId debe proceder del token de un administrador autorizado.
export async function revisarServicio_put(
  id: string,
  adminId: string,
  estado: EstadoRevision,
  observacion?: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(adminId)) {
    throw new Error("Identificador inválido");
  }

  if (estado !== "aprobado" && estado !== "rechazado") {
    throw new Error("Estado de revisión inválido");
  }

  const comentario = observacion?.trim();

  if (estado === "rechazado" && !comentario) {
    throw new Error("Debes indicar el motivo del rechazo");
  }

  const db = mongoConnector.getDb();

  const resultado = await db.collection<IServicio>(COLLECTION).updateOne(
    {
      _id: new ObjectId(id),
      estado_aprobacion: "pendiente",
    },
    {
      $set: {
        estado_aprobacion: estado,
        fecha_revision: new Date(),
        revisado_por: new ObjectId(adminId),
        ...(estado === "rechazado" && comentario
          ? { observacion_revision: comentario }
          : {}),
      },
      ...(estado === "aprobado"
        ? { $unset: { observacion_revision: "" } }
        : {}),
    },
  );

  return resultado.modifiedCount > 0;
}

// DELETE: eliminar un servicio propio
export async function deleteServicio_delete(
  id: string,
  usuarioIdAutenticado: string,
): Promise<boolean> {
  if (!ObjectId.isValid(id) || !ObjectId.isValid(usuarioIdAutenticado)) {
    throw new Error("Identificador inválido");
  }

  const db = mongoConnector.getDb();
  const coleccion = db.collection<IServicio>(COLLECTION);

  const servicioExistente = await coleccion.findOne({
    _id: new ObjectId(id),
  });

  if (!servicioExistente) {
    return false;
  }

  if (servicioExistente.usuario_id.toString() !== usuarioIdAutenticado) {
    throw new Error("No tienes permiso para eliminar este servicio");
  }

  const response = await coleccion.deleteOne({
    _id: new ObjectId(id),
  });

  return response.deletedCount > 0;
}

// GET: todos los servicios del propietario autenticado, con sus estados
export async function getServiciosByUsuarioId_get(
  usuarioId: string,
): Promise<IServicio[]> {
  if (!ObjectId.isValid(usuarioId)) {
    throw new Error("Identificador de usuario inválido");
  }

  const db = mongoConnector.getDb();

  return db
    .collection<IServicio>(COLLECTION)
    .find({ usuario_id: new ObjectId(usuarioId) })
    .toArray();
}
