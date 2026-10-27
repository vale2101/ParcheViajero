
import { ObjectId } from "mongodb";
import type { Document } from "mongodb";
import { borrarImagen } from "../utils/cloudinary.js";
import { deleteImagenesByServicio_delete } from "./imagen.model.js";
import { mongoConnector } from "../db/connection.js";
import type {
  IServicio,
  ICreateServicioInput,
} from "../interfaces/servicio.interface.js";
import type { EstadoAprobacion } from "../interfaces/servicio.interface.js";
import type { IRevisionServicio } from "../interfaces/revision.interface.js";

const COLLECTION = "servicios";
const REVISIONES = "revisiones_servicio";

const LOOKUP_IMAGENES: Document = {
  $lookup: {
    from: "imagenes_servicio",
    let: { sid: "$_id" },
    pipeline: [
      { $match: { $expr: { $eq: ["$servicio_id", "$$sid"] } } },
      { $sort: { orden: 1 } },
      { $project: { _id: 1, url_imagen: 1 } },
    ],
    as: "imagenes",
  },
};

export type EstadoRevision = "aprobado" | "rechazado";

export async function getServicios_get(): Promise<IServicio[]> {
  const db = mongoConnector.getDb();

  const docs = await db
    .collection(COLLECTION)
    .aggregate([{ $match: { estado_aprobacion: "aprobado" } }, LOOKUP_IMAGENES])
    .toArray();

  return docs as unknown as IServicio[];
}

export async function getServicioById_get(id: string): Promise<IServicio | null> {
  if (!ObjectId.isValid(id)) {
    throw new Error("Identificador de servicio inválido");
  }

  const db = mongoConnector.getDb();

  const [servicio] = await db
    .collection(COLLECTION)
    .aggregate([{ $match: { _id: new ObjectId(id) } }, LOOKUP_IMAGENES])
    .toArray();

  return (servicio as unknown as IServicio | undefined) ?? null;
}

// POST: crear servicio como pendiente
export async function createServicio_post(
  servicio: ICreateServicioInput,
): Promise<string | null> {
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

    return response.acknowledged ? response.insertedId.toString() : null;

  } catch (error: unknown) {
    console.error("Error al crear servicio:", error);
    throw error;
  }
}

// PUT: editar un servicio propio
// Los campos de aprobación no pueden ser modificados por el propietario.
// Solo se vuelve a enviar a revisión si cambia el nombre, la categoría o la ubicación.
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

  // Solo se vuelve a revisar si cambió el nombre, la categoría o la ubicación.
  const nombreCambio =
    typeof datos.nombre === "string" &&
    datos.nombre.trim() !== servicioExistente.nombre.trim();

  const categoriaCambio =
    datos.categoria_id instanceof ObjectId &&
    !datos.categoria_id.equals(servicioExistente.categoria_id);

  const ubicacionCambio =
    (datos.municipio_id instanceof ObjectId &&
      !datos.municipio_id.equals(servicioExistente.municipio_id)) ||
    (datos.direccion !== undefined &&
      datos.direccion !== (servicioExistente.direccion ?? "")) ||
    (datos.latitud !== undefined && datos.latitud !== servicioExistente.latitud) ||
    (datos.longitud !== undefined && datos.longitud !== servicioExistente.longitud);

  const requiereRevision = nombreCambio || categoriaCambio || ubicacionCambio;

  const response = await coleccion.updateOne(
    { _id: new ObjectId(id) },
    requiereRevision
      ? {
          $set: { ...datos, estado_aprobacion: "pendiente" },
          $unset: {
            fecha_revision: "",
            revisado_por: "",
            observacion_revision: "",
          },
        }
      : { $set: datos },
  );

  return response.matchedCount > 0;
}

// PUT: aprobar o rechazar un servicio.
// adminId debe proceder del token de un administrador autorizado.
export type ResultadoRevision =
  | { resultado: "ok" }
  | { resultado: "no_encontrado" }
  | { resultado: "estado_cambiado"; estadoActual: EstadoAprobacion | undefined };

// PUT: aprobar o rechazar un servicio pendiente y registrar el evento en el historial.
// adminId debe proceder del token de un administrador autorizado.
export async function revisarServicio_put(
  id: string,
  adminId: string,
  estado: EstadoRevision,
  observacion?: string,
): Promise<ResultadoRevision> {
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
  const servicios = db.collection<IServicio>(COLLECTION);
  const revisiones = db.collection<IRevisionServicio>(REVISIONES);
  const servicioId = new ObjectId(id);
  const adminOid = new ObjectId(adminId);

  const previo = await servicios.findOne({ _id: servicioId });

  if (!previo) return { resultado: "no_encontrado" };

  if (previo.usuario_id.equals(adminOid)) {
    throw new Error("No puedes revisar tus propios servicios");
  }

  if (previo.estado_aprobacion !== "pendiente") {
    return { resultado: "estado_cambiado", estadoActual: previo.estado_aprobacion };
  }

  const fecha = new Date();

  // El filtro por "pendiente" evita decisiones contradictorias entre dos sesiones
  const actualizado = await servicios.updateOne(
    { _id: servicioId, estado_aprobacion: "pendiente" },
    {
      $set: {
        estado_aprobacion: estado,
        fecha_revision: fecha,
        revisado_por: adminOid,
        ...(estado === "rechazado" && comentario
          ? { observacion_revision: comentario }
          : {}),
      },
      ...(estado === "aprobado"
        ? { $unset: { observacion_revision: "" } }
        : {}),
    },
  );

  if (actualizado.modifiedCount === 0) {
    const actual = await servicios.findOne(
      { _id: servicioId },
      { projection: { estado_aprobacion: 1 } },
    );
    return actual
      ? { resultado: "estado_cambiado", estadoActual: actual.estado_aprobacion }
      : { resultado: "no_encontrado" };
  }

  try {
    await revisiones.insertOne({
      servicio_id: servicioId,
      admin_id: adminOid,
      estado_anterior: "pendiente",
      estado_nuevo: estado,
      fecha,
      ...(comentario ? { observacion: comentario } : {}),
    });
  } catch (error) {
    // Sin registro de historial no se deja la decisión a medias: se revierte
    await servicios.updateOne(
      { _id: servicioId, estado_aprobacion: estado, revisado_por: adminOid },
      {
        $set: { estado_aprobacion: "pendiente" },
        $unset: { fecha_revision: "", revisado_por: "", observacion_revision: "" },
      },
    );
    throw error;
  }

  return { resultado: "ok" };
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

   const response = await coleccion.deleteOne({ _id: new ObjectId(id) });

  if (response.deletedCount > 0) {
    const publicIds = await deleteImagenesByServicio_delete(servicioExistente._id!);
    await Promise.all(publicIds.map((p) => borrarImagen(p)));
  }

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

  const docs = await db
    .collection(COLLECTION)
    .aggregate([{ $match: { usuario_id: new ObjectId(usuarioId) } }, LOOKUP_IMAGENES])
    .toArray();

  return docs as unknown as IServicio[];
}