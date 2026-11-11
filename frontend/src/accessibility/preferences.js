/**
 * Preferências de acessibilidade (REQ-A29 a REQ-A32)
 *
 * Módulo sem dependência de React: valida valores, lê/grava no localStorage e
 * aplica as preferências como atributos data-a11y-* no <html>. Os estilos que
 * reagem a esses atributos ficam em styles/accessibility-preferences.css.
 *
 * Regra de ouro: no valor padrão o atributo NÃO existe. Assim, sem preferência
 * salva, a aplicação renderiza exatamente como antes.
 */

export const STORAGE_KEY = '@api-oportunidades:a11y-preferences';
export const PREFERENCES_VERSION = 1;

export const OPTIONS = Object.freeze({
  text: ['100', '125', '150'],
  contrast: ['default', 'high'],
  lineHeight: ['default', 'medium', 'wide'],
  letterSpacing: ['default', 'medium', 'wide'],
  wordSpacing: ['default', 'medium', 'wide'],
  paragraphSpacing: ['default', 'medium', 'wide'],
});

export const DEFAULT_PREFERENCES = Object.freeze({
  text: '100',
  contrast: 'default',
  lineHeight: 'default',
  letterSpacing: 'default',
  wordSpacing: 'default',
  paragraphSpacing: 'default',
});

export const SPACING_KEYS = Object.freeze(['lineHeight', 'letterSpacing', 'wordSpacing', 'paragraphSpacing']);

const ATTRIBUTES = Object.freeze({
  text: 'data-a11y-text',
  contrast: 'data-a11y-contrast',
  lineHeight: 'data-a11y-line',
  letterSpacing: 'data-a11y-letter',
  wordSpacing: 'data-a11y-word',
  paragraphSpacing: 'data-a11y-paragraph',
});

/**
 * Devolve um objeto de preferências sempre válido: chaves desconhecidas são
 * descartadas e valores fora da lista permitida voltam ao padrão.
 */
export function sanitizePreferences(raw) {
  const result = { ...DEFAULT_PREFERENCES };
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return result;

  for (const key of Object.keys(OPTIONS)) {
    const value = raw[key];
    if (typeof value === 'string' && OPTIONS[key].includes(value)) {
      result[key] = value;
    }
  }
  return result;
}

export function isDefaultPreferences(prefs) {
  const clean = sanitizePreferences(prefs);
  return Object.keys(DEFAULT_PREFERENCES).every((key) => clean[key] === DEFAULT_PREFERENCES[key]);
}

/**
 * Converte o texto salvo em preferências válidas. Qualquer problema
 * (JSON inválido, tipo errado, versão desconhecida) resulta no padrão.
 */
export function parseStoredPreferences(json) {
  if (typeof json !== 'string' || json === '') return { ...DEFAULT_PREFERENCES };

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }

  if (!parsed || typeof parsed !== 'object' || parsed.v !== PREFERENCES_VERSION) {
    return { ...DEFAULT_PREFERENCES };
  }
  return sanitizePreferences(parsed);
}

// Em alguns navegadores (modo privado, cookies bloqueados) até ler window.localStorage lança erro
function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadPreferences(storage = getStorage()) {
  if (!storage) return { ...DEFAULT_PREFERENCES };
  try {
    return parseStoredPreferences(storage.getItem(STORAGE_KEY));
  } catch {
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Salva as preferências. Preferências iguais ao padrão removem a chave.
 * @returns {boolean} false se o armazenamento está indisponível ou cheio
 */
export function savePreferences(prefs, storage = getStorage()) {
  if (!storage) return false;
  try {
    const clean = sanitizePreferences(prefs);
    if (isDefaultPreferences(clean)) {
      storage.removeItem(STORAGE_KEY);
    } else {
      storage.setItem(STORAGE_KEY, JSON.stringify({ v: PREFERENCES_VERSION, ...clean }));
    }
    return true;
  } catch {
    return false;
  }
}

export function clearPreferences(storage = getStorage()) {
  if (!storage) return false;
  try {
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/**
 * Aplica as preferências no elemento raiz (por padrão, document.documentElement).
 * Valores padrão removem o atributo correspondente.
 */
export function applyPreferences(prefs, root = globalThis.document?.documentElement) {
  if (!root) return;
  const clean = sanitizePreferences(prefs);

  for (const key of Object.keys(ATTRIBUTES)) {
    if (clean[key] === DEFAULT_PREFERENCES[key]) {
      root.removeAttribute(ATTRIBUTES[key]);
    } else {
      root.setAttribute(ATTRIBUTES[key], clean[key]);
    }
  }
}

/**
 * Nível comum às quatro propriedades de espaçamento ('default' | 'medium' | 'wide')
 * ou 'custom' quando os ajustes individuais são diferentes entre si.
 */
export function getSpacingPreset(prefs) {
  const clean = sanitizePreferences(prefs);
  const first = clean[SPACING_KEYS[0]];
  return SPACING_KEYS.every((key) => clean[key] === first) ? first : 'custom';
}

export function withSpacingPreset(prefs, level) {
  const next = { ...sanitizePreferences(prefs) };
  if (!OPTIONS.lineHeight.includes(level)) return next;
  for (const key of SPACING_KEYS) next[key] = level;
  return next;
}
