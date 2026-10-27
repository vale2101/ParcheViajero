import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

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
  updateFotoPerfil,
  deleteFotoPerfil,
} from "../controller/usuario.controller.js";

const router = Router();

router.get("/getUsuarios", requireAuth, requireAdmin, getUsuarios);
router.get("/findUsuarioById/:id", requireAuth, requireAdmin, getUsuarioById);
router.post("/createUsuario", validateSchema(createUsuarioSchema), createUsuario);
router.put("/updateUsuario/:id", requireAuth, validateSchema(updateUsuarioSchema), updateUsuario);
router.delete("/delete/:id", requireAuth, deleteUsuario);
router.post("/login", validateSchema(loginUsuarioSchema), loginUsuario);
router.post("/logout", logoutUsuario);
router.get("/me", getCurrentUsuario);

// Foto de perfil
router.put("/:id/foto", requireAuth, upload.single("foto"), updateFotoPerfil);
router.delete("/:id/foto", requireAuth, deleteFotoPerfil);

export default router;