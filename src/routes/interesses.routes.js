import { Router } from 'express';
import interessesController from '../controllers/interesses.controller.js';

const router = Router();

router.get('/', interessesController.listar);
router.get('/:id', interessesController.buscarPorId);
router.post('/', interessesController.criar);
router.put('/:id', interessesController.atualizar);
router.delete('/:id', interessesController.excluir);

// Rotas adicionais para listar interesses por pessoa e por oportunidade
router.get('/pessoa/:pessoa_id', interessesController.listarPorPessoa);
router.get('/oportunidade/:oportunidade_id', interessesController.listarPorOportunidade);

export default router;