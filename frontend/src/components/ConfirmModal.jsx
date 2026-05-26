import { useEffect } from 'react';
import '../styles/ConfirmModal.css';

/**
 * Modal de Confirmação Reutilizável
 * 
 * @param {boolean} isOpen - Controla a visibilidade do modal
 * @param {function} onClose - Callback ao fechar/cancelar
 * @param {function} onConfirm - Callback ao confirmar
 * @param {string} title - Título do modal
 * @param {string} message - Mensagem de confirmação
 * @param {string} confirmText - Texto do botão de confirmação
 * @param {string} cancelText - Texto do botão de cancelar
 * @param {string} type - Tipo do modal: 'danger', 'warning', 'info'
 * @param {boolean} loading - Estado de loading durante ação
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmação',
  message = 'Tem certeza que deseja realizar esta ação?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger',
  loading = false,
  children
}) {
  // Fecha modal ao pressionar ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Previne scroll do body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❓';
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className={`modal-container modal-${type}`}>
        <div className="modal-header">
          <span className="modal-icon">{getIcon()}</span>
          <h2 className="modal-title">{title}</h2>
        </div>

        <div className="modal-body">
          {children || <p className="modal-message">{message}</p>}
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn btn-cancel"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`btn btn-confirm btn-${type}`}
            type="button"
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Processando...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
