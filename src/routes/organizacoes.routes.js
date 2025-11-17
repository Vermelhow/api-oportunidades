import { Router } from 'express';
import organizacoesController from '../controllers/organizacoes.controller.js';
import { 
    validateId, 
    validateOrganizacaoCriar, 
    validateOrganizacaoAtualizar 
} from '../middlewares/validators.js';

const router = Router();

router.get('/', organizacoesController.listar);
router.get('/:id', validateId, organizacoesController.buscarPorId);
router.post('/', validateOrganizacaoCriar, organizacoesController.criar);
router.put('/:id', validateId, validateOrganizacaoAtualizar, organizacoesController.atualizar);
router.delete('/:id', validateId, organizacoesController.excluir);

export default router;