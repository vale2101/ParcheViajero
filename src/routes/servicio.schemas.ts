import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware.js";
import { createServicioSchema, updateServicioSchema } from "../schemas/servicio.schemas.js";
import {
  getServicios,
  getServicioById,
  createServicio,
  updateServicio,
  deleteServicio,
} from "../controller/servicio.controller.js";

const router = Router();

router.get("/getServicios", getServicios);
router.get("/findServicioById/:id", getServicioById);
router.post("/createServicio", validateSchema(createServicioSchema), createServicio);
router.put("/updateServicio/:id", validateSchema(updateServicioSchema), updateServicio);
router.delete("/delete/:id", deleteServicio);

export default router;