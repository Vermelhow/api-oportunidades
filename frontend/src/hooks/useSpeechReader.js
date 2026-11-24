import { useSyncExternalStore } from 'react';
import { speechReader } from '../accessibility/speech';

/**
 * Estado e controles do leitor em voz alta (REQ-A33).
 *
 * O leitor é único para a aplicação (speechSynthesis é global ao navegador),
 * então qualquer componente que usar este hook enxerga a mesma leitura.
 *
 * @example
 * const { supported, status, start, pause, resume, stop } = useSpeechReader();
 */
export default function useSpeechReader() {
  const snapshot = useSyncExternalStore(speechReader.subscribe, speechReader.getSnapshot, speechReader.getSnapshot);

  return {
    ...snapshot,
    start: speechReader.start,
    pause: speechReader.pause,
    resume: speechReader.resume,
    stop: speechReader.stop,
    reset: speechReader.reset,
  };
}
