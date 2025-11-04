import { Router } from 'express';
import organizacoesController from '../controllers/organizacoes.controller.js';

const router = Router();

router.get('/', organizacoesController.listar);
router.get('/:id', organizacoesController.buscarPorId);
router.post('/', organizacoesController.criar);
router.put('/:id', organizacoesController.atualizar);
router.delete('/:id', organizacoesController.excluir);

export default router;