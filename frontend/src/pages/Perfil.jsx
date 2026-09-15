import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { getPessoaById, updatePessoa } from '../services/api';
import { Layout, Loading, FormField, FormActions, ButtonLoading } from '../components';
import '../styles/Perfil.css';

export default function Perfil() {
  const { user, loading, signed, logout, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [perfilCompleto, setPerfilCompleto] = useState(null);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !signed) {
      navigate('/login');
    }
  }, [loading, signed, navigate]);

  // Carrega os dados completos da pessoa (bio, links) que não vêm no login
  useEffect(() => {
    if (!user?.id) return;

    getPessoaById(user.id)
      .then((response) => {
        const dados = response?.data || response;
        setPerfilCompleto(dados);
        setFormData({
          nome: dados.nome || '',
          email: dados.email || '',
          bio: dados.bio || '',
          linkedin_url: dados.linkedin_url || '',
          github_url: dados.github_url || '',
          portfolio_url: dados.portfolio_url || '',
        });
      })
      .catch((err) => {
        showError(err.message || 'Erro ao carregar dados do perfil');
      })
      .finally(() => setCarregandoPerfil(false));
  }, [user?.id]);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validarUrl(valor) {
    if (!valor) return true;
    try {
      new URL(valor);
      return true;
    } catch {
      return false;
    }
  }

  function validarFormulario() {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      novosErros.email = 'Email inválido';
    }

    if (formData.bio && formData.bio.length > 1000) {
      novosErros.bio = 'Bio deve ter no máximo 1000 caracteres';
    }

    if (!validarUrl(formData.linkedin_url)) novosErros.linkedin_url = 'URL inválida';
    if (!validarUrl(formData.github_url)) novosErros.github_url = 'URL inválida';
    if (!validarUrl(formData.portfolio_url)) novosErros.portfolio_url = 'URL inválida';

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function iniciarEdicao() {
    setIsEditing(true);
  }

  function cancelarEdicao() {
    if (perfilCompleto) {
      setFormData({
        nome: perfilCompleto.nome || '',
        email: perfilCompleto.email || '',
        bio: perfilCompleto.bio || '',
        linkedin_url: perfilCompleto.linkedin_url || '',
        github_url: perfilCompleto.github_url || '',
        portfolio_url: perfilCompleto.portfolio_url || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setSaving(true);

      const dados = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        bio: formData.bio?.trim() || null,
        linkedin_url: formData.linkedin_url?.trim() || null,
        github_url: formData.github_url?.trim() || null,
        portfolio_url: formData.portfolio_url?.trim() || null,
      };

      const response = await updatePessoa(user.id, dados);
      const pessoaAtualizada = response?.data || response;

      setPerfilCompleto(pessoaAtualizada);
      updateUser(pessoaAtualizada);
      showSuccess('Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (err) {
      showError(err.message || 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  }

  // Exibe loading enquanto carrega os dados
  if (loading || carregandoPerfil) {
    return (
      <Layout>
        <div className="perfil-loading">
          <Loading variant="spinner" size="large" />
          <p>Carregando perfil...</p>
        </div>
      </Layout>
    );
  }

  // Caso não existam dados do usuário
  if (!user) {
    return (
      <Layout>
        <div className="perfil-error">
          <div className="error-icon">⚠️</div>
          <h2>Dados do usuário não encontrados</h2>
          <p>Não foi possível carregar as informações do seu perfil.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Fazer Login
          </button>
        </div>
      </Layout>
    );
  }

  // Extrai as iniciais do nome para o avatar
  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <Layout>
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Meu Perfil</h1>
          <p className="perfil-subtitle">Gerencie suas informações pessoais</p>
        </div>

        <div className="perfil-card">
          {/* Avatar */}
          <div className="perfil-avatar-section">
            <div className="perfil-avatar">
              {getInitials(user.nome)}
            </div>
            <h2 className="perfil-nome">{perfilCompleto?.nome || user.nome}</h2>
            <p className="perfil-email">{perfilCompleto?.email || user.email}</p>
          </div>

          {!isEditing ? (
            <>
              {/* Informações */}
              <div className="perfil-info-section">
                <h3 className="section-title">Informações da Conta</h3>

                <div className="info-group">
                  <div className="info-item">
                    <span className="info-icon">👤</span>
                    <div className="info-content">
                      <label className="info-label">Nome Completo</label>
                      <p className="info-value">{perfilCompleto?.nome}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📧</span>
                    <div className="info-content">
                      <label className="info-label">E-mail</label>
                      <p className="info-value">{perfilCompleto?.email}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">📝</span>
                    <div className="info-content">
                      <label className="info-label">Bio</label>
                      <p className="info-value">{perfilCompleto?.bio || 'Nenhuma bio cadastrada'}</p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">🔗</span>
                    <div className="info-content">
                      <label className="info-label">Links</label>
                      <p className="info-value">
                        {perfilCompleto?.linkedin_url && (
                          <a href={perfilCompleto.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        )}
                        {perfilCompleto?.github_url && (
                          <> · <a href={perfilCompleto.github_url} target="_blank" rel="noopener noreferrer">GitHub</a></>
                        )}
                        {perfilCompleto?.portfolio_url && (
                          <> · <a href={perfilCompleto.portfolio_url} target="_blank" rel="noopener noreferrer">Portfólio</a></>
                        )}
                        {!perfilCompleto?.linkedin_url && !perfilCompleto?.github_url && !perfilCompleto?.portfolio_url && (
                          'Nenhum link cadastrado'
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="info-item">
                    <span className="info-icon">🆔</span>
                    <div className="info-content">
                      <label className="info-label">ID de Usuário</label>
                      <p className="info-value">#{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ações */}
              <div className="perfil-actions">
                <button onClick={iniciarEdicao} className="btn btn-primary">
                  ✏️ Editar Perfil
                </button>
                <button onClick={handleLogout} className="btn btn-danger btn-logout">
                  🚪 Sair da Conta
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="perfil-edit-form">
              <h3 className="section-title">Editar Informações</h3>

              <FormField
                label="Nome Completo"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
                required
              />
              <FormField
                label="E-mail"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <FormField
                label="Bio"
                name="bio"
                type="textarea"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                error={errors.bio}
                placeholder="Fale um pouco sobre você"
              />
              <FormField
                label="LinkedIn"
                name="linkedin_url"
                value={formData.linkedin_url}
                onChange={handleChange}
                error={errors.linkedin_url}
                placeholder="https://linkedin.com/in/..."
              />
              <FormField
                label="GitHub"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                error={errors.github_url}
                placeholder="https://github.com/..."
              />
              <FormField
                label="Portfólio"
                name="portfolio_url"
                value={formData.portfolio_url}
                onChange={handleChange}
                error={errors.portfolio_url}
                placeholder="https://..."
              />

              <FormActions>
                <button type="button" className="btn btn-outline" onClick={cancelarEdicao} disabled={saving}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? <><ButtonLoading /> Salvando...</> : 'Salvar Alterações'}
                </button>
              </FormActions>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}
