import { afterEach, describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_CHUNK_LENGTH,
  SPEECH_LANG,
  START_TIMEOUT_MS,
  createSpeechReader,
  isSpeechSupported,
  pickVoice,
  sanitizeSpeechText,
  splitIntoChunks,
} from './speech.js';

class FakeUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.voice = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
}

// speechSynthesis simulado: o teste decide quando cada fala começa, termina ou falha
function createEnv({ voices = [], throwOnSpeak = false } = {}) {
  const listeners = {};
  const synth = {
    speaking: false,
    pending: false,
    paused: false,
    current: null,
    log: [],
    utterances: [],
    cancelled: [],
    getVoices: () => voices,
    speak(utterance) {
      if (throwOnSpeak) throw new Error('speak falhou');
      this.log.push('speak');
      this.utterances.push(utterance);
      this.current = utterance;
      this.speaking = true;
    },
    cancel() {
      this.log.push('cancel');
      if (this.current) this.cancelled.push(this.current);
      this.current = null;
      this.speaking = false;
    },
    pause() {
      this.log.push('pause');
      this.paused = true;
    },
    resume() {
      this.log.push('resume');
      this.paused = false;
    },
    addEventListener(type, fn) {
      (listeners[type] ||= []).push(fn);
    },
    removeEventListener(type, fn) {
      listeners[type] = (listeners[type] || []).filter((item) => item !== fn);
    },
    emit(type) {
      (listeners[type] || []).forEach((fn) => fn());
    },
    listenerCount: (type) => (listeners[type] || []).length,
    begin() {
      this.current?.onstart?.({});
    },
    finish() {
      const utterance = this.current;
      this.current = null;
      this.speaking = false;
      utterance?.onend?.({});
    },
    fail(error) {
      const utterance = this.current;
      this.current = null;
      this.speaking = false;
      utterance?.onerror?.({ error });
    },
    // Eventos tardios de falas canceladas (Chromium dispara "canceled" depois do cancel())
    flushCancelled() {
      this.cancelled.splice(0).forEach((utterance) => {
        utterance.onerror?.({ error: 'canceled' });
        utterance.onend?.({});
      });
    },
  };
  return { synth, win: { speechSynthesis: synth, SpeechSynthesisUtterance: FakeUtterance } };
}

function setup(options = {}, readerOptions = {}) {
  const env = createEnv(options);
  const reader = createSpeechReader({ getWindow: () => env.win, startTimeoutMs: 60000, ...readerOptions });
  return { ...env, reader };
}

let activeReader = null;
afterEach(() => {
  activeReader?.reset();
  activeReader = null;
  mock.timers.reset();
});

function track(ctx) {
  activeReader = ctx.reader;
  return ctx;
}

const SENTENCE = 'Esta é uma frase de exemplo com tamanho razoável para o teste de trechos.';
const LONG_TEXT = Array.from({ length: 80 }, (_, i) => `${SENTENCE} (${i})`).join(' ');

describe('isSpeechSupported', () => {
  it('exige speechSynthesis e SpeechSynthesisUtterance', () => {
    assert.equal(isSpeechSupported(undefined), false);
    assert.equal(isSpeechSupported({}), false);
    assert.equal(isSpeechSupported({ speechSynthesis: {} }), false);
    assert.equal(isSpeechSupported({ speechSynthesis: null, SpeechSynthesisUtterance: FakeUtterance }), false);
    assert.equal(isSpeechSupported(createEnv().win), true);
  });
});

describe('sanitizeSpeechText', () => {
  it('troca URLs por "link", remove emojis, marcadores e espaços extras', () => {
    const text = sanitizeSpeechText('  🚀 Veja https://exemplo.com/vaga?id=1 e www.site.com.br\n\n- Item um\n•  Item   dois ✅ ');
    assert.equal(text, 'Veja link e link\nItem um\nItem dois');
  });

  it('aceita valores vazios e não texto', () => {
    assert.equal(sanitizeSpeechText(null), '');
    assert.equal(sanitizeSpeechText(undefined), '');
    assert.equal(sanitizeSpeechText('   \n  '), '');
    assert.equal(sanitizeSpeechText(1500), '1500');
  });

  it('mantém e-mails e acentos', () => {
    assert.equal(sanitizeSpeechText('Contato: rh_vagas@empresa.com.br — São Paulo'), 'Contato: rh_vagas@empresa.com.br — São Paulo');
  });
});

