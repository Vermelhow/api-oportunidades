/**
 * Middleware de autenticação JWT
 * Valida tokens JWT e protege rotas
 */

import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';

// Chave secreta para assinar tokens (em produção, usar variável de ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura_123';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Gera um token JWT para um usuário
 */
export function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError('Token expirado', 401);
        }
        if (error.name === 'JsonWebTokenError') {
            throw new AppError('Token inválido', 401);
        }
        throw new AppError('Erro ao validar token', 401);
    }
}

/**
 * Middleware que exige autenticação
 */
export function authMiddleware(req, res, next) {
    try {
        // Busca o token no header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            throw new AppError('Token não fornecido', 401, {
                hint: 'Inclua o header: Authorization: Bearer <seu_token>'
            });
        }

        // Formato esperado: "Bearer TOKEN"
        const parts = authHeader.split(' ');
        
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new AppError('Formato de token inválido', 401, {
                hint: 'Use o formato: Bearer <seu_token>'
            });
        }

        const token = parts[1];
        
        // Verifica e decodifica o token
        const decoded = verifyToken(token);
        
        // Adiciona os dados do usuário na requisição
        req.user = decoded;
        
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware que verifica se o usuário é o dono do recurso
 */
export function checkResourceOwner(req, res, next) {
    try {
        const userId = req.user?.id;
        const resourceUserId = Number.parseInt(req.params.id, 10);
        
        if (!userId) {
            throw new AppError('Usuário não autenticado', 401);
        }
        
        if (userId !== resourceUserId) {
            throw new AppError('Você não tem permissão para acessar este recurso', 403);
        }
        
        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware opcional que tenta autenticar, mas não exige
 */
export function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader) {
            const parts = authHeader.split(' ');
            
            if (parts.length === 2 && parts[0] === 'Bearer') {
                const token = parts[1];
                const decoded = verifyToken(token);
                req.user = decoded;
            }
        }
        
        next();
    } catch (error) {
        // Ignora erros de autenticação e continua sem autenticar
        console.debug('Optional auth failed:', error.message);
        next();
    }
}
