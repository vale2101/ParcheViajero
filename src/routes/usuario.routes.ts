import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";


import {
  createUsuarioSchema,
  updateUsuarioSchema,
  loginUsuarioSchema,
} from "../schemas/usuario.schemas.js";

import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  logoutUsuario,
  getCurrentUsuario,
} from "../controller/usuario.controller.js";

const router = Router();

router.get("/getUsuarios", requireAuth, requireAdmin, getUsuarios);
router.get("/findUsuarioById/:id", requireAuth, requireAdmin, getUsuarioById);
router.post("/createUsuario", validateSchema(createUsuarioSchema), createUsuario);
router.put("/updateUsuario/:id", requireAuth, validateSchema(updateUsuarioSchema), updateUsuario);router.delete("/delete/:id", deleteUsuario);
router.post("/login", validateSchema(loginUsuarioSchema), loginUsuario);
router.post("/logout", logoutUsuario);
router.get("/me", getCurrentUsuario);

export default router;