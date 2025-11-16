/**
 * Validações reutilizáveis usando express-validator
 */

import { body, param, validationResult } from 'express-validator';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Middleware que verifica se há erros de validação
 */
export function handleValidationErrors(req, res, next) {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));
        
        throw new AppError('Erro de validação', 400, errorMessages);
    }
    
    next();
}

// ========== VALIDAÇÕES COMUNS ==========

export const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('ID deve ser um número inteiro positivo'),
    handleValidationErrors
];

export const validateEmail = body('email')
    .trim()
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail();

export const validateUrl = (field) => 
    body(field)
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isURL()
        .withMessage(`${field} deve ser uma URL válida`);

export const validateDate = (field) =>
    body(field)
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isISO8601()
        .withMessage(`${field} deve ser uma data válida (ISO 8601)`);

// ========== VALIDAÇÕES DE PESSOAS ==========

export const validatePessoaCriar = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 255 })
        .withMessage('Nome deve ter entre 3 e 255 caracteres'),
    
    validateEmail,
    
    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória')
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres'),
    
    body('bio')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Bio deve ter no máximo 1000 caracteres'),
    
    validateUrl('linkedin_url'),
    validateUrl('github_url'),
    validateUrl('portfolio_url'),
    
    handleValidationErrors
];

export const validatePessoaAtualizar = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('Nome deve ter entre 3 e 255 caracteres'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('senha')
        .optional()
        .isLength({ min: 6 })
        .withMessage('Senha deve ter no mínimo 6 caracteres'),
    
    body('bio')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Bio deve ter no máximo 1000 caracteres'),
    
    validateUrl('linkedin_url'),
    validateUrl('github_url'),
    validateUrl('portfolio_url'),
    
    handleValidationErrors
];

export const validateLogin = [
    validateEmail,
    
    body('senha')
        .notEmpty()
        .withMessage('Senha é obrigatória'),
    
    handleValidationErrors
];

// ========== VALIDAÇÕES DE CATEGORIAS ==========

export const validateCategoriaCriar = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 100 })
        .withMessage('Nome deve ter entre 3 e 100 caracteres'),
    
    body('descricao')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage('Descrição deve ter no máximo 500 caracteres'),
    
    handleValidationErrors
];

export const validateCategoriaAtualizar = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Nome deve ter entre 3 e 100 caracteres'),
    
    body('descricao')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 500 })
        .withMessage('Descrição deve ter no máximo 500 caracteres'),
    
    handleValidationErrors
];

// ========== VALIDAÇÕES DE ORGANIZAÇÕES ==========

export const validateOrganizacaoCriar = [
    body('nome')
        .trim()
        .notEmpty()
        .withMessage('Nome é obrigatório')
        .isLength({ min: 3, max: 255 })
        .withMessage('Nome deve ter entre 3 e 255 caracteres'),
    
    validateEmail,
    
    body('telefone')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .matches(/^[0-9\s()\-+]+$/)
        .withMessage('Telefone inválido'),
    
    body('descricao')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Descrição deve ter no máximo 2000 caracteres'),
    
    validateUrl('website'),
    
    handleValidationErrors
];

export const validateOrganizacaoAtualizar = [
    body('nome')
        .optional()
        .trim()
        .isLength({ min: 3, max: 255 })
        .withMessage('Nome deve ter entre 3 e 255 caracteres'),
    
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    
    body('telefone')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .matches(/^[0-9\s()\-+]+$/)
        .withMessage('Telefone inválido'),
    
    body('descricao')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 2000 })
        .withMessage('Descrição deve ter no máximo 2000 caracteres'),
    
    validateUrl('website'),
    
    handleValidationErrors
];

// ========== VALIDAÇÕES DE OPORTUNIDADES ==========

