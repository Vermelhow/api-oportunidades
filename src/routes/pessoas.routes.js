import { Router } from 'express';
import { PessoasController } from '../controllers/pessoas.controller.js';

const router = Router();
const controller = new PessoasController();

// Rotas básicas
router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.excluir);

// Rotas específicas
router.get('/:id/interesses', controller.listarInteresses);

export default router;