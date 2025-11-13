import { Router } from 'express';
import oportunidadesController from '../controllers/oportunidades.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
    validateId, 
    validateOportunidadeCriar, 
    validateOportunidadeAtualizar 
} from '../middlewares/validators.js';

const router = Router();

// Rotas públicas
router.get('/', oportunidadesController.listar);
router.get('/:id', validateId, oportunidadesController.buscarPorId);
router.get('/categoria/:categoria_id', validateId, oportunidadesController.listarPorCategoria);
router.get('/organizacao/:organizacao_id', validateId, oportunidadesController.listarPorOrganizacao);

// Rotas protegidas (requerem autenticação)
router.post('/', validateOportunidadeCriar, authMiddleware, oportunidadesController.criar);
router.put('/:id', validateId, validateOportunidadeAtualizar, authMiddleware, oportunidadesController.atualizar);
router.delete('/:id', validateId, authMiddleware, oportunidadesController.excluir);

export default router;