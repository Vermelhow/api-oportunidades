/**
 * Middleware global de tratamento de erros
 * Captura e padroniza erros da aplicação
 */

class AppError extends Error {
    constructor(message, status = 500, details = null) {
        super(message);
        this.status = status;
        this.details = details;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Middleware de tratamento de erros
 */
function errorHandler(err, req, res, next) {
    // Define valores padrão
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';
    const details = err.details || null;

    // Log do erro para debug
    if (status >= 500) {
        console.error('❌ Erro interno:', {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            status,
            message,
            stack: err.stack
        });
    } else {
        console.warn('⚠️ Erro da aplicação:', {
            timestamp: new Date().toISOString(),
            method: req.method,
            url: req.url,
            status,
            message
        });
    }

    // Resposta padronizada
    res.status(status).json({
        success: false,
        status,
        message,
        ...(details && { details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

/**
 * Middleware para rotas não encontradas (404)
 */
function notFoundHandler(req, res, next) {
    const error = new AppError(
        `Rota não encontrada: ${req.method} ${req.originalUrl}`,
        404
    );
    next(error);
}

export { errorHandler, notFoundHandler, AppError };
