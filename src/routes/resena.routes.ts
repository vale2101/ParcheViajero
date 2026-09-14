import { Router } from "express";
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
router.post("/createResena", validateSchema(createResenaSchema), createResena);
router.put("/updateResena/:id", validateSchema(updateResenaSchema), updateResena);
router.delete("/delete/:id", deleteResena);

export default router;