/**
 * Middleware de logging de requisições
 * Registra método, rota, tempo de execução e status da resposta
 */

/**
 * Formata a duração em ms para uma string legível
 */
function formatDuration(ms) {
    if (ms < 1000) {
        return `${ms.toFixed(0)}ms`;
    }
    return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Define a cor do log baseado no status HTTP
 */
function getStatusColor(status) {
    if (status >= 500) return '\x1b[31m'; // Vermelho
    if (status >= 400) return '\x1b[33m'; // Amarelo
    if (status >= 300) return '\x1b[36m'; // Ciano
    if (status >= 200) return '\x1b[32m'; // Verde
    return '\x1b[0m'; // Padrão
}

/**
 * Retorna emoji baseado no status HTTP
 */
function getStatusEmoji(status) {
    if (status >= 500) return '❌';
    if (status >= 400) return '⚠️';
    if (status >= 300) return '↩️';
    if (status >= 200) return '✅';
    return '📝';
}

/**
 * Middleware principal de logging
 */
function logger(req, res, next) {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    // Captura quando a resposta é finalizada
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { method, originalUrl, ip } = req;
        const { statusCode } = res;
        
        // Cores ANSI
        const colorReset = '\x1b[0m';
        const colorMethod = '\x1b[35m'; // Magenta
        const colorUrl = '\x1b[36m';     // Ciano
        const colorStatus = getStatusColor(statusCode);
        const colorTime = '\x1b[90m';    // Cinza
        
        // Emoji baseado no status
        const emoji = getStatusEmoji(statusCode);
        
        // Log formatado
        console.log(
            `${emoji} ${colorTime}[${timestamp}]${colorReset} ` +
            `${colorMethod}${method}${colorReset} ` +
            `${colorUrl}${originalUrl}${colorReset} ` +
            `${colorStatus}${statusCode}${colorReset} ` +
            `${colorTime}${formatDuration(duration)}${colorReset} ` +
            `${colorTime}(${ip})${colorReset}`
        );
        
        // Log detalhado para erros 5xx
        if (statusCode >= 500) {
            console.error('🔍 Detalhes do erro:', {
                method,
                url: originalUrl,
                status: statusCode,
                duration: `${duration}ms`,
                ip,
                userAgent: req.get('user-agent'),
                body: req.body
            });
        }
    });
    
    next();
}

/**
 * Logger simplificado (sem cores)
 */
function simpleLogger(req, res, next) {
    const startTime = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { method, originalUrl } = req;
        const { statusCode } = res;
        
        console.log(
            `[${new Date().toISOString()}] ${method} ${originalUrl} ${statusCode} ${duration}ms`
        );
    });
    
    next();
}

export { logger, simpleLogger };
