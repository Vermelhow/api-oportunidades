/**
 * Utilitários de Autenticação
 * 
 * Funções auxiliares para validação de token JWT,
 * verificação de expiração e outras operações de autenticação.
 */

/**
 * Decodifica um token JWT sem validar a assinatura
 * Útil apenas para ler o payload do token
 */
export function decodeToken(token) {
  if (!token) return null;

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
}

/**
 * Verifica se o token JWT está expirado
 * @param {string} token - Token JWT
 * @returns {boolean} true se expirado, false caso contrário
 */
export function isTokenExpired(token) {
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  // exp é em segundos, Date.now() é em milissegundos
  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();

  // Adiciona margem de 60 segundos para evitar problemas de sincronização
  return currentTime >= (expirationTime - 60000);
}

/**
 * Valida se um token JWT tem a estrutura correta
 * @param {string} token - Token JWT
 * @returns {boolean} true se válido, false caso contrário
 */
export function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  // Verifica se cada parte é base64 válido
  try {
    atob(parts[0]);
    atob(parts[1]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtém informações do usuário do token
 * @param {string} token - Token JWT
 * @returns {object|null} Dados do usuário ou null
 */
export function getUserFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.id,
    nome: decoded.nome,
    email: decoded.email,
  };
}

/**
 * Valida se o email tem formato correto
 * @param {string} email - Email a ser validado
 * @returns {boolean} true se válido, false caso contrário
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;

  // Regex simples mas efetivo para validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Valida força da senha
 * @param {string} senha - Senha a ser validada
 * @returns {object} Resultado da validação com isValid e mensagem
 */
export function validatePassword(senha) {
  if (!senha || typeof senha !== 'string') {
    return { isValid: false, message: 'Senha é obrigatória' };
  }

  if (senha.length < 6) {
    return { isValid: false, message: 'Senha deve ter no mínimo 6 caracteres' };
  }

  if (senha.length > 100) {
    return { isValid: false, message: 'Senha muito longa' };
  }

  return { isValid: true, message: '' };
}

/**
 * Limpa dados de autenticação do localStorage
 */
export function clearAuthStorage() {
  localStorage.removeItem('@api-oportunidades:token');
  localStorage.removeItem('@api-oportunidades:user');
}

/**
 * Salva dados de autenticação no localStorage
 */
export function saveAuthStorage(token, user) {
  if (token) {
    localStorage.setItem('@api-oportunidades:token', token);
  }
  if (user) {
    localStorage.setItem('@api-oportunidades:user', JSON.stringify(user));
  }
}

/**
 * Obtém dados de autenticação do localStorage
 */
export function getAuthStorage() {
  const token = localStorage.getItem('@api-oportunidades:token');
  const userJson = localStorage.getItem('@api-oportunidades:user');

  let user = null;
  if (userJson) {
    try {
      user = JSON.parse(userJson);
    } catch (error) {
      console.error('Erro ao parsear dados do usuário:', error);
    }
  }

  return { token, user };
}
