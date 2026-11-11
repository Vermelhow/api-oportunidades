import { useContext } from 'react';
import { AccessibilityContext } from '../context/a11yContext';

/**
 * Acesso às preferências de acessibilidade e ao painel.
 *
 * @example
 * const { preferences, updatePreferences, openPanel } = useAccessibility();
 */
export default function useAccessibility() {
  const context = useContext(AccessibilityContext);

  if (!context) {
    throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider');
  }

  return context;
}
