import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Gerencia o foco de modais/menus: ao abrir, move o foco para dentro do
 * container; enquanto aberto, prende a navegação por Tab/Shift+Tab dentro
 * dele e fecha com Escape; ao fechar, devolve o foco para o elemento que
 * havia aberto o componente (ex: botão que abriu o modal/menu).
 *
 * @param {boolean} isOpen - Se o modal/menu está aberto
 * @param {function} onClose - Callback chamado ao pressionar Escape
 * @returns {React.RefObject} ref a ser aplicada no container do modal/menu
 */
export default function useFocusTrap(isOpen, onClose) {
  const containerRef = useRef(null);
  const triggerElementRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    triggerElementRef.current = document.activeElement;

    const container = containerRef.current;

    const getFocusable = () =>
      container ? Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)) : [];

    // Move o foco para o primeiro elemento focável do container ao abrir
    const focusable = getFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      container?.focus();
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose?.();
        return;
      }

      if (e.key === 'Tab' && container) {
        const items = getFocusable();
        if (items.length === 0) {
          e.preventDefault();
          return;
        }

        const first = items[0];
        const last = items[items.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Devolve o foco para quem abriu o modal/menu
      triggerElementRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  return containerRef;
}
