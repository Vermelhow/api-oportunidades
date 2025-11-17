import { Router } from "express";
import * as ctrl from "../controllers/categorias.controller.js";
import { 
    validateId, 
    validateCategoriaCriar, 
    validateCategoriaAtualizar 
} from '../middlewares/validators.js';

const r = Router();
r.get("/", ctrl.list);
r.get("/:id", validateId, ctrl.get);
r.post("/", validateCategoriaCriar, ctrl.create);
r.put("/:id", validateId, validateCategoriaAtualizar, ctrl.update);
r.delete("/:id", validateId, ctrl.remove);

export default r; 