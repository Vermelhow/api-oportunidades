import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  STORAGE_KEY,
  DEFAULT_PREFERENCES,
  OPTIONS,
  sanitizePreferences,
  isDefaultPreferences,
  parseStoredPreferences,
  loadPreferences,
  savePreferences,
  clearPreferences,
  applyPreferences,
  getSpacingPreset,
  withSpacingPreset,
} from './preferences.js';

function fakeStorage(initial = {}) {
  const data = { ...initial };
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => { data[k] = String(v); },
    removeItem: (k) => { delete data[k]; },
  };
}

const throwingStorage = {
  getItem() { throw new Error('SecurityError'); },
  setItem() { throw new Error('QuotaExceededError'); },
  removeItem() { throw new Error('SecurityError'); },
};

function fakeRoot() {
  const attrs = new Map();
  return {
    attrs,
    setAttribute: (k, v) => attrs.set(k, v),
    removeAttribute: (k) => attrs.delete(k),
  };
}

describe('sanitizePreferences', () => {
  it('devolve o padrão para entradas inválidas', () => {
    for (const bad of [null, undefined, 'x', 42, [], true]) {
      assert.deepEqual(sanitizePreferences(bad), DEFAULT_PREFERENCES);
    }
  });

  it('aceita somente valores da lista permitida', () => {
    const r = sanitizePreferences({ text: '125', contrast: 'high', lineHeight: 'wide', letterSpacing: 'medium' });
    assert.equal(r.text, '125');
    assert.equal(r.contrast, 'high');
    assert.equal(r.lineHeight, 'wide');
    assert.equal(r.letterSpacing, 'medium');
    assert.equal(r.wordSpacing, 'default');
  });

  it('rejeita valores fora da lista, tipos errados e tamanhos não aprovados', () => {
    const r = sanitizePreferences({ text: '200', contrast: 'invert', lineHeight: 3, wordSpacing: null, paragraphSpacing: '<script>' });
    assert.deepEqual(r, DEFAULT_PREFERENCES);
    assert.equal(sanitizePreferences({ text: 125 }).text, '100');
  });

  it('descarta chaves desconhecidas', () => {
    const r = sanitizePreferences({ text: '150', hack: 'x', __proto__: { text: '125' } });
    assert.equal(r.text, '150');
    assert.equal('hack' in r, false);
  });

  it('não altera o objeto original nem o padrão congelado', () => {
    const input = { text: '125' };
    sanitizePreferences(input);
    assert.deepEqual(input, { text: '125' });
    assert.ok(Object.isFrozen(DEFAULT_PREFERENCES));
  });
});

describe('parseStoredPreferences', () => {
  it('trata JSON inválido, vazio e nulo como padrão', () => {
    for (const bad of ['{', 'undefined', '', null, undefined, 123, '[]', 'null', '"texto"']) {
      assert.deepEqual(parseStoredPreferences(bad), DEFAULT_PREFERENCES);
    }
  });

  it('ignora versão desconhecida ou ausente', () => {
    assert.deepEqual(parseStoredPreferences(JSON.stringify({ text: '150' })), DEFAULT_PREFERENCES);
    assert.deepEqual(parseStoredPreferences(JSON.stringify({ v: 99, text: '150' })), DEFAULT_PREFERENCES);
  });

  it('lê preferências válidas e corrige valores inválidos individualmente', () => {
    const r = parseStoredPreferences(JSON.stringify({ v: 1, text: '150', contrast: 'high', lineHeight: 'gigante' }));
    assert.equal(r.text, '150');
    assert.equal(r.contrast, 'high');
    assert.equal(r.lineHeight, 'default');
  });
});

