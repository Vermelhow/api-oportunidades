import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import useAccessibility from '../hooks/useAccessibility';
import useFocusTrap from '../hooks/useFocusTrap';
import { getSpacingPreset, withSpacingPreset } from '../accessibility/preferences';
import '../styles/AccessibilityPanel.css';

const TEXT_CHOICES = [
  { value: '100', label: 'Padrão', hint: '100%' },
  { value: '125', label: 'Grande', hint: '125%' },
  { value: '150', label: 'Maior', hint: '150%' },
];

const SPACING_CHOICES = [
  { value: 'default', label: 'Padrão' },
  { value: 'medium', label: 'Moderado' },
  { value: 'wide', label: 'Amplo' },
];

const SPACING_FIELDS = [
  { key: 'lineHeight', label: 'Entre linhas' },
  { key: 'letterSpacing', label: 'Entre letras' },
  { key: 'wordSpacing', label: 'Entre palavras' },
  { key: 'paragraphSpacing', label: 'Entre parágrafos' },
];

const STORAGE_WARNING =
  'Não foi possível salvar suas preferências neste navegador; elas valem apenas enquanto esta aba estiver aberta.';

function choiceLabel(choices, value) {
  return choices.find((choice) => choice.value === value)?.label ?? value;
}

function PanelContent() {
  const { preferences, updatePreferences, resetPreferences, storageFailed, closePanel, panelId } = useAccessibility();
  // Montado só com o painel aberto: o texto anunciado começa vazio a cada abertura
  const [announcement, setAnnouncement] = useState('');

  const contrastId = useId();
  const contrastGroupId = useId();
  const contrastHintId = useId();
  const spacingPresetHintId = useId();
  const fieldIdBase = useId();

  const spacingPreset = getSpacingPreset(preferences);
  const highContrast = preferences.contrast === 'high';
  const forcedColors =
    typeof window.matchMedia === 'function' && window.matchMedia('(forced-colors: active)').matches;

  function announce(message, saved) {
    setAnnouncement(saved ? message : `${message} ${STORAGE_WARNING}`);
  }

  function handleTextChange(value) {
    announce(`Tamanho do texto: ${choiceLabel(TEXT_CHOICES, value)}, ${value}%.`, updatePreferences({ text: value }));
  }

  function handleContrastChange(event) {
    const high = event.target.checked;
    announce(
      high ? 'Alto contraste ativado.' : 'Alto contraste desativado.',
      updatePreferences({ contrast: high ? 'high' : 'default' })
    );
  }

  function handleSpacingPreset(level) {
    announce(
      `Espaçamento do texto: ${choiceLabel(SPACING_CHOICES, level)}.`,
      updatePreferences(withSpacingPreset(preferences, level))
    );
  }

  function handleSpacingField(field, value) {
    announce(
      `Espaçamento ${field.label.toLowerCase()}: ${choiceLabel(SPACING_CHOICES, value)}.`,
      updatePreferences({ [field.key]: value })
    );
  }

  function handleReset() {
    announce('Preferências restauradas para o padrão.', resetPreferences());
  }

  return (
    <>
      <div className="a11y-panel-header">
        <h2 className="a11y-panel-title" id={`${panelId}-title`}>Acessibilidade</h2>
        <button type="button" className="a11y-panel-close" onClick={closePanel}>
          <span aria-hidden="true">✕</span> Fechar
        </button>
      </div>

      <div className="a11y-panel-body">
        <p className="a11y-panel-intro" id={`${panelId}-intro`}>
          Ajuste a leitura da plataforma. Suas escolhas são salvas neste navegador e valem antes e depois do login.
        </p>

        <fieldset className="a11y-group">
          <legend className="a11y-legend">Tamanho do texto</legend>
          <div className="a11y-choices">
            {TEXT_CHOICES.map((choice) => (
              <label className="a11y-choice" key={choice.value}>
                <input
                  type="radio"
                  name="a11y-text-size"
                  value={choice.value}
                  checked={preferences.text === choice.value}
                  onChange={() => handleTextChange(choice.value)}
                />
                <span>
                  {choice.label} <span className="a11y-choice-hint">({choice.hint})</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="a11y-group" role="group" aria-labelledby={contrastGroupId}>
          <p className="a11y-legend" id={contrastGroupId}>Contraste</p>
          <div className="a11y-switch-row">
            <input
              id={contrastId}
              type="checkbox"
              role="switch"
              className="a11y-switch-input"
              checked={highContrast}
              onChange={handleContrastChange}
              aria-describedby={contrastHintId}
            />
            <label htmlFor={contrastId} className="a11y-switch-label">
              Alto contraste
              <span className="a11y-switch-state" aria-hidden="true">{highContrast ? 'Ativado' : 'Desativado'}</span>
            </label>
          </div>
          <p className="a11y-hint" id={contrastHintId}>
            Modo escuro: fundo preto, texto branco, destaques em amarelo e foco bem visível.
            {forcedColors && ' O sistema está usando cores forçadas, que têm prioridade sobre esta opção.'}
          </p>
        </div>

        <fieldset className="a11y-group" aria-describedby={spacingPreset === 'custom' ? spacingPresetHintId : undefined}>
          <legend className="a11y-legend">Espaçamento do texto</legend>
          <div className="a11y-choices">
            {SPACING_CHOICES.map((choice) => (
              <label className="a11y-choice" key={choice.value}>
                <input
                  type="radio"
                  name="a11y-spacing-preset"
                  value={choice.value}
                  checked={spacingPreset === choice.value}
                  onChange={() => handleSpacingPreset(choice.value)}
                />
                <span>{choice.label}</span>
              </label>
            ))}
          </div>
          {spacingPreset === 'custom' && (
            <p className="a11y-hint" id={spacingPresetHintId}>
              Personalizado: os ajustes individuais abaixo são diferentes entre si.
            </p>
          )}

          <div className="a11y-fields">
            {SPACING_FIELDS.map((field) => {
              const selectId = `${fieldIdBase}-${field.key}`;
              return (
                <div className="a11y-field" key={field.key}>
                  <label htmlFor={selectId}>{field.label}</label>
                  <select
                    id={selectId}
                    className="a11y-select"
                    value={preferences[field.key]}
                    onChange={(event) => handleSpacingField(field, event.target.value)}
                  >
                    {SPACING_CHOICES.map((choice) => (
                      <option key={choice.value} value={choice.value}>{choice.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </fieldset>

        {storageFailed && (
          <p className="a11y-note">{STORAGE_WARNING}</p>
        )}

        <p className="a11y-hint">
          Animações: a plataforma já respeita a configuração de redução de movimento do seu dispositivo.
        </p>
      </div>

      <div className="a11y-panel-footer">
        <button type="button" className="a11y-reset" onClick={handleReset}>
          Restaurar padrão
        </button>
      </div>

      <div className="sr-only" role="status" aria-live="polite">{announcement}</div>
    </>
  );
}

export default function AccessibilityPanel() {
  const { isPanelOpen, closePanel, panelId, triggerRef } = useAccessibility();

  // Foco para dentro ao abrir, Tab preso, Esc fecha e o foco volta para quem abriu
  const panelRef = useFocusTrap(isPanelOpen, closePanel);

  // Safari e Firefox no macOS não focam botões ao clicar: devolve o foco ao gatilho explicitamente.
  // Declarado depois de useFocusTrap, então este cleanup roda depois do dele.
  useEffect(() => {
    if (!isPanelOpen) return undefined;
    const trigger = triggerRef.current;
    return () => {
      if (trigger?.isConnected) trigger.focus();
    };
  }, [isPanelOpen, triggerRef]);

  if (!isPanelOpen) return null;

  // Portal: a Sidebar e o Header têm transform/overflow que alterariam o position:fixed do painel
  return createPortal(
    <>
      <div className="a11y-panel-overlay" onClick={closePanel} aria-hidden="true" />
      <div
        id={panelId}
        ref={panelRef}
        className="a11y-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${panelId}-title`}
        aria-describedby={`${panelId}-intro`}
        tabIndex={-1}
      >
        <PanelContent />
      </div>
    </>,
    document.body
  );
}
