import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, signed } = useAuth();
  const navigate = useNavigate();

  // Redireciona para dashboard se já estiver autenticado
  useEffect(() => {
    if (signed) {
      navigate('/dashboard');
    }
  }, [signed, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações básicas
    if (!email || !senha) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('Por favor, insira um email válido');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, senha);

      if (result.success) {
        // Redireciona para o dashboard após login bem-sucedido
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Bem-vindo de volta!</h1>
              <p className="login-subtitle">
                Entre com suas credenciais para acessar sua conta
              </p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="senha" className="form-label">
                  Senha
                </label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="login-footer">
              <p>
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="link-primary">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>

          <div className="login-info">
            <div className="info-content">
              <h2 className="info-title">Faça parte da mudança</h2>
              <p className="info-description">
                Conecte-se a oportunidades de voluntariado que fazem a diferença
                na sua comunidade. Juntos, podemos transformar vidas.
              </p>
              <div className="info-features">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span>Oportunidades verificadas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🤝</span>
                  <span>Conexão direta com ONGs</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">📊</span>
                  <span>Acompanhe seu impacto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