export const validateOportunidadeCriar = [
    body('titulo')
        .trim()
        .notEmpty()
        .withMessage('Título é obrigatório')
        .isLength({ min: 5, max: 255 })
        .withMessage('Título deve ter entre 5 e 255 caracteres'),
    
    body('descricao')
        .trim()
        .notEmpty()
        .withMessage('Descrição é obrigatória')
        .isLength({ min: 20 })
        .withMessage('Descrição deve ter no mínimo 20 caracteres'),
    
    body('categoria_id')
        .isInt({ min: 1 })
        .withMessage('categoria_id deve ser um número inteiro positivo'),
    
    body('organizacao_id')
        .isInt({ min: 1 })
        .withMessage('organizacao_id deve ser um número inteiro positivo'),
    
    body('tipo')
        .trim()
        .notEmpty()
        .withMessage('Tipo é obrigatório')
        .isIn(['emprego', 'estagio', 'curso', 'evento', 'projeto'])
        .withMessage('Tipo deve ser: emprego, estagio, curso, evento ou projeto'),
    
    body('status')
        .optional()
        .trim()
        .isIn(['ativa', 'encerrada', 'pausada'])
        .withMessage('Status deve ser: ativa, encerrada ou pausada'),
    
    validateDate('data_inicio'),
    validateDate('data_fim'),
    
    body('requisitos')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    
    body('beneficios')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    
    body('salario_min')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('salario_min deve ser um número positivo'),
    
    body('salario_max')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('salario_max deve ser um número positivo'),
    
    body('formato')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isIn(['presencial', 'remoto', 'hibrido'])
        .withMessage('Formato deve ser: presencial, remoto ou hibrido'),
    
    body('localizacao')
        .optional({ nullable: true, checkFalsy: true })
        .trim(),
    
    validateUrl('link_inscricao'),
    
    handleValidationErrors
];

export const validateOportunidadeAtualizar = [
    body('titulo')
        .optional()
        .trim()
        .isLength({ min: 5, max: 255 })
        .withMessage('Título deve ter entre 5 e 255 caracteres'),
    
    body('descricao')
        .optional()
        .trim()
        .isLength({ min: 20 })
        .withMessage('Descrição deve ter no mínimo 20 caracteres'),
    
    body('categoria_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('categoria_id deve ser um número inteiro positivo'),
    
    body('organizacao_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('organizacao_id deve ser um número inteiro positivo'),
    
    body('tipo')
        .optional()
        .trim()
        .isIn(['emprego', 'estagio', 'curso', 'evento', 'projeto'])
        .withMessage('Tipo deve ser: emprego, estagio, curso, evento ou projeto'),
    
    body('status')
        .optional()
        .trim()
        .isIn(['ativa', 'encerrada', 'pausada'])
        .withMessage('Status deve ser: ativa, encerrada ou pausada'),
    
    validateDate('data_inicio'),
    validateDate('data_fim'),
    
    body('salario_min')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('salario_min deve ser um número positivo'),
    
    body('salario_max')
        .optional({ nullable: true, checkFalsy: true })
        .isFloat({ min: 0 })
        .withMessage('salario_max deve ser um número positivo'),
    
    body('formato')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isIn(['presencial', 'remoto', 'hibrido'])
        .withMessage('Formato deve ser: presencial, remoto ou hibrido'),
    
    validateUrl('link_inscricao'),
    
    handleValidationErrors
];

// ========== VALIDAÇÕES DE INTERESSES ==========

export const validateInteresseCriar = [
    body('pessoa_id')
        .isInt({ min: 1 })
        .withMessage('pessoa_id deve ser um número inteiro positivo'),
    
    body('oportunidade_id')
        .isInt({ min: 1 })
        .withMessage('oportunidade_id deve ser um número inteiro positivo'),
    
    body('mensagem')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Mensagem deve ter no máximo 1000 caracteres'),
    
    body('status')
        .optional()
        .trim()
        .isIn(['pendente', 'aceito', 'rejeitado'])
        .withMessage('Status deve ser: pendente, aceito ou rejeitado'),
    
    handleValidationErrors
];

export const validateInteresseAtualizar = [
    body('mensagem')
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 1000 })
        .withMessage('Mensagem deve ter no máximo 1000 caracteres'),
    
    body('status')
        .optional()
        .trim()
        .isIn(['pendente', 'aceito', 'rejeitado'])
        .withMessage('Status deve ser: pendente, aceito ou rejeitado'),
    
    handleValidationErrors
];
