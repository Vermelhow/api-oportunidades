import { Component } from 'react';
import '../styles/ErrorBoundary.css';

/**
 * Error Boundary para capturar erros de renderização
 * Previne que o app inteiro quebre quando um componente filho falha
 * 
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para serviço de monitoramento (ex: Sentry)
    console.error('Error Boundary capturou um erro:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Aqui você pode enviar para um serviço de logging
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Recarregar a página como último recurso
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI personalizado
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // UI padrão de erro
      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-icon">⚠️</div>
            
            <h1 className="error-boundary-title">
              Oops! Algo deu errado
            </h1>
            
            <p className="error-boundary-message">
              Desculpe, ocorreu um erro inesperado. Por favor, tente novamente.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary className="error-boundary-summary">
                  Ver detalhes técnicos
                </summary>
                <div className="error-boundary-stack">
                  <p className="error-message">
                    <strong>Erro:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="error-stack">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="error-boundary-actions">
              <button
                onClick={this.handleReset}
                className="btn btn-primary"
              >
                🔄 Tentar Novamente
              </button>
              
              <button
                onClick={this.handleReload}
                className="btn btn-outline"
              >
                ↻ Recarregar Página
              </button>

              <a href="/" className="btn btn-outline">
                🏠 Voltar ao Início
              </a>
            </div>

            <div className="error-boundary-footer">
              <p>
                Se o problema persistir, entre em contato com o suporte:{' '}
                <a href="mailto:suporte@oportunidades.com">
                  suporte@oportunidades.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * Componente de erro simples para uso pontual
 */
export function ErrorMessage({ 
  title = 'Erro',
  message = 'Ocorreu um erro inesperado',
  onRetry,
  showRetry = true,
  icon = '❌'
}) {
  return (
    <div className="error-message-component">
      <div className="error-icon">{icon}</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-text">{message}</p>
      {showRetry && onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          🔄 Tentar Novamente
        </button>
      )}
    </div>
  );
}

/**
 * Componente para estados vazios (empty states)
 * Exibido quando não há dados para mostrar
 */
export function EmptyState({ 
  icon = '📭',
  title = 'Nenhum item encontrado',
  message = 'Não há dados para exibir no momento.',
  actionText,
  onAction,
  illustration
}) {
  return (
    <div className="empty-state-component">
      <div className="empty-state-visual">
        {illustration ? (
          <div className="empty-state-illustration">{illustration}</div>
        ) : (
          <div className="empty-state-icon">{icon}</div>
        )}
      </div>
      
      <div className="empty-state-content">
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
      </div>
      
      {actionText && onAction && (
        <div className="empty-state-action">
          <button onClick={onAction} className="btn btn-primary">
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
}
