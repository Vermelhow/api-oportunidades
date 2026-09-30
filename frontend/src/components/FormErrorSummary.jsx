import { useEffect, useRef } from 'react';

/**
 * Resumo de erros de um formulário, acessível a leitores de tela.
 *
 * Ao falhar a validação (mudança de `focusTrigger`), move o foco para este
 * resumo. Mover o foco é o que dispara o anúncio no leitor de tela — por
 * isso não usamos role="alert"/aria-live aqui: evita o anúncio ser perdido
 * (quando o nó nasce já com o texto, alguns leitores de tela não detectam a
 * mutação) e evita múltiplos anúncios sobrepostos quando vários campos estão
 * inválidos ao mesmo tempo.
 *
 * @param {object} errors - Mapa { nomeDoCampo: mensagemDeErro }
 * @param {number} focusTrigger - Incrementado a cada tentativa de submit
 * @param {string} title - Título exibido acima da lista de erros
 */
export default function FormErrorSummary({ errors, focusTrigger, title = 'Corrija os campos abaixo antes de continuar:' }) {
  const containerRef = useRef(null);
  const headingId = 'form-error-summary-title';
  const entries = Object.entries(errors || {}).filter(([, message]) => Boolean(message));

  useEffect(() => {
    if (entries.length > 0 && containerRef.current) {
      containerRef.current.focus();
    }
    // Reagir somente a novas tentativas de submit, não a qualquer mudança de `errors`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTrigger]);

  if (entries.length === 0) {
    return null;
  }

  function irParaCampo(e, campo) {
    e.preventDefault();
    document.getElementById(campo)?.focus();
  }

  return (
    <div
      ref={containerRef}
      className="form-error-summary"
      tabIndex={-1}
      aria-labelledby={headingId}
    >
      <p id={headingId} className="form-error-summary-title">
        {title}
      </p>
      <ul className="form-error-summary-list">
        {entries.map(([campo, mensagem]) => (
          <li key={campo}>
            <a href={`#${campo}`} onClick={(e) => irParaCampo(e, campo)}>
              {mensagem}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
