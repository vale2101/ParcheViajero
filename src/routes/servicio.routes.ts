
import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

import {
  createServicioSchema,
  updateServicioSchema,
} from "../schemas/servicio.schemas.js";

import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
  getMisServicios,
  revisarServicio,
  getImagenesServicio,
  addImagenesServicio,
  deleteImagenServicio
} from "../controller/servicio.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

// Lectura pública
router.get("/getServicios", getServicios);
router.get("/findServicioById/:id", getServicioById);

// Escritura: requiere autenticación
router.post(
  "/createServicio",
  requireAuth,
  validateSchema(createServicioSchema),
  createServicio,
);

router.put(
  "/updateServicio/:id",
  requireAuth,
  validateSchema(updateServicioSchema),
  updateServicio,
);

router.delete("/delete/:id", requireAuth, deleteServicio);
router.get("/mis-servicios", requireAuth, getMisServicios);

router.put(
  "/:id/revision",
  requireAuth,
  requireAdmin,
  revisarServicio,
);

// Imágenes
router.get("/:id/imagenes", getImagenesServicio);
router.post("/:id/imagenes", requireAuth, upload.array("imagenes", 6), addImagenesServicio);
router.delete("/imagenes/:imagenId", requireAuth, deleteImagenServicio);

export default router;
