import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { isValidEmail, validatePassword } from '../utils/auth';
import Layout from '../components/Layout';
import { ButtonLoading } from '../components';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', senha: '', general: '' });
  const [touched, setTouched] = useState({ email: false, senha: false });
  const [showPassword, setShowPassword] = useState(false);

  const { login, signed } = useAuth();
  const { showSuccess, showError: showErrorNotification } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  // Pega a rota de origem (de onde foi redirecionado)
  const from = location.state?.from || '/dashboard';

  // Redireciona para a rota de origem se já estiver autenticado
  useEffect(() => {
    if (signed) {
      navigate(from, { replace: true });
    }
  }, [signed, navigate, from]);

  // Validar email em tempo real (quando campo perde foco)
  const validateEmailField = () => {
    if (!touched.email) return;
    
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email é obrigatório' }));
      return false;
    }
    
    if (!isValidEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  // Validar senha em tempo real (quando campo perde foco)
  const validateSenhaField = () => {
    if (!touched.senha) return;
    
    if (!senha.trim()) {
      setErrors(prev => ({ ...prev, senha: 'Senha é obrigatória' }));
      return false;
    }
    
    const passwordValidation = validatePassword(senha);
    if (!passwordValidation.isValid) {
      setErrors(prev => ({ ...prev, senha: passwordValidation.message }));
      return false;
    }
    
    setErrors(prev => ({ ...prev, senha: '' }));
    return true;
  };

  // Executar validação quando os campos mudarem
  useEffect(() => {
    if (touched.email) {
      validateEmailField();
    }
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.senha) {
      validateSenhaField();
    }
  }, [senha, touched.senha]);

  // Verificar se o formulário é válido
  const isFormValid = () => {
    return (
      email.trim() !== '' &&
      isValidEmail(email) &&
      senha.trim() !== '' &&
      validatePassword(senha).isValid &&
      !loading
    );
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({ email: '', senha: '', general: '' });
    setLoading(true);

    // Validação de email
    if (!email.trim()) {
      setErrors(prev => ({ ...prev, email: 'Email é obrigatório' }));
      setLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Email inválido' }));
      setLoading(false);
      return;
    }

    // Validação de senha
    if (!senha.trim()) {
      setErrors(prev => ({ ...prev, senha: 'Senha é obrigatória' }));
      setLoading(false);
      return;
    }

    const passwordValidation = validatePassword(senha);
    if (!passwordValidation.isValid) {
      setErrors(prev => ({ ...prev, senha: passwordValidation.message }));
      setLoading(false);
      return;
    }

    try {
      const result = await login(email.trim(), senha);

      if (result.success) {
        showSuccess('Login realizado com sucesso!');
        // Redireciona para a rota de origem após pequeno delay
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        const errorMsg = result.error || 'Erro ao fazer login';
        setErrors(prev => ({ ...prev, general: errorMsg }));
        showErrorNotification(errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Erro ao conectar com o servidor. Tente novamente.';
      setErrors(prev => ({ ...prev, general: errorMsg }));
      showErrorNotification(errorMsg);
      console.error('Erro no login:', err);
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

            {errors.general && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{errors.general}</span>
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
                    className={`form-input ${errors.email && touched.email ? 'error' : ''} ${!errors.email && touched.email && email ? 'success' : ''}`}
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, email: true }));
                    }}
                    disabled={loading}
                    autoComplete="email"
                    required
                  />
                  {!errors.email && touched.email && email && (
                    <span className="input-success-icon">✓</span>
                  )}
                </div>
                {errors.email && touched.email && (
                  <span className="error-message">⚠️ {errors.email}</span>
                )}
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
                    className={`form-input ${errors.senha && touched.senha ? 'error' : ''} ${!errors.senha && touched.senha && senha ? 'success' : ''}`}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                    }}
                    onBlur={() => {
                      setTouched(prev => ({ ...prev, senha: true }));
                    }}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  {!errors.senha && touched.senha && senha && (
                    <span className="input-success-icon">✓</span>
                  )}
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                {errors.senha && touched.senha && (
                  <span className="error-message">⚠️ {errors.senha}</span>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block"
                disabled={loading || !isFormValid()}
                title={!isFormValid() && !loading ? 'Preencha todos os campos corretamente' : ''}
              >
                {loading ? <><ButtonLoading /> Entrando...</> : 'Entrar'}
              </button>
              
              {!isFormValid() && (touched.email || touched.senha) && !loading && (
                <div className="form-hint">
                  💡 Preencha todos os campos corretamente para fazer login
                </div>
              )}
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
