import useAccessibility from '../hooks/useAccessibility';
import '../styles/AccessibilityButton.css';

/**
 * Gatilho do painel de acessibilidade. O painel é único (AccessibilityPanel,
 * montado em App.jsx); cada layout apenas posiciona este botão.
 *
 * @param {string} className - variante visual por contexto (ex.: a11y-trigger--header)
 * @param {boolean} iconOnly - mostra só o ícone; o nome acessível continua "Acessibilidade"
 * @param {function} onOpen - chamado antes de abrir (ex.: fechar um menu que contém o botão)
 */
export default function AccessibilityButton({ className = '', iconOnly = false, onOpen }) {
  const { isPanelOpen, openPanel, panelId } = useAccessibility();

  function handleClick(event) {
    onOpen?.();
    openPanel(event.currentTarget);
  }

  return (
    <button
      type="button"
      className={`a11y-trigger ${className}`.trim()}
      aria-haspopup="dialog"
      aria-expanded={isPanelOpen}
      aria-controls={panelId}
      aria-label={iconOnly ? 'Acessibilidade' : undefined}
      title={iconOnly ? 'Acessibilidade' : undefined}
      onClick={handleClick}
    >
      <span className="a11y-trigger-icon" aria-hidden="true">Aa</span>
      {!iconOnly && <span className="a11y-trigger-label">Acessibilidade</span>}
    </button>
  );
}
