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
router.post('/login', validateLogin, controller.login.bind(controller));
router.post('/', validatePessoaCriar, controller.criar.bind(controller));
router.get('/', controller.listar.bind(controller));
router.get('/:id', validateId, controller.buscarPorId.bind(controller));

// Rotas protegidas (requerem autenticação)
router.put('/:id', validateId, validatePessoaAtualizar, authMiddleware, checkResourceOwner, controller.atualizar.bind(controller));
router.delete('/:id', validateId, authMiddleware, checkResourceOwner, controller.excluir.bind(controller));

// Rotas específicas
router.get('/:id/interesses', validateId, controller.listarInteresses.bind(controller));

export default router;