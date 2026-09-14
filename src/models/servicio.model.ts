import { ObjectId } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IServicio, ICreateServicioInput } from "../interfaces/servicio.interface.js";

const COLLECTION = "servicios";

// 🔹 GET all
export async function getServicios_get(): Promise<IServicio[]> {
  const db = mongoConnector.getDb();
  return db.collection<IServicio>(COLLECTION).find().toArray();
}

// 🔹 GET by ID
export async function getServicioById_get(id: string): Promise<IServicio | null> {
  const db = mongoConnector.getDb();
  return db.collection<IServicio>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

// 🔹 POST create
export async function createServicio_post(servicio: ICreateServicioInput): Promise<boolean> {
  try {
    const db = mongoConnector.getDb();

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
      throw new Error("El usuario dueño del servicio debe ser de tipo 'negocio'");
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
      // GeoJSON requiere el orden [longitud, latitud]
      ubicacion: {
        type: "Point",
        coordinates: [servicio.longitud, servicio.latitud],
      },
      fecha_creacion: new Date(),
      ...(servicio.descripcion !== undefined && { descripcion: servicio.descripcion }),
      ...(servicio.direccion !== undefined && { direccion: servicio.direccion }),
      ...(servicio.telefono !== undefined && { telefono: servicio.telefono }),
      ...(servicio.horario_atencion !== undefined && { horario_atencion: servicio.horario_atencion }),
      ...(servicio.precio !== undefined && { precio: servicio.precio }),
    };

    const response = await db.collection<IServicio>(COLLECTION).insertOne(doc);
    return response.acknowledged;
  } catch (error: any) {
    console.error("Error al crear servicio:", error.message);
    throw error;
  }
}

// 🔹 PUT update
// `usuarioIdAutenticado` se usa para verificar que quien edita es el dueño del servicio.
export async function updateServicio_put(
  id: string,
  cambios: Partial<Omit<IServicio, "_id" | "usuario_id" | "ubicacion">> & {
    categoria_id?: string;
    municipio_id?: string;
  },
  usuarioIdAutenticado: string
): Promise<boolean> {
  const db = mongoConnector.getDb();

  const servicioExistente = await db
    .collection<IServicio>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!servicioExistente) {
    return false;
  }

  if (servicioExistente.usuario_id.toString() !== usuarioIdAutenticado) {
    throw new Error("No tienes permiso para editar este servicio");
  }

  const datos: any = Object.fromEntries(
    Object.entries(cambios).filter(([, v]) => v !== undefined)
  );

  if (datos.categoria_id) {
    const categoriaDoc = await db
      .collection("categorias")
      .findOne({ _id: new ObjectId(datos.categoria_id) });
    if (!categoriaDoc) {
      throw new Error("La categoría indicada no existe");
    }
    datos.categoria_id = new ObjectId(datos.categoria_id);
  }

  if (datos.municipio_id) {
    const municipioDoc = await db
      .collection("municipios")
      .findOne({ _id: new ObjectId(datos.municipio_id) });
    if (!municipioDoc) {
      throw new Error("El municipio indicado no existe");
    }
    datos.municipio_id = new ObjectId(datos.municipio_id);
  }

  // Si cambia latitud y/o longitud, recalculamos también "ubicacion"
  if (datos.latitud !== undefined || datos.longitud !== undefined) {
    const nuevaLat = datos.latitud ?? servicioExistente.latitud;
    const nuevaLng = datos.longitud ?? servicioExistente.longitud;
    datos.ubicacion = {
      type: "Point",
      coordinates: [nuevaLng, nuevaLat],
    };
  }

  const response = await db
    .collection<IServicio>(COLLECTION)
    .updateOne({ _id: new ObjectId(id) }, { $set: datos });

  return response.matchedCount > 0;
}

// 🔹 DELETE
// `usuarioIdAutenticado` se usa para verificar que quien borra es el dueño del servicio.
export async function deleteServicio_delete(
  id: string,
  usuarioIdAutenticado: string
): Promise<boolean> {
  const db = mongoConnector.getDb();

  const servicioExistente = await db
    .collection<IServicio>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });

  if (!servicioExistente) {
    return false;
  }

  if (servicioExistente.usuario_id.toString() !== usuarioIdAutenticado) {
    throw new Error("No tienes permiso para eliminar este servicio");
  }

  const response = await db.collection<IServicio>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return response.deletedCount > 0;
}