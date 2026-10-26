import { ObjectId, type Document } from "mongodb";
import { mongoConnector } from "../db/connection.js";
import type { IRevisionServicio } from "../interfaces/revision.interface.js";

const ESTADOS = ["pendiente", "aprobado", "rechazado"];
const LIMITE = 200;

export type TipoCuenta = "negocio" | "registrado";
export type Orden = "asc" | "desc";

export interface FiltrosServicios {
  estado?: string | undefined;
  q?: string | undefined;
  categoriaId?: string | undefined;
  municipioId?: string | undefined;
  usuarioId?: string | undefined;
  desde?: string | undefined;
  orden?: Orden | undefined;
}

const escapar = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Une cada servicio con su propietario, categoría y municipio (sin datos sensibles)
function etapasEnriquecimiento(): Document[] {
  return [
    { $lookup: { from: "usuarios", localField: "usuario_id", foreignField: "_id", as: "propietario" } },
    { $unwind: { path: "$propietario", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "categorias", localField: "categoria_id", foreignField: "_id", as: "categoria" } },
    { $unwind: { path: "$categoria", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "municipios", localField: "municipio_id", foreignField: "_id", as: "municipio" } },
    { $unwind: { path: "$municipio", preserveNullAndEmptyArrays: true } },
    { $addFields: { categoria_nombre: "$categoria.nombre", municipio_nombre: "$municipio.nombre" } },
    {
      $project: {
        categoria: 0,
        municipio: 0,
        "propietario.password_hash": 0,
        "propietario.tipo_usuario_id": 0,
      },
    },
  ];
}

export async function getResumen_get() {
  const db = mongoConnector.getDb();
  const servicios = db.collection("servicios");

  const contarUsuarios = async (tipo: TipoCuenta) => {
    const doc = await db.collection("tipos_usuario").findOne({ nombre: tipo });
    return doc ? db.collection("usuarios").countDocuments({ tipo_usuario_id: doc._id }) : 0;
  };

  const [pendientes, totalServicios, negocios, viajeros] = await Promise.all([
    servicios.countDocuments({ estado_aprobacion: "pendiente" }),
    servicios.countDocuments({}),
    contarUsuarios("negocio"),
    contarUsuarios("registrado"),
  ]);

  return { pendientes, totalServicios, negocios, viajeros };
}

export async function listarServicios_get(f: FiltrosServicios): Promise<Document[]> {
  const db = mongoConnector.getDb();
  const match: Document = {};

  if (f.estado && ESTADOS.includes(f.estado)) match["estado_aprobacion"] = f.estado;
  if (f.categoriaId && ObjectId.isValid(f.categoriaId)) match["categoria_id"] = new ObjectId(f.categoriaId);
  if (f.municipioId && ObjectId.isValid(f.municipioId)) match["municipio_id"] = new ObjectId(f.municipioId);
  if (f.usuarioId && ObjectId.isValid(f.usuarioId)) match["usuario_id"] = new ObjectId(f.usuarioId);
  if (f.desde) {
    const d = new Date(f.desde);
    if (!Number.isNaN(d.getTime())) match["fecha_creacion"] = { $gte: d };
  }

  const pipeline: Document[] = [{ $match: match }, ...etapasEnriquecimiento()];

  const q = f.q?.trim();
  if (q) {
    const rx = new RegExp(escapar(q), "i");
    pipeline.push({
      $match: {
        $or: [{ nombre: rx }, { "propietario.nombre": rx }, { municipio_nombre: rx }],
      },
    });
  }

  // Pendientes: de la más antigua a la más reciente. El resto: más recientes primero.
  const orden: Orden = f.orden ?? (f.estado === "pendiente" ? "asc" : "desc");
  const dir = orden === "asc" ? 1 : -1;
  pipeline.push({ $sort: { fecha_creacion: dir, _id: dir } }, { $limit: LIMITE });

  return db.collection("servicios").aggregate(pipeline).toArray();
}

