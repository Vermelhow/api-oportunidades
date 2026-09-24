import { useEffect } from 'react';
import '../styles/Toast.css';

/**
 * Componente Toast para notificações
 * 
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Duração em ms (padrão: 3000)
 * @param {function} onClose - Callback ao fechar
 * @param {boolean} isVisible - Controla visibilidade
 */
export default function Toast({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  isVisible = true 
}) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible || !message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return 'ℹ';
    }
  };

  // A live region "polite" fica no container persistente (NotificationContext).
  // Aqui só sobrescrevemos para "alert" (assertive) em erros, que deve
  // interromper a fala atual; nos demais tipos não repetimos role/aria-live
  // para não criar uma live region aninhada e duplicar o anúncio.
  const role = type === 'error' ? 'alert' : undefined;

  return (
    <div className={`toast toast-${type}`} role={role}>
      <div className="toast-icon" aria-hidden="true">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      {onClose && (
        <button 
          onClick={onClose} 
          className="toast-close"
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      )}
    </div>
  );
}