describe('splitIntoChunks', () => {
  it('devolve lista vazia sem conteúdo', () => {
    assert.deepEqual(splitIntoChunks(''), []);
    assert.deepEqual(splitIntoChunks('  \n '), []);
    assert.deepEqual(splitIntoChunks(null), []);
  });

  it('mantém um texto curto em um único trecho, com pontuação final', () => {
    assert.deepEqual(splitIntoChunks('Vaga para desenvolvedor'), ['Vaga para desenvolvedor.']);
  });

  it('nunca passa do limite e preserva todo o conteúdo em textos longos', () => {
    const chunks = splitIntoChunks(LONG_TEXT);
    assert.ok(chunks.length > 10);
    for (const chunk of chunks) assert.ok(chunk.length <= MAX_CHUNK_LENGTH, `trecho com ${chunk.length} caracteres`);
    assert.equal(chunks.join(' ').replace(/\s+/g, ' '), LONG_TEXT.replace(/\s+/g, ' ') + (LONG_TEXT.endsWith('.') ? '' : '.'));
  });

  it('quebra uma frase gigante sem pontuação em vírgulas ou espaços', () => {
    const giant = Array.from({ length: 120 }, (_, i) => `item${i}`).join(', ');
    const chunks = splitIntoChunks(giant, 100);
    assert.ok(chunks.length > 5);
    for (const chunk of chunks) assert.ok(chunk.length <= 100);
    assert.ok(chunks.slice(0, -1).every((chunk) => chunk.endsWith(',')));
  });

  it('parte uma palavra maior que o limite sem separar pares substitutos', () => {
    // U+1D400 (letra matemática) é um par substituto que o filtro de emojis não remove
    const chunks = splitIntoChunks(`a${'\u{1D400}'.repeat(60)}`, 51);
    assert.ok(chunks.length > 1);
    for (const chunk of chunks) {
      assert.ok(chunk.length <= 51);
      assert.doesNotMatch(chunk, /[\ud800-\udbff]$/);
      assert.doesNotMatch(chunk, /^[\udc00-\udfff]/);
    }
  });

  it('não corta números e abreviações no meio', () => {
    const chunks = splitIntoChunks('Remuneração: de R$ 1.500,00 a R$ 2.000,00. Falar com o Sr. Silva.', 30);
    assert.ok(chunks.every((chunk) => !/R\$ 1\.$/.test(chunk) && !/R\$ 2\.$/.test(chunk)));
    assert.ok(chunks.join(' ').includes('R$ 1.500,00'));
  });

  it('trata cada linha como item, com pausa (ponto) entre eles', () => {
    assert.deepEqual(splitIntoChunks('Requisitos.\nReact\nNode.js'), ['Requisitos. React. Node.js.']);
  });

  it('respeita o limite informado', () => {
    for (const chunk of splitIntoChunks(LONG_TEXT, 60)) assert.ok(chunk.length <= 60);
  });
});

describe('pickVoice', () => {
  const v = (lang, extra = {}) => ({ lang, name: lang, ...extra });

  it('prefere pt-BR (inclusive no formato pt_BR do Android)', () => {
    assert.equal(pickVoice([v('en-US'), v('pt-PT'), v('pt_BR')]).lang, 'pt_BR');
  });

  it('entre vozes pt-BR escolhe a padrão, depois a local', () => {
    const voices = [v('pt-BR', { name: 'a' }), v('pt-BR', { name: 'b', localService: true }), v('pt-BR', { name: 'c', default: true })];
    assert.equal(pickVoice(voices).name, 'c');
    assert.equal(pickVoice(voices.slice(0, 2)).name, 'b');
  });

  it('aceita outra variante do português e devolve null sem voz em português', () => {
    assert.equal(pickVoice([v('en-US'), v('pt-PT')]).lang, 'pt-PT');
    assert.equal(pickVoice([v('en-US'), v('es-ES')]), null);
    assert.equal(pickVoice([]), null);
    assert.equal(pickVoice(undefined), null);
  });
});

describe('leitor: navegador sem suporte', () => {
  it('informa indisponibilidade e não inicia', () => {
    const reader = createSpeechReader({ getWindow: () => ({}) });
    activeReader = reader;
    assert.equal(reader.getSnapshot().supported, false);
    assert.equal(reader.start(['Texto']), false);
    const snap = reader.getSnapshot();
    assert.equal(snap.status, 'idle');
    assert.equal(snap.outcome, 'error');
    assert.equal(snap.error, 'unsupported');
  });

  it('pause, resume, stop e reset são seguros sem suporte', () => {
    const reader = createSpeechReader({ getWindow: () => undefined });
    reader.pause();
    reader.resume();
    reader.stop();
    reader.reset();
    assert.equal(reader.getSnapshot().status, 'idle');
  });
});

