import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateSchema } from "../middleware/validateSchemas.middleware.js";
import { createResenaSchema, updateResenaSchema } from "../schemas/resena.schemas.js";
import {
  getResenas,
  getResenaById,
  getResenasByServicio,
  createResena,
  updateResena,
  deleteResena,
} from "../controller/resena.controller.js";

const router = Router();

router.get("/getResenas", getResenas);
router.get("/findResenaById/:id", getResenaById);
router.get("/findResenasByServicio/:servicioId", getResenasByServicio);
router.post("/createResena", requireAuth, validateSchema(createResenaSchema), createResena);
router.put("/updateResena/:id", requireAuth, validateSchema(updateResenaSchema), updateResena);
router.delete("/delete/:id", requireAuth, deleteResena);

export default router;