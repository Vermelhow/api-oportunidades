import { Router } from 'express';
import oportunidadesController from '../controllers/oportunidades.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
    validateId, 
    validateParamId,
    validateOportunidadeCriar, 
    validateOportunidadeAtualizar 
} from '../middlewares/validators.js';

const router = Router();

// Rotas públicas
router.get('/', oportunidadesController.listar.bind(oportunidadesController));
router.get('/:id', validateId, oportunidadesController.buscarPorId.bind(oportunidadesController));
router.get('/categoria/:categoria_id', validateParamId('categoria_id'), oportunidadesController.listarPorCategoria.bind(oportunidadesController));
router.get('/organizacao/:organizacao_id', validateParamId('organizacao_id'), oportunidadesController.listarPorOrganizacao.bind(oportunidadesController));

// Rotas protegidas (requerem autenticação)
router.post('/', validateOportunidadeCriar, authMiddleware, oportunidadesController.criar.bind(oportunidadesController));
router.put('/:id', validateId, validateOportunidadeAtualizar, authMiddleware, oportunidadesController.atualizar.bind(oportunidadesController));
router.delete('/:id', validateId, authMiddleware, oportunidadesController.excluir.bind(oportunidadesController));

export default router;