describe('leitor: iniciar', () => {
  it('não fala nada até start() ser chamado', () => {
    const ctx = track(setup());
    ctx.reader.subscribe(() => {});
    assert.equal(ctx.synth.utterances.length, 0);
    assert.equal(ctx.reader.getSnapshot().status, 'idle');
  });

  it('fala o primeiro trecho em pt-BR com a voz portuguesa preferida', () => {
    const voice = { lang: 'pt-BR', name: 'Luciana' };
    const ctx = track(setup({ voices: [{ lang: 'en-US', name: 'Alex' }, voice] }));
    assert.equal(ctx.reader.start(['Título da vaga', 'Descrição da vaga']), true);

    assert.equal(ctx.synth.utterances.length, 1);
    const [utterance] = ctx.synth.utterances;
    assert.equal(utterance.lang, SPEECH_LANG);
    assert.equal(utterance.voice, voice);
    assert.equal(utterance.text, 'Título da vaga.');
    assert.deepEqual(
      { status: ctx.reader.getSnapshot().status, index: ctx.reader.getSnapshot().index, total: ctx.reader.getSnapshot().total },
      { status: 'speaking', index: 1, total: 2 }
    );
  });

  it('sem voz em português, deixa o navegador escolher pela língua', () => {
    const ctx = track(setup({ voices: [{ lang: 'en-US' }] }));
    ctx.reader.start(['Olá']);
    assert.equal(ctx.synth.utterances[0].voice, null);
    assert.equal(ctx.synth.utterances[0].lang, 'pt-BR');
  });

  it('recusa conteúdo vazio', () => {
    const ctx = track(setup());
    assert.equal(ctx.reader.start([]), false);
    assert.equal(ctx.reader.start(['  ', null]), false);
    assert.equal(ctx.reader.getSnapshot().error, 'empty');
    assert.equal(ctx.synth.utterances.length, 0);
  });

  it('segue os trechos em sequência e conclui ao final', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois', 'Três']);
    ctx.synth.begin();
    ctx.synth.finish();
    assert.equal(ctx.synth.utterances.length, 2);
    assert.equal(ctx.reader.getSnapshot().index, 2);
    ctx.synth.finish();
    ctx.synth.finish();

    assert.deepEqual(ctx.synth.utterances.map((u) => u.text), ['Um.', 'Dois.', 'Três.']);
    const snap = ctx.reader.getSnapshot();
    assert.equal(snap.status, 'idle');
    assert.equal(snap.outcome, 'finished');
    assert.equal(snap.index, 0);
  });

  it('lê um texto longo inteiro, sem trecho acima do limite e sem sobreposição', () => {
    const ctx = track(setup());
    ctx.reader.start([LONG_TEXT]);
    let guard = 0;
    while (ctx.reader.getSnapshot().status === 'speaking' && guard < 500) {
      assert.ok(ctx.synth.current.text.length <= MAX_CHUNK_LENGTH);
      ctx.synth.begin();
      ctx.synth.finish();
      guard += 1;
    }
    assert.equal(ctx.reader.getSnapshot().outcome, 'finished');
    assert.equal(ctx.synth.utterances.length, splitIntoChunks(LONG_TEXT).length);
    assert.equal(ctx.synth.log.filter((entry) => entry === 'speak').length, ctx.synth.utterances.length);
  });
});

