import { Router } from 'express';
import interessesController from '../controllers/interesses.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { 
    validateId, 
    validateInteresseCriar, 
    validateInteresseAtualizar 
} from '../middlewares/validators.js';

const router = Router();

// Rotas públicas
router.get('/', interessesController.listar.bind(interessesController));
router.get('/:id', validateId, interessesController.buscarPorId.bind(interessesController));
router.get('/pessoa/:pessoa_id', validateId, interessesController.listarPorPessoa.bind(interessesController));
router.get('/oportunidade/:oportunidade_id', validateId, interessesController.listarPorOportunidade.bind(interessesController));

// Rotas protegidas (requerem autenticação)
router.post('/', validateInteresseCriar, authMiddleware, interessesController.criar.bind(interessesController));
router.put('/:id', validateId, validateInteresseAtualizar, authMiddleware, interessesController.atualizar.bind(interessesController));
router.delete('/:id', validateId, authMiddleware, interessesController.excluir.bind(interessesController));

export default router;