describe('loadPreferences / savePreferences / clearPreferences', () => {
  it('faz ida e volta no armazenamento com a chave versionada', () => {
    const storage = fakeStorage();
    const prefs = { ...DEFAULT_PREFERENCES, text: '125', contrast: 'high', paragraphSpacing: 'wide' };
    assert.equal(savePreferences(prefs, storage), true);
    assert.ok(STORAGE_KEY.startsWith('@api-oportunidades:'));
    assert.equal(JSON.parse(storage.data[STORAGE_KEY]).v, 1);
    assert.deepEqual(loadPreferences(storage), prefs);
  });

  it('remove a chave quando as preferências voltam ao padrão', () => {
    const storage = fakeStorage();
    savePreferences({ text: '150' }, storage);
    assert.ok(STORAGE_KEY in storage.data);
    savePreferences(DEFAULT_PREFERENCES, storage);
    assert.equal(STORAGE_KEY in storage.data, false);
  });

  it('não grava valores inválidos', () => {
    const storage = fakeStorage();
    savePreferences({ text: '999', contrast: 'high' }, storage);
    assert.deepEqual(JSON.parse(storage.data[STORAGE_KEY]), { v: 1, ...DEFAULT_PREFERENCES, contrast: 'high' });
  });

  it('usa o padrão quando o JSON salvo está corrompido', () => {
    const storage = fakeStorage({ [STORAGE_KEY]: '{"v":1,"text":' });
    assert.deepEqual(loadPreferences(storage), DEFAULT_PREFERENCES);
  });

  it('tolera armazenamento que lança erro (modo privado / cota cheia)', () => {
    assert.deepEqual(loadPreferences(throwingStorage), DEFAULT_PREFERENCES);
    assert.equal(savePreferences({ text: '125' }, throwingStorage), false);
    assert.equal(clearPreferences(throwingStorage), false);
  });

  it('tolera armazenamento indisponível (null)', () => {
    assert.deepEqual(loadPreferences(null), DEFAULT_PREFERENCES);
    assert.equal(savePreferences({ text: '125' }, null), false);
    assert.equal(clearPreferences(null), false);
  });

  it('clearPreferences remove a chave', () => {
    const storage = fakeStorage();
    savePreferences({ text: '125' }, storage);
    assert.equal(clearPreferences(storage), true);
    assert.deepEqual(loadPreferences(storage), DEFAULT_PREFERENCES);
  });
});

describe('applyPreferences', () => {
  it('no padrão não cria nenhum atributo', () => {
    const root = fakeRoot();
    applyPreferences(DEFAULT_PREFERENCES, root);
    assert.equal(root.attrs.size, 0);
  });

  it('cria somente os atributos diferentes do padrão', () => {
    const root = fakeRoot();
    applyPreferences({ text: '125', contrast: 'high', lineHeight: 'wide' }, root);
    assert.deepEqual([...root.attrs], [
      ['data-a11y-text', '125'],
      ['data-a11y-contrast', 'high'],
      ['data-a11y-line', 'wide'],
    ]);
  });

  it('remove atributos ao restaurar o padrão', () => {
    const root = fakeRoot();
    applyPreferences({ text: '150', contrast: 'high', wordSpacing: 'medium', paragraphSpacing: 'wide', letterSpacing: 'wide' }, root);
    assert.equal(root.attrs.size, 5);
    applyPreferences(DEFAULT_PREFERENCES, root);
    assert.equal(root.attrs.size, 0);
  });

  it('sanitiza antes de aplicar', () => {
    const root = fakeRoot();
    applyPreferences({ text: 'abc', contrast: 'high' }, root);
    assert.deepEqual([...root.attrs], [['data-a11y-contrast', 'high']]);
  });

  it('não falha sem elemento raiz', () => {
    assert.doesNotThrow(() => applyPreferences({ text: '125' }, null));
  });
});

describe('espaçamento: predefinições', () => {
  it('detecta o nível comum e o estado personalizado', () => {
    assert.equal(getSpacingPreset(DEFAULT_PREFERENCES), 'default');
    assert.equal(getSpacingPreset(withSpacingPreset(DEFAULT_PREFERENCES, 'wide')), 'wide');
    assert.equal(getSpacingPreset({ lineHeight: 'wide' }), 'custom');
  });

  it('withSpacingPreset ajusta as quatro propriedades e preserva as demais', () => {
    const r = withSpacingPreset({ text: '125', contrast: 'high' }, 'wide');
    assert.equal(r.text, '125');
    assert.equal(r.contrast, 'high');
    for (const k of ['lineHeight', 'letterSpacing', 'wordSpacing', 'paragraphSpacing']) assert.equal(r[k], 'wide');
  });

  it('ignora níveis inválidos', () => {
    assert.deepEqual(withSpacingPreset(DEFAULT_PREFERENCES, 'enorme'), DEFAULT_PREFERENCES);
  });
});

describe('definições', () => {
  it('o padrão pertence às listas permitidas', () => {
    for (const key of Object.keys(OPTIONS)) assert.ok(OPTIONS[key].includes(DEFAULT_PREFERENCES[key]));
    assert.deepEqual(OPTIONS.text, ['100', '125', '150']);
    assert.equal(isDefaultPreferences({}), true);
  });
});