describe('leitor: pausar e continuar', () => {
  it('pausa e continua do mesmo ponto', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.synth.begin();

    ctx.reader.pause();
    assert.equal(ctx.reader.getSnapshot().status, 'paused');
    assert.equal(ctx.synth.paused, true);

    ctx.reader.resume();
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    assert.equal(ctx.synth.paused, false);
    assert.equal(ctx.synth.utterances.length, 1, 'continuar não repete o trecho');
  });

  it('ignora pause fora de "speaking" e resume fora de "paused"', () => {
    const ctx = track(setup());
    ctx.reader.pause();
    ctx.reader.resume();
    assert.deepEqual(ctx.synth.log, []);
    ctx.reader.start(['Um']);
    ctx.reader.resume();
    assert.equal(ctx.synth.log.includes('resume'), false);
  });

  it('se o trecho termina durante a pausa, o próximo só toca ao continuar', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.reader.pause();
    ctx.synth.finish();
    assert.equal(ctx.synth.utterances.length, 1);
    assert.equal(ctx.reader.getSnapshot().status, 'paused');

    ctx.reader.resume();
    assert.equal(ctx.synth.utterances.length, 2);
    assert.equal(ctx.synth.utterances[1].text, 'Dois.');
  });

  it('se o motor descarta a fala ao pausar (cancelamento), continuar repete o trecho atual', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.reader.pause();
    ctx.synth.fail('canceled');
    assert.equal(ctx.reader.getSnapshot().status, 'paused');

    ctx.reader.resume();
    assert.deepEqual(ctx.synth.utterances.map((u) => u.text), ['Um.', 'Um.']);
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
  });

  it('se o motor perde a fala em silêncio durante a pausa, repete o trecho depois de continuar', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const ctx = track(setup({}, { resumeCheckMs: 400 }));
    ctx.reader.start(['Um', 'Dois']);
    ctx.reader.pause();
    ctx.synth.current = null;
    ctx.synth.speaking = false;
    ctx.reader.resume();
    mock.timers.tick(400);
    assert.deepEqual(ctx.synth.utterances.map((u) => u.text), ['Um.', 'Um.']);
    assert.equal(ctx.synth.log.filter((entry) => entry === 'cancel').length, 2, 'cancela antes de falar de novo: sem sobreposição');
  });

  it('não repete o trecho quando o motor realmente continuou falando', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const ctx = track(setup({}, { resumeCheckMs: 400 }));
    ctx.reader.start(['Um']);
    ctx.reader.pause();
    ctx.reader.resume();
    mock.timers.tick(1000);
    assert.equal(ctx.synth.utterances.length, 1);
  });
});

describe('leitor: parar, reiniciar e evitar sobreposição', () => {
  it('para a leitura e ignora eventos tardios da fala cancelada', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.synth.begin();
    ctx.reader.stop();

    let snap = ctx.reader.getSnapshot();
    assert.equal(snap.status, 'idle');
    assert.equal(snap.outcome, 'stopped');
    assert.ok(ctx.synth.log.includes('cancel'));

    ctx.synth.flushCancelled();
    assert.equal(ctx.synth.utterances.length, 1, 'o fim tardio da fala cancelada não avança para o próximo trecho');
    snap = ctx.reader.getSnapshot();
    assert.equal(snap.outcome, 'stopped');
    assert.equal(snap.error, null);
  });

  it('parar estando pausado libera o motor (resume após cancel)', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um']);
    ctx.reader.pause();
    ctx.reader.stop();
    assert.equal(ctx.synth.paused, false);
    assert.equal(ctx.reader.getSnapshot().status, 'idle');
  });

  it('stop() sem leitura em andamento não cancela falas alheias', () => {
    const ctx = track(setup());
    ctx.reader.stop();
    assert.deepEqual(ctx.synth.log, []);
    assert.equal(ctx.reader.getSnapshot().outcome, null);
  });

  it('permite reiniciar do começo depois de parar', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.synth.finish();
    ctx.reader.stop();
    ctx.synth.flushCancelled();

    assert.equal(ctx.reader.start(['Um', 'Dois']), true);
    assert.equal(ctx.synth.utterances.at(-1).text, 'Um.');
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    assert.equal(ctx.reader.getSnapshot().outcome, null);
  });

  it('permite ouvir de novo depois de concluir', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um']);
    ctx.synth.finish();
    assert.equal(ctx.reader.getSnapshot().outcome, 'finished');
    ctx.reader.start(['Um']);
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    assert.equal(ctx.reader.getSnapshot().outcome, null);
  });

  it('iniciar outra leitura durante uma em andamento cancela a anterior (nunca duas ao mesmo tempo)', () => {
    const ctx = track(setup());
    ctx.reader.start(['Antiga um', 'Antiga dois']);
    const antiga = ctx.synth.current;
    ctx.reader.start(['Nova um', 'Nova dois']);

    assert.equal(ctx.synth.log.filter((entry) => entry === 'cancel').length >= 2, true);
    assert.equal(ctx.synth.current.text, 'Nova um.');

    // Eventos tardios da fala antiga não podem avançar a leitura nova
    antiga.onend?.({});
    antiga.onerror?.({ error: 'canceled' });
    ctx.synth.flushCancelled();
    assert.equal(ctx.synth.utterances.length, 2);
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    assert.equal(ctx.reader.getSnapshot().total, 2);
  });

  it('reset() interrompe e limpa o resultado (saída da página / troca de oportunidade)', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.reader.reset();
    assert.deepEqual(
      { ...ctx.reader.getSnapshot(), supported: undefined, voiceMissing: undefined },
      { supported: undefined, voiceMissing: undefined, status: 'idle', outcome: null, error: null, index: 0, total: 0 }
    );
    ctx.synth.flushCancelled();
    assert.equal(ctx.synth.utterances.length, 1);

    ctx.reader.start(['Um']);
    ctx.synth.finish();
    ctx.reader.reset();
    assert.equal(ctx.reader.getSnapshot().outcome, null);
  });
});

