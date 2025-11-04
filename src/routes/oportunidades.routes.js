import { Router } from 'express';
import oportunidadesController from '../controllers/oportunidades.controller.js';

const router = Router();

router.get('/', oportunidadesController.listar);
router.get('/:id', oportunidadesController.buscarPorId);
router.post('/', oportunidadesController.criar);
router.put('/:id', oportunidadesController.atualizar);
router.delete('/:id', oportunidadesController.excluir);

// Rotas adicionais
router.get('/categoria/:categoria_id', oportunidadesController.listarPorCategoria);
router.get('/organizacao/:organizacao_id', oportunidadesController.listarPorOrganizacao);

export default router;