import { Router } from "express";
import { getMunicipios, getMunicipioById } from "../controller/municipio.controller.js";

const router = Router();

router.get("/getMunicipios", getMunicipios);
router.get("/findMunicipioById/:id", getMunicipioById);

export default router;