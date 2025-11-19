/**
 * Helper para padronizar respostas da API
 */

/**
 * Resposta de sucesso padronizada
 * @param {Object} res - Response object do Express
 * @param {*} data - Dados a serem retornados
 * @param {string} message - Mensagem de sucesso (opcional)
 * @param {number} statusCode - Código HTTP (padrão: 200)
 */
export function successResponse(res, data, message = null, statusCode = 200) {
    const response = {
        success: true,
        ...(message && { message }),
        data
    };
    
    return res.status(statusCode).json(response);
}

/**
 * Resposta de criação bem-sucedida (201)
 */
export function createdResponse(res, data, message = 'Criado com sucesso') {
    return successResponse(res, data, message, 201);
}

/**
 * Resposta sem conteúdo (204)
 */
export function noContentResponse(res) {
    return res.status(204).send();
}

/**
 * Resposta de erro padronizada (já tratada pelo errorHandler)
 * Este helper é apenas para referência, use throw new AppError()
 */
export function errorResponse(res, message, statusCode = 500, details = null) {
    const response = {
        success: false,
        status: statusCode,
        message,
        ...(details && { details })
    };
    
    return res.status(statusCode).json(response);
}
