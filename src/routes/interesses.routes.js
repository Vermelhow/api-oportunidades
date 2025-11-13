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
router.get('/', interessesController.listar);
router.get('/:id', validateId, interessesController.buscarPorId);
router.get('/pessoa/:pessoa_id', validateId, interessesController.listarPorPessoa);
router.get('/oportunidade/:oportunidade_id', validateId, interessesController.listarPorOportunidade);

// Rotas protegidas (requerem autenticação)
router.post('/', validateInteresseCriar, authMiddleware, interessesController.criar);
router.put('/:id', validateId, validateInteresseAtualizar, authMiddleware, interessesController.atualizar);
router.delete('/:id', validateId, authMiddleware, interessesController.excluir);

export default router;