export async function getServicioAdmin_get(id: string) {
  const db = mongoConnector.getDb();
  const _id = new ObjectId(id);

  const [servicio] = await db
    .collection("servicios")
    .aggregate([{ $match: { _id } }, ...etapasEnriquecimiento()])
    .toArray();

  if (!servicio) return null;

  const historial = await db
    .collection<IRevisionServicio>("revisiones_servicio")
    .aggregate([
      { $match: { servicio_id: _id } },
      { $sort: { fecha: -1 } },
      { $lookup: { from: "usuarios", localField: "admin_id", foreignField: "_id", as: "admin" } },
      { $unwind: { path: "$admin", preserveNullAndEmptyArrays: true } },
      { $addFields: { admin_nombre: "$admin.nombre" } },
      { $project: { admin: 0 } },
    ])
    .toArray();

  return { servicio, historial };
}

export async function listarUsuarios_get(
  tipo: TipoCuenta,
  q: string | undefined,
  orden: Orden,
): Promise<Document[]> {
  const db = mongoConnector.getDb();
  const tipoDoc = await db.collection("tipos_usuario").findOne({ nombre: tipo });
  if (!tipoDoc) return [];

  const match: Document = { tipo_usuario_id: tipoDoc._id };
  const texto = q?.trim();
  if (texto) {
    const rx = new RegExp(escapar(texto), "i");
    match["$or"] = [{ nombre: rx }, { email: rx }];
  }

  const dir = orden === "asc" ? 1 : -1;

  const pipeline: Document[] = [
    { $match: match },
    { $sort: { fecha_registro: dir, _id: dir } },
    { $limit: LIMITE },
    { $addFields: { tipo_usuario: tipo } },
  ];

  if (tipo === "negocio") {
    pipeline.push(
      { $lookup: { from: "servicios", localField: "_id", foreignField: "usuario_id", as: "servicios" } },
      { $addFields: { total_servicios: { $size: "$servicios" } } },
    );
  }

  pipeline.push({ $project: { password_hash: 0, servicios: 0, tipo_usuario_id: 0 } });

  return db.collection("usuarios").aggregate(pipeline).toArray();
}

export async function getUsuarioAdmin_get(id: string) {
  const db = mongoConnector.getDb();

  const [usuario] = await db
    .collection("usuarios")
    .aggregate([
      { $match: { _id: new ObjectId(id) } },
      { $lookup: { from: "tipos_usuario", localField: "tipo_usuario_id", foreignField: "_id", as: "tipo" } },
      { $unwind: "$tipo" },
      { $addFields: { tipo_usuario: "$tipo.nombre" } },
      { $project: { tipo: 0, password_hash: 0, tipo_usuario_id: 0 } },
    ])
    .toArray();

  if (!usuario) return null;

  const servicios =
    usuario["tipo_usuario"] === "negocio"
      ? await listarServicios_get({ usuarioId: id, orden: "desc" })
      : [];

  return { usuario, servicios };
}
export async function listarResenas_get(
  q: string | undefined,
  calificacion: number | undefined,
  orden: Orden,
): Promise<Document[]> {
  const db = mongoConnector.getDb();
  const match: Document = {};

  if (calificacion !== undefined && Number.isInteger(calificacion) && calificacion >= 1 && calificacion <= 5) {
    match["calificacion"] = calificacion;
  }

  const pipeline: Document[] = [
    { $match: match },
    { $lookup: { from: "usuarios", localField: "usuario_id", foreignField: "_id", as: "autor" } },
    { $unwind: { path: "$autor", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "servicios", localField: "servicio_id", foreignField: "_id", as: "servicio" } },
    { $unwind: { path: "$servicio", preserveNullAndEmptyArrays: true } },
    {
      $addFields: {
        autor_nombre: "$autor.nombre",
        autor_email: "$autor.email",
        servicio_nombre: "$servicio.nombre",
      },
    },
    { $project: { autor: 0, servicio: 0 } },
  ];

  const texto = q?.trim();
  if (texto) {
    const rx = new RegExp(escapar(texto), "i");
    pipeline.push({
      $match: {
        $or: [{ autor_nombre: rx }, { autor_email: rx }, { servicio_nombre: rx }, { comentario: rx }],
      },
    });
  }

  const dir = orden === "asc" ? 1 : -1;
  pipeline.push({ $sort: { fecha: dir, _id: dir } }, { $limit: LIMITE });

  return db.collection("resenas").aggregate(pipeline).toArray();
}