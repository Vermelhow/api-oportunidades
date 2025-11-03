import express from 'express';
import {
  inscreverEmOportunidade,
  listarInscricoesPorPessoa,
  listarInscricoesPorOportunidade,
  atualizarStatusInscricao,
  cancelarInscricao
} from '../controllers/inscricoes.controller.js';

const router = express.Router();

// Criar uma nova inscrição
router.post('/', inscreverEmOportunidade);

// Listar inscrições por pessoa
router.get('/pessoa/:pessoa_id', listarInscricoesPorPessoa);

// Listar inscrições por oportunidade
router.get('/oportunidade/:oportunidade_id', listarInscricoesPorOportunidade);

// Atualizar status da inscrição
router.patch('/:id/status', atualizarStatusInscricao);

// Cancelar inscrição
router.delete('/:id', cancelarInscricao);

export default router;