import { Router } from 'express';
import { PessoasController } from '../controllers/pessoas.controller.js';
import { authMiddleware, checkResourceOwner } from '../middlewares/authMiddleware.js';
import { 
    validateId, 
    validateLogin, 
    validatePessoaCriar, 
    validatePessoaAtualizar 
} from '../middlewares/validators.js';

const router = Router();
const controller = new PessoasController();

// Rotas públicas
router.post('/login', validateLogin, controller.login);
router.post('/', validatePessoaCriar, controller.criar);
router.get('/', controller.listar);
router.get('/:id', validateId, controller.buscarPorId);

// Rotas protegidas (requerem autenticação)
router.put('/:id', validateId, validatePessoaAtualizar, authMiddleware, checkResourceOwner, controller.atualizar);
router.delete('/:id', validateId, authMiddleware, checkResourceOwner, controller.excluir);

// Rotas específicas
router.get('/:id/interesses', validateId, controller.listarInteresses);

export default router;