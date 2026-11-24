/**
 * Leitura em voz alta (REQ-A33)
 *
 * Módulo sem dependência de React que encapsula a Web Speech API
 * (window.speechSynthesis), nativa do navegador, sem serviços externos.
 *
 * Decisões:
 * - A leitura só começa por chamada explícita de start() (ação do usuário).
 * - O texto é dividido em trechos curtos, falados um por vez. Navegadores
 *   baseados em Chromium interrompem falas longas (~15 s) sem avisar.
 * - speechSynthesis é um recurso global do navegador, então há um único leitor
 *   (speechReader): iniciar uma leitura cancela a anterior e nunca há sobreposição.
 * - Eventos de falas já canceladas são descartados (generation + current).
 * - Estado exposto por subscribe/getSnapshot (compatível com useSyncExternalStore).
 */

export const SPEECH_LANG = 'pt-BR';
// Abaixo do limite em que o Chromium costuma cortar a fala
export const MAX_CHUNK_LENGTH = 180;
// Sem nenhum evento de início neste prazo, o motor de voz é considerado indisponível
export const START_TIMEOUT_MS = 8000;

const SENTENCE_END = '.!?…;:';

export function isSpeechSupported(win = typeof window === 'undefined' ? undefined : window) {
  return Boolean(
    win &&
      typeof win.speechSynthesis === 'object' &&
      win.speechSynthesis !== null &&
      typeof win.SpeechSynthesisUtterance === 'function'
  );
}

/**
 * Prepara um texto para ser falado: remove emojis e caracteres de controle,
 * troca endereços de internet por "link" (soletrar uma URL atrapalha a escuta),
 * tira marcadores de lista e normaliza espaços. Quebras de linha são mantidas
 * porque funcionam como pausa entre itens.
 */
