import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const NotificationContext = createContext();

/**
 * Provider de notificações globais
 * Permite exibir toasts de qualquer lugar da aplicação
 */
export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      duration: 3000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Remove automaticamente após a duração
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      message,
      type: 'success',
      ...options,
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      message,
      type: 'error',
      duration: 5000, // Erros ficam mais tempo
      ...options,
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      message,
      type: 'warning',
      ...options,
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      message,
      type: 'info',
      ...options,
    });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Container de Toasts */}
      <div className="toast-container">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={0} // Controlado pelo context
            onClose={() => removeNotification(notification.id)}
            isVisible={true}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

/**
 * Hook para usar notificações
 * 
 * @returns {Object} Métodos para exibir notificações
 * 
 * @example
 * const { showSuccess, showError } = useNotification();
 * showSuccess('Operação realizada com sucesso!');
 * showError('Erro ao realizar operação');
 */
export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification deve ser usado dentro de NotificationProvider');
  }
  
  return context;
}
