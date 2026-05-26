import { Router } from 'express';
import organizacoesController from '../controllers/organizacoes.controller.js';
import { 
    validateId, 
    validateOrganizacaoCriar, 
    validateOrganizacaoAtualizar 
} from '../middlewares/validators.js';

const router = Router();

router.get('/', organizacoesController.listar.bind(organizacoesController));
router.get('/:id', validateId, organizacoesController.buscarPorId.bind(organizacoesController));
router.post('/', validateOrganizacaoCriar, organizacoesController.criar.bind(organizacoesController));
router.put('/:id', validateId, validateOrganizacaoAtualizar, organizacoesController.atualizar.bind(organizacoesController));
router.delete('/:id', validateId, organizacoesController.excluir.bind(organizacoesController));

export default router;