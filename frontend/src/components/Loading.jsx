import '../styles/Loading.css';

/**
 * Componente Loading com variações de tamanho e estilo
 * 
 * @param {string} size - Tamanho: 'sm', 'md', 'lg' (padrão: 'md')
 * @param {string} variant - Variação: 'spinner', 'dots', 'pulse' (padrão: 'spinner')
 * @param {string} text - Texto opcional a ser exibido
 * @param {boolean} fullscreen - Se true, ocupa tela inteira com overlay
 * @param {string} color - Cor: 'primary', 'white', 'dark' (padrão: 'primary')
 */
export default function Loading({ 
  size = 'md',
  variant = 'spinner',
  text = '',
  fullscreen = false,
  color = 'primary'
}) {
  
  const renderSpinner = () => (
    <div className={`loading-spinner loading-${size} loading-${color}`}>
      <div className="spinner-circle"></div>
    </div>
  );

  const renderDots = () => (
    <div className={`loading-dots loading-${size} loading-${color}`}>
      <div className="dot"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
  );

  const renderPulse = () => (
    <div className={`loading-pulse loading-${size} loading-${color}`}>
      <div className="pulse-ring"></div>
      <div className="pulse-ring"></div>
      <div className="pulse-ring"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'spinner':
      default:
        return renderSpinner();
    }
  };

  if (fullscreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          {renderLoader()}
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      {renderLoader()}
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}

/**
 * Variação para uso em botões
 */
export function ButtonLoading({ size = 'sm' }) {
  return (
    <div className={`button-loading loading-${size}`}>
      <div className="spinner-circle"></div>
    </div>
  );
}

/**
 * Skeleton loader para cards
 */
export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-header"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
      <div className="skeleton skeleton-footer"></div>
    </div>
  );
}

/**
 * Skeleton loader para lista
 */
export function SkeletonList({ count = 3 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          <div className="skeleton skeleton-circle"></div>
          <div className="skeleton-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-subtitle"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
