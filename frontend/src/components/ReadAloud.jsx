import { useEffect, useId, useRef } from 'react';
import useSpeechReader from '../hooks/useSpeechReader';
import { buildOpportunityReading } from '../accessibility/opportunityReading';
import '../styles/ReadAloud.css';

const ERROR_MESSAGES = {
  unsupported: 'Este navegador não oferece leitura em voz alta.',
  empty: 'Não há texto disponível para ler nesta oportunidade.',
  failed: 'Não foi possível ler em voz alta. Tente novamente ou use o leitor de tela do seu dispositivo.',
  'not-started':
    'A leitura não começou. Verifique o volume e se o dispositivo tem uma voz em português instalada.',
};

// Texto da região de status: só muda quando o estado muda (o progresso fica fora dela para não ser anunciado a cada trecho)
function describeStatus({ status, outcome, error }) {
  if (status === 'speaking') return { text: 'Lendo em voz alta.', icon: '🔊', tone: 'speaking' };
  if (status === 'paused') return { text: 'Leitura pausada.', icon: '⏸', tone: 'paused' };
  if (outcome === 'finished') return { text: 'Leitura concluída.', icon: '✓', tone: 'done' };
  if (outcome === 'stopped') return { text: 'Leitura interrompida.', icon: '⏹', tone: 'done' };
  if (outcome === 'error') {
    return { text: ERROR_MESSAGES[error] || ERROR_MESSAGES.failed, icon: '⚠', tone: 'error' };
  }
  return null;
}

/**
 * Leitura em voz alta de uma oportunidade (REQ-A33), com a Web Speech API do navegador.
 * Nunca inicia sozinha: só após o clique/Enter/Espaço do usuário. Para ao sair da página
 * ou quando a oportunidade exibida muda (use key={id} no uso para parar já na troca de rota).
 */
export default function ReadAloud({ oportunidade }) {
  const { supported, status, outcome, error, index, total, voiceMissing, start, pause, resume, stop, reset } =
    useSpeechReader();
  const titleId = useId();
  const primaryRef = useRef(null);

  // Depende só do id: um novo objeto com a mesma oportunidade (recarga de dados) não deve interromper a leitura
  const opportunityId = oportunidade?.id;
  useEffect(() => {
    const handlePageHide = () => reset();
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
      reset();
    };
  }, [opportunityId, reset]);

  const active = status !== 'idle';

  function handlePrimary() {
    if (status === 'speaking') pause();
    else if (status === 'paused') resume();
    else start(buildOpportunityReading(oportunidade));
  }

  function handleStop() {
    if (!active) return;
    stop();
    // O botão pressionado fica inativo: devolve o foco ao botão principal para não perdê-lo
    primaryRef.current?.focus();
  }

  const primary =
    status === 'speaking'
      ? { label: 'Pausar leitura', icon: '⏸' }
      : status === 'paused'
        ? { label: 'Continuar leitura', icon: '▶' }
        : { label: outcome ? 'Ouvir novamente' : 'Ouvir oportunidade', icon: '▶' };

  const statusInfo = describeStatus({ status, outcome, error });

  return (
    <section className="read-aloud" aria-labelledby={titleId}>
      <h2 className="read-aloud-title" id={titleId}>
        <span aria-hidden="true">🔊</span> Ouvir esta oportunidade
      </h2>

      {supported ? (
        <>
          <p className="read-aloud-hint">
            Ouça o título, as informações principais e a descrição, em português do Brasil. A leitura só começa quando
            você escolher.
          </p>

          <div className="read-aloud-controls">
            <button
              ref={primaryRef}
              type="button"
              className="btn btn-primary"
              onClick={handlePrimary}
            >
              <span aria-hidden="true">{primary.icon}</span> {primary.label}
            </button>
            {/* aria-disabled (e não disabled) mantém o botão focável: o foco não se perde quando a leitura termina sozinha */}
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleStop}
              aria-disabled={active ? undefined : 'true'}
            >
              <span aria-hidden="true">⏹</span> Parar leitura
            </button>
          </div>

          {voiceMissing && (
            <p className="read-aloud-note">
              Este dispositivo não tem voz em português instalada. A leitura pode usar outra voz, e a pronúncia pode
              ficar diferente do esperado.
            </p>
          )}
        </>
      ) : (
        <p className="read-aloud-note">
          Seu navegador não oferece leitura em voz alta. Você pode ler o conteúdo desta página normalmente ou usar o
          leitor de tela do seu dispositivo.
        </p>
      )}

      <p
        className={`read-aloud-status${statusInfo ? ` read-aloud-status--active read-aloud-status--${statusInfo.tone}` : ''}`}
        role="status"
      >
        {statusInfo && (
          <>
            <span aria-hidden="true">{statusInfo.icon}</span> <span>{statusInfo.text}</span>
          </>
        )}
      </p>
      {active && total > 0 && (
        <p className="read-aloud-progress" aria-hidden="true">
          Parte {index} de {total}
        </p>
      )}
    </section>
  );
}
