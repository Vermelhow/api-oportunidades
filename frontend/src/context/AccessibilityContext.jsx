import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AccessibilityContext } from './a11yContext';
import {
  DEFAULT_PREFERENCES,
  STORAGE_KEY,
  applyPreferences,
  loadPreferences,
  sanitizePreferences,
  savePreferences,
} from '../accessibility/preferences';

/**
 * Provider das preferências de acessibilidade (REQ-A29 a REQ-A32).
 *
 * Fica fora do AuthProvider: as preferências pertencem ao navegador, não ao
 * usuário autenticado, e portanto valem antes e depois do login/logout.
 */
export function AccessibilityProvider({ children }) {
  const [preferences, setPreferences] = useState(() => loadPreferences());
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);

  const preferencesRef = useRef(preferences);
  // Elemento que abriu o painel: recebe o foco de volta ao fechar
  const triggerRef = useRef(null);
  const panelId = useId();

  // main.jsx já aplica antes do primeiro render; garante o mesmo estado caso o provider seja usado sozinho
  useEffect(() => {
    applyPreferences(preferencesRef.current);
  }, []);

  const commit = useCallback((next) => {
    preferencesRef.current = next;
    setPreferences(next);
    applyPreferences(next);
    const saved = savePreferences(next);
    setStorageFailed(!saved);
    return saved;
  }, []);

  /** Atualiza uma ou mais preferências. Devolve false se não foi possível salvar. */
  const updatePreferences = useCallback(
    (patch) => commit(sanitizePreferences({ ...preferencesRef.current, ...patch })),
    [commit]
  );

  /** Restaurar padrão: remove a chave salva e todos os atributos do <html>. */
  const resetPreferences = useCallback(() => commit({ ...DEFAULT_PREFERENCES }), [commit]);

  // Sincroniza abas: o evento "storage" só dispara nas OUTRAS abas
  useEffect(() => {
    function handleStorage(event) {
      // key === null: localStorage.clear()
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      const next = loadPreferences();
      preferencesRef.current = next;
      setPreferences(next);
      applyPreferences(next);
    }

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const openPanel = useCallback((trigger) => {
    triggerRef.current = trigger || document.activeElement;
    setIsPanelOpen(true);
  }, []);

  // Estável (useCallback): useFocusTrap reexecuta o efeito quando onClose muda e devolveria o foco ao início
  const closePanel = useCallback(() => setIsPanelOpen(false), []);

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      resetPreferences,
      storageFailed,
      isPanelOpen,
      openPanel,
      closePanel,
      panelId,
      triggerRef,
    }),
    [preferences, updatePreferences, resetPreferences, storageFailed, isPanelOpen, openPanel, closePanel, panelId]
  );

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
