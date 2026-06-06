import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/Home.css';

export default function Home() {
  return (
    <Layout>
      <div className="home-container">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🌟</span>
              <span className="badge-text">Conectando pessoas a causas sociais</span>
            </div>
            
            <h1 className="hero-title">
              Plataforma de <span className="highlight">Oportunidades</span> Sociais
            </h1>
            
            <p className="hero-description">
              Centralize, gerencie e compartilhe oportunidades de voluntariado e ações sociais. 
              Uma solução completa para instituições que desejam ampliar seu impacto social.
            </p>
            
            <div className="hero-buttons">
              <Link to="/oportunidades" className="btn btn-primary">
                <span>🚀</span>
                Explorar Oportunidades
              </Link>
              <a href="#about" className="btn btn-secondary">
                <span>📖</span>
                Saiba Mais
              </a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-icon">📋</span>
                <div className="stat-info">
                  <strong>Oportunidades</strong>
                  <span>Centralizadas</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">🏢</span>
                <div className="stat-info">
                  <strong>Organizações</strong>
                  <span>Conectadas</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-icon">👥</span>
                <div className="stat-info">
                  <strong>Voluntários</strong>
                  <span>Engajados</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="about-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">💡 Sobre o Projeto</span>
              <h2 className="section-title">Transformando o Acesso a Oportunidades Sociais</h2>
              <p className="section-subtitle">
                Nossa missão é facilitar a conexão entre organizações sociais e voluntários, 
                tornando o engajamento cívico mais acessível e eficiente.
              </p>
            </div>
            
            <div className="about-content">
              <div className="about-card">
                <div className="about-icon">🎯</div>
                <h3>Objetivo</h3>
                <p>
                  Criar uma plataforma centralizada que permita a instituições como ONGs, 
                  CINE e setores de RH gerenciar e divulgar oportunidades de voluntariado, 
                  facilitando o acesso da comunidade a ações sociais significativas.
                </p>
              </div>
              
              <div className="about-card">
                <div className="about-icon">🌍</div>
                <h3>Impacto Social</h3>
                <p>
                  Reduzir barreiras entre pessoas que querem contribuir e organizações que 
                  precisam de apoio, fortalecendo o tecido social e promovendo uma cultura 
                  de solidariedade e participação cidadã.
                </p>
              </div>
              
              <div className="about-card">
                <div className="about-icon">🤝</div>
                <h3>Compromisso</h3>
                <p>
                  Oferecer uma ferramenta gratuita, intuitiva e profissional que empodere 
                  organizações sociais a ampliar seu alcance e tornar a gestão de 
                  voluntários mais eficiente e transparente.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="how-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">⚙️ Como Funciona</span>
              <h2 className="section-title">Simples, Rápido e Eficiente</h2>
              <p className="section-subtitle">
                Em poucos passos, sua organização pode começar a divulgar oportunidades 
                e conectar-se com voluntários engajados.
              </p>
            </div>
            
            <div className="steps-container">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-icon">📝</div>
                <h3>Cadastre sua Organização</h3>
                <p>
                  Crie um perfil para sua instituição com informações básicas, 
                  missão e áreas de atuação.
                </p>
              </div>
              
              <div className="step-arrow">→</div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-icon">📋</div>
                <h3>Publique Oportunidades</h3>
                <p>
                  Adicione detalhes sobre as vagas de voluntariado: descrição, 
                  requisitos, local e formato de participação.
                </p>
              </div>
              
              <div className="step-arrow">→</div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-icon">🌐</div>
                <h3>Conecte-se com Voluntários</h3>
                <p>
                  Voluntários interessados poderão visualizar e entrar em contato 
                  diretamente pela plataforma.
                </p>
              </div>
              
              <div className="step-arrow">→</div>
              
              <div className="step-card">
                <div className="step-number">4</div>
                <div className="step-icon">📊</div>
                <h3>Gerencie e Acompanhe</h3>
                <p>
                  Use o painel administrativo para gerenciar inscrições, atualizar 
                  informações e acompanhar métricas de engajamento.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="section-container">
            <div className="section-header">
              <span className="section-badge">✨ Benefícios</span>
              <h2 className="section-title">Por Que Usar Nossa Plataforma?</h2>
            </div>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🔓</div>
                <h3>Acesso Gratuito</h3>
                <p>100% gratuito para organizações sociais sem fins lucrativos.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">⚡</div>
                <h3>Fácil de Usar</h3>
                <p>Interface intuitiva que não requer conhecimento técnico.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">📱</div>
                <h3>Responsivo</h3>
                <p>Funciona perfeitamente em computadores, tablets e celulares.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">🔍</div>
                <h3>Busca Inteligente</h3>
                <p>Sistema de busca e filtros para encontrar oportunidades rapidamente.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3>Dashboard Completo</h3>
                <p>Painel administrativo com estatísticas e gestão centralizada.</p>
              </div>
              
              <div className="benefit-card">
                <div className="benefit-icon">🔒</div>
                <h3>Seguro</h3>
                <p>Sistema de autenticação protegido e dados criptografados.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">Pronto para Ampliar seu Impacto Social?</h2>
            <p className="cta-description">
              Junte-se a organizações que já estão usando nossa plataforma para conectar 
              pessoas a causas sociais e transformar comunidades.
            </p>
            <div className="cta-buttons">
              <Link to="/cadastro" className="btn btn-primary btn-large">
                <span>🚀</span>
                Cadastrar Minha Organização
              </Link>
              <Link to="/oportunidades" className="btn btn-secondary btn-large">
                <span>🔍</span>
                Ver Oportunidades Disponíveis
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Info */}
        <section className="footer-info">
          <div className="footer-content">
            <div className="footer-column">
              <h4>📞 Contato</h4>
              <p>Para dúvidas ou suporte, entre em contato através da sua instituição de ensino.</p>
            </div>
            <div className="footer-column">
              <h4>🎓 Projeto Acadêmico</h4>
              <p>Desenvolvido como parte de um projeto acadêmico voltado para impacto social.</p>
            </div>
            <div className="footer-column">
              <h4>🔗 Links Rápidos</h4>
              <div className="footer-links">
                <Link to="/oportunidades">Oportunidades</Link>
                <Link to="/login">Login</Link>
                <Link to="/cadastro">Cadastro</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