export function sanitizeSpeechText(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/\r\n?/g, '\n')
    .replace(/\bhttps?:\/\/\S+|\bwww\.\S+/gi, 'link')
    .replace(/\p{Extended_Pictographic}|[\uFE0E\uFE0F]|[\u200B-\u200D]|\u20E3/gu, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ' ')
    .replace(/^[ \t]*[-•*·–—▪◦►]+[ \t]+/gm, '')
    .replace(/[ \t\u00A0]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

// Corta nas pontuações finais seguidas de espaço ou fim de texto: "1.500,00" e "Sr. Silva" não são cortados no meio de um número
function splitSentences(line) {
  const sentences = [];
  let start = 0;
  for (let i = 0; i < line.length; i += 1) {
    if (!SENTENCE_END.includes(line[i])) continue;
    let end = i + 1;
    while (end < line.length && SENTENCE_END.includes(line[end])) end += 1;
    while (end < line.length && '"\')]'.includes(line[end])) end += 1;
    if (end === line.length || /\s/.test(line[end])) {
      const sentence = line.slice(start, end).trim();
      if (sentence) sentences.push(sentence);
      start = end;
      i = end - 1;
    }
  }
  const rest = line.slice(start).trim();
  if (rest) sentences.push(rest);
  return sentences;
}

// Frase maior que o limite: corta na última vírgula/espaço que cabe, sem partir pares substitutos (emoji/símbolos)
function breakLongSentence(sentence, maxLength) {
  const pieces = [];
  let remaining = sentence;
  while (remaining.length > maxLength) {
    // A vírgula entra no trecho (precisa caber em maxLength); o espaço usado como corte fica de fora
    const head = remaining.slice(0, maxLength);
    let cut = Math.max(head.lastIndexOf(','), head.lastIndexOf(';')) + 1;
    if (cut <= 0) cut = remaining.slice(0, maxLength + 1).lastIndexOf(' ');
    if (cut <= 0) {
      cut = maxLength;
      const code = remaining.charCodeAt(cut - 1);
      if (code >= 0xd800 && code <= 0xdbff) cut -= 1;
    }
    pieces.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) pieces.push(remaining);
  return pieces;
}

/**
 * Divide um texto em trechos de no máximo maxLength caracteres, respeitando
 * frases e linhas. Cada linha termina com pontuação para o motor de voz
 * pausar entre itens de lista.
 */
export function splitIntoChunks(text, maxLength = MAX_CHUNK_LENGTH) {
  const clean = sanitizeSpeechText(text);
  if (!clean) return [];

  const sentences = [];
  for (const line of clean.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const closed = SENTENCE_END.includes(trimmed[trimmed.length - 1]) ? trimmed : `${trimmed}.`;
    sentences.push(...splitSentences(closed));
  }

  const chunks = [];
  let buffer = '';
  for (const sentence of sentences) {
    const pieces = sentence.length > maxLength ? breakLongSentence(sentence, maxLength) : [sentence];
    for (const piece of pieces) {
      if (buffer && buffer.length + 1 + piece.length > maxLength) {
        chunks.push(buffer);
        buffer = piece;
      } else {
        buffer = buffer ? `${buffer} ${piece}` : piece;
      }
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

function normalizeLang(lang) {
  return String(lang || '').replace('_', '-').toLowerCase();
}

/** Prefere voz pt-BR (padrão do sistema, depois local); aceita outra voz em português; senão null. */
export function pickVoice(voices) {
  if (!Array.isArray(voices) || voices.length === 0) return null;
  const brazilian = voices.filter((voice) => normalizeLang(voice.lang) === 'pt-br');
  if (brazilian.length > 0) {
    return brazilian.find((voice) => voice.default) || brazilian.find((voice) => voice.localService) || brazilian[0];
  }
  return voices.find((voice) => normalizeLang(voice.lang).startsWith('pt')) || null;
}

function hasPortugueseVoice(voices) {
  return voices.some((voice) => normalizeLang(voice.lang).startsWith('pt'));
}

/**
 * Cria um leitor. Os parâmetros existem para os testes; na aplicação use o
 * singleton speechReader.
 *
 * Snapshot (imutável; só muda de identidade quando algum valor muda):
 *   supported    navegador oferece SpeechSynthesis
 *   status       'idle' | 'speaking' | 'paused'
 *   outcome      resultado da última leitura: null | 'finished' | 'stopped' | 'error'
 *   error        null | 'unsupported' | 'empty' | 'failed' | 'not-started'
 *   index/total  trecho atual (1-based) e quantidade de trechos; 0 quando parado
 *   voiceMissing true quando o dispositivo lista vozes, mas nenhuma em português
 */
export function createSpeechReader({
  getWindow = () => (typeof window === 'undefined' ? undefined : window),
  startTimeoutMs = START_TIMEOUT_MS,
  maxChunkLength = MAX_CHUNK_LENGTH,
  resumeCheckMs = 400,
} = {}) {
  const listeners = new Set();
  let detachVoicesListener = null;

  let chunks = [];
  let position = 0;
  let generation = 0;
  // Referência à fala atual: o Chromium pode coletar o objeto e nunca disparar "end"
  let current = null;
  // Trecho a falar ao continuar quando o motor encerrou a fala durante a pausa (ex.: Chrome no Android)
  let pendingIndex = null;
  let startTimer = null;
  let resumeTimer = null;

  function getApi() {
    const win = getWindow();
    return isSpeechSupported(win)
      ? { synth: win.speechSynthesis, Utterance: win.SpeechSynthesisUtterance }
      : null;
  }

  let snapshot = {
    supported: Boolean(getApi()),
    status: 'idle',
    outcome: null,
    error: null,
    index: 0,
    total: 0,
    voiceMissing: false,
  };

  function setSnapshot(patch) {
    const next = { ...snapshot, ...patch };
    if (Object.keys(next).every((key) => next[key] === snapshot[key])) return;
    snapshot = next;
    listeners.forEach((listener) => listener());
  }

  function clearTimers() {
    clearTimeout(startTimer);
    clearTimeout(resumeTimer);
    startTimer = null;
    resumeTimer = null;
  }

  // Cancela qualquer fala em andamento e invalida os eventos que ela ainda possa disparar
  function interrupt() {
    generation += 1;
    clearTimers();
    current = null;
    pendingIndex = null;
    const api = getApi();
    if (!api) return;
    try {
      api.synth.cancel();
      // Chromium mantém "paused" após cancel(): sem isto a próxima fala ficaria muda
      if (api.synth.paused) api.synth.resume();
    } catch {
      // motor de voz indisponível: nada a cancelar
    }
  }

  function end(outcome, error = null) {
    interrupt();
    chunks = [];
    position = 0;
    setSnapshot({ status: 'idle', outcome, error, index: 0, total: 0 });
  }

  function readVoices(api) {
    try {
      return api?.synth.getVoices?.() ?? [];
    } catch {
      return [];
    }
  }

  function refreshVoices() {
    const api = getApi();
    const voices = readVoices(api);
    setSnapshot({ supported: Boolean(api), voiceMissing: voices.length > 0 && !hasPortugueseVoice(voices) });
  }

  function speakChunk(index) {
    const api = getApi();
    if (!api) {
      end('error', 'unsupported');
      return;
    }

    const utterance = new api.Utterance(chunks[index]);
    utterance.lang = SPEECH_LANG;
    // Sem voz em português na lista, o navegador escolhe pela língua
    const voice = pickVoice(readVoices(api));
    if (voice) utterance.voice = voice;

    const ownGeneration = generation;
    const isStale = () => ownGeneration !== generation || current !== utterance;

    utterance.onstart = () => {
      if (isStale()) return;
      clearTimeout(startTimer);
      startTimer = null;
    };
    utterance.onend = () => {
      if (isStale()) return;
      handleEnd(index);
    };
    utterance.onerror = (event) => {
      if (isStale()) return;
      handleError(index, event?.error);
    };

    current = utterance;
    position = index;
    setSnapshot({ index: index + 1 });

    try {
      api.synth.speak(utterance);
    } catch {
      end('error', 'failed');
    }
  }

  function handleEnd(index) {
    current = null;
    const next = index + 1;
    if (next >= chunks.length) {
      end('finished');
    } else if (snapshot.status === 'paused') {
      pendingIndex = next;
    } else {
      speakChunk(next);
    }
  }

  function handleError(index, code) {
    current = null;
    if (code === 'canceled' || code === 'interrupted') {
      if (snapshot.status === 'paused') {
        pendingIndex = index;
      } else {
        // Outro script, aba ou extensão cancelou a fala
        end('stopped');
      }
      return;
    }
    end('error', 'failed');
  }

  function start(segments) {
    const api = getApi();
    if (!api) {
      setSnapshot({ supported: false, outcome: 'error', error: 'unsupported' });
      return false;
    }

    const list = Array.isArray(segments) ? segments : [segments];
    const nextChunks = list.flatMap((segment) => splitIntoChunks(segment, maxChunkLength));
    if (nextChunks.length === 0) {
      setSnapshot({ outcome: 'error', error: 'empty' });
      return false;
    }

    interrupt();
    chunks = nextChunks;
    setSnapshot({ status: 'speaking', outcome: null, error: null, index: 1, total: chunks.length });

    clearTimeout(startTimer);
    const ownGeneration = generation;
    startTimer = setTimeout(() => {
      if (ownGeneration === generation) end('error', 'not-started');
    }, startTimeoutMs);

    speakChunk(0);
    return true;
  }

  function pause() {
    const api = getApi();
    if (!api || snapshot.status !== 'speaking') return;
    clearTimeout(startTimer);
    startTimer = null;
    try {
      api.synth.pause();
    } catch {
      end('error', 'failed');
      return;
    }
    setSnapshot({ status: 'paused' });
  }

  function resume() {
    const api = getApi();
    if (!api || snapshot.status !== 'paused') return;
    try {
      api.synth.resume();
    } catch {
      end('error', 'failed');
      return;
    }
    setSnapshot({ status: 'speaking' });

    if (pendingIndex !== null) {
      const index = pendingIndex;
      pendingIndex = null;
      speakChunk(index);
      return;
    }

    // Alguns navegadores móveis descartam a fala ao pausar sem avisar: se nada voltou a falar, repete o trecho atual
    const ownGeneration = generation;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      if (ownGeneration !== generation || snapshot.status !== 'speaking' || current === null) return;
      if (!api.synth.speaking && !api.synth.pending) {
        interrupt();
        setSnapshot({ status: 'speaking' });
        speakChunk(position);
      }
    }, resumeCheckMs);
  }

  /** Interrompe a leitura (botão Parar). Sem leitura em andamento, não faz nada. */
  function stop() {
    if (snapshot.status === 'idle') return;
    end('stopped');
  }

  /** Para a leitura e limpa o resultado: usado ao sair da página ou trocar de oportunidade. */
  function reset() {
    if (snapshot.status !== 'idle') interrupt();
    chunks = [];
    position = 0;
    setSnapshot({ status: 'idle', outcome: null, error: null, index: 0, total: 0 });
  }

  function subscribe(listener) {
    listeners.add(listener);
    if (listeners.size === 1) {
      const synth = getApi()?.synth;
      if (synth?.addEventListener) {
        synth.addEventListener('voiceschanged', refreshVoices);
        detachVoicesListener = () => synth.removeEventListener('voiceschanged', refreshVoices);
      }
      refreshVoices();
    }
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0 && detachVoicesListener) {
        detachVoicesListener();
        detachVoicesListener = null;
      }
    };
  }

  return {
    start,
    pause,
    resume,
    stop,
    reset,
    subscribe,
    getSnapshot: () => snapshot,
  };
}

export const speechReader = createSpeechReader();