describe('leitor: falhas do motor de voz', () => {
  it('erro do motor encerra com mensagem de falha', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.synth.fail('synthesis-failed');
    const snap = ctx.reader.getSnapshot();
    assert.equal(snap.status, 'idle');
    assert.equal(snap.outcome, 'error');
    assert.equal(snap.error, 'failed');
    assert.equal(ctx.synth.utterances.length, 1, 'não tenta o trecho seguinte após falhar');
  });

  it('exceção em speak() vira falha tratada', () => {
    const ctx = track(setup({ throwOnSpeak: true }));
    assert.doesNotThrow(() => ctx.reader.start(['Um']));
    assert.equal(ctx.reader.getSnapshot().error, 'failed');
    assert.equal(ctx.reader.getSnapshot().status, 'idle');
  });

  it('cancelamento externo (outra aba, script ou extensão) encerra como interrompida', () => {
    const ctx = track(setup());
    ctx.reader.start(['Um', 'Dois']);
    ctx.synth.fail('interrupted');
    assert.equal(ctx.reader.getSnapshot().status, 'idle');
    assert.equal(ctx.reader.getSnapshot().outcome, 'stopped');
  });

  it('avisa quando o motor não responde dentro do prazo', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const ctx = track(setup({}, { startTimeoutMs: START_TIMEOUT_MS }));
    ctx.reader.start(['Um']);
    mock.timers.tick(START_TIMEOUT_MS - 1);
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    mock.timers.tick(1);
    const snap = ctx.reader.getSnapshot();
    assert.equal(snap.status, 'idle');
    assert.equal(snap.error, 'not-started');
    assert.ok(ctx.synth.log.includes('cancel'));
  });

  it('não dispara o aviso quando a fala começa a tempo', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const ctx = track(setup({}, { startTimeoutMs: START_TIMEOUT_MS }));
    ctx.reader.start(['Um']);
    ctx.synth.begin();
    mock.timers.tick(START_TIMEOUT_MS * 2);
    assert.equal(ctx.reader.getSnapshot().status, 'speaking');
    assert.equal(ctx.reader.getSnapshot().error, null);
  });

  it('o aviso de "não iniciou" não vale depois de parar', () => {
    mock.timers.enable({ apis: ['setTimeout'] });
    const ctx = track(setup({}, { startTimeoutMs: START_TIMEOUT_MS }));
    ctx.reader.start(['Um']);
    ctx.reader.stop();
    mock.timers.tick(START_TIMEOUT_MS * 2);
    assert.equal(ctx.reader.getSnapshot().outcome, 'stopped');
  });
});

describe('leitor: store (subscribe/getSnapshot)', () => {
  it('mantém a mesma referência enquanto nada muda e notifica quando muda', () => {
    const ctx = track(setup());
    let calls = 0;
    const unsubscribe = ctx.reader.subscribe(() => { calls += 1; });
    const first = ctx.reader.getSnapshot();
    assert.equal(ctx.reader.getSnapshot(), first);

    ctx.reader.stop();
    assert.equal(ctx.reader.getSnapshot(), first, 'stop ocioso não cria novo snapshot');

    ctx.reader.start(['Um']);
    assert.notEqual(ctx.reader.getSnapshot(), first);
    assert.ok(calls > 0);

    const before = calls;
    unsubscribe();
    ctx.reader.pause();
    assert.equal(calls, before);
  });

  it('detecta ausência de voz em português e acompanha voiceschanged', () => {
    const voices = [{ lang: 'en-US' }];
    const ctx = track(setup({ voices }));
    const unsubscribe = ctx.reader.subscribe(() => {});
    assert.equal(ctx.reader.getSnapshot().voiceMissing, true);

    voices.push({ lang: 'pt-BR' });
    ctx.synth.emit('voiceschanged');
    assert.equal(ctx.reader.getSnapshot().voiceMissing, false);

    unsubscribe();
    assert.equal(ctx.synth.listenerCount('voiceschanged'), 0);
  });

  it('lista de vozes ainda vazia (carregamento assíncrono) não é tratada como falta de voz', () => {
    const ctx = track(setup({ voices: [] }));
    ctx.reader.subscribe(() => {});
    assert.equal(ctx.reader.getSnapshot().voiceMissing, false);
  });
});
