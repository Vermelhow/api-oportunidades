import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Layout from '../components/Layout';
import '../styles/Cadastro.css';

export default function Cadastro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }

  function validateForm() {
    const newErrors = {};

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    // Validação da senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Validação da confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirme sua senha';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      showError('Por favor, corrija os erros do formulário');
      return;
    }

    setLoading(true);

    try {
      console.log('Iniciando cadastro...', { nome: formData.nome, email: formData.email });
      const result = await register(formData.nome, formData.email, formData.senha);
      console.log('Resultado do cadastro:', result);

      if (result && result.success) {
        showSuccess('✅ Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const errorMsg = result?.error || 'Erro ao realizar cadastro';
        showError(errorMsg);
        setLoading(false);
      }
    } catch (error) {
      console.error('Erro no catch:', error);
      const errorMsg = error?.message || 'Erro ao realizar cadastro. Tente novamente.';
      showError(errorMsg);
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="cadastro-container">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <div className="cadastro-icon">✨</div>
            <h1 className="cadastro-title">Criar Conta</h1>
            <p className="cadastro-subtitle">
              Junte-se a nós e faça a diferença no mundo!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nome" className="form-label">
                <span className="label-icon">👤</span>
                Nome Completo
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={`form-input ${errors.nome ? 'input-error' : ''}`}
                placeholder="Digite seu nome completo"
                disabled={loading}
              />
              {errors.nome && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.nome}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <span className="label-icon">📧</span>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="seu@email.com"
                disabled={loading}
              />
              {errors.email && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.email}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha" className="form-label">
                <span className="label-icon">🔒</span>
                Senha
              </label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={`form-input ${errors.senha ? 'input-error' : ''}`}
                placeholder="Mínimo 6 caracteres"
                disabled={loading}
              />
              {errors.senha && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.senha}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha" className="form-label">
                <span className="label-icon">🔐</span>
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmarSenha"
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className={`form-input ${errors.confirmarSenha ? 'input-error' : ''}`}
                placeholder="Digite a senha novamente"
                disabled={loading}
              />
              {errors.confirmarSenha && (
                <span className="error-message">
                  <span className="error-icon">⚠️</span>
                  {errors.confirmarSenha}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Cadastrando...
                </>
              ) : (
                <>
                  <span>🚀</span>
                  Criar Conta
                </>
              )}
            </button>
          </form>

          <div className="cadastro-footer">
            <p className="footer-text">
              Já tem uma conta?{' '}
              <Link to="/login" className="link-primary">
                Fazer Login
              </Link>
            </p>
          </div>
        </div>

        <div className="cadastro-benefits">
          <h2 className="benefits-title">Por que se cadastrar?</h2>
          
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <div className="benefit-content">
                <h3>Encontre Oportunidades</h3>
                <p>Acesse vagas de voluntariado e ações sociais</p>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">💼</span>
              <div className="benefit-content">
                <h3>Gerencie Projetos</h3>
                <p>Organize e publique suas próprias oportunidades</p>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">🤝</span>
              <div className="benefit-content">
                <h3>Conecte-se</h3>
                <p>Faça parte de uma comunidade engajada</p>
              </div>
            </div>

            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <div className="benefit-content">
                <h3>Acompanhe seu Impacto</h3>
                <p>Veja estatísticas e resultados do seu trabalho</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
