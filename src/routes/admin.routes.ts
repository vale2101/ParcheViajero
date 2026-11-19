import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import {
  getResumen,
  listarServicios,
  getServicioAdmin,
  listarUsuarios,
  getUsuarioAdmin,
  listarResenas,
  eliminarResena,
  eliminarServicioAdmin,
  eliminarUsuarioAdmin,
} from "../controller/admin.controller.js";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/resumen", getResumen);
router.get("/servicios", listarServicios);
router.get("/servicios/:id", getServicioAdmin);
router.delete("/servicios/:id", eliminarServicioAdmin);
router.get("/usuarios", listarUsuarios);
router.get("/usuarios/:id", getUsuarioAdmin);
router.delete("/usuarios/:id", eliminarUsuarioAdmin);
router.get("/resenas", listarResenas);
router.delete("/resenas/:id", eliminarResena);

export default router;