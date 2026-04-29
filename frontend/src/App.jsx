import './styles/App.css'

function App() {
  return (
    <div className="app-container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              API de<br />
              <span className="highlight">Oportunidades</span>
            </h1>
            <p className="hero-subtitle">
              Centralize ações sociais<br />
              em um só lugar
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Começar Agora</button>
              <button className="btn btn-secondary">Saiba Mais</button>
            </div>
          </div>
          
          <div className="hero-icons">
            <div className="icon-card">
              <div className="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="7" width="18" height="13" rx="2" />
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </div>
            </div>
            
            <div className="icon-card">
              <div className="icon-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            
            <div className="icon-card">
              <div className="icon-box highlight-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>📋 Oportunidades</h3>
          <p>Encontre e gerencie oportunidades de voluntariado e ações sociais</p>
        </div>
        <div className="feature-card">
          <h3>🤝 Organizações</h3>
          <p>Conecte-se com organizações que fazem a diferença na comunidade</p>
        </div>
        <div className="feature-card">
          <h3>👥 Comunidade</h3>
          <p>Junte-se a pessoas engajadas em transformar a sociedade</p>
        </div>
      </div>
    </div>
  )
}

export default App
