import { Router } from "express";
import { getCategorias, getCategoriaById } from "../controller/categoria.controller.js";

const router = Router();

router.get("/getCategorias", getCategorias);
router.get("/findCategoriaById/:id", getCategoriaById);

export default router;