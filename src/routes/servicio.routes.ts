
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
} from "../controller/servicio.controller.js";

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

export default router;
