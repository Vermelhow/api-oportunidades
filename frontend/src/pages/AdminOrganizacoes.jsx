import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createOrganizacao, 
  updateOrganizacao, 
  getOrganizacaoById 
} from '../services/api';
import { useNotification } from '../context/NotificationContext';
import { Sidebar, Loading, FormField, FormRow, FormSection, FormActions } from '../components';
import '../styles/AdminOrganizacoes.css';

function AdminOrganizacoes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showSuccess, showError } = useNotification();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    email: '',
    telefone: '',
    website: '',
    endereco: ''
  });

  const [errors, setErrors] = useState({});

  // Carregar dados da organização se estiver editando
  useEffect(() => {
    if (isEditMode) {
      loadOrganizacao();
    }
  }, [id]);

  async function loadOrganizacao() {
    try {
      setLoading(true);
      const response = await getOrganizacaoById(id);
      const org = response?.data || response;
      
      if (org) {
        setFormData({
          nome: org.nome || '',
          descricao: org.descricao || '',
          email: org.email || '',
          telefone: org.telefone || '',
          website: org.website || '',
          endereco: org.endereco || ''
        });
      }
    } catch (error) {
      console.error('Erro ao carregar organização:', error);
      showError(error?.message || 'Erro ao carregar organização');
      navigate('/admin/organizacoes');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpar erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }

  function validateForm() {
    const newErrors = {};

    // Nome: obrigatório, mínimo 3 caracteres
    if (!formData.nome?.trim()) {
      newErrors.nome = '⚠ Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = '⚠ Nome deve ter no mínimo 3 caracteres';
    }

    // Email: obrigatório, formato válido
    if (!formData.email?.trim()) {
      newErrors.email = '⚠ Email é obrigatório';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '⚠ Email inválido';
      }
    }

    // Telefone: opcional, mas se preenchido deve ter formato válido
    if (formData.telefone?.trim()) {
      const telefoneRegex = /^[\d\s\-\(\)]+$/;
      if (!telefoneRegex.test(formData.telefone) || formData.telefone.replace(/\D/g, '').length < 10) {
        newErrors.telefone = '⚠ Telefone inválido (mínimo 10 dígitos)';
      }
    }

    // Website: opcional, mas se preenchido deve ter formato válido
    if (formData.website?.trim()) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = '⚠ URL inválida (deve começar com http:// ou https://)';
      }
    }

    // Descrição: opcional, mas se preenchida deve ter mínimo 10 caracteres
    if (formData.descricao?.trim() && formData.descricao.trim().length < 10) {
      newErrors.descricao = '⚠ Descrição deve ter no mínimo 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      showError('Corrija os erros no formulário');
      // Scroll até o primeiro erro
      const firstError = document.querySelector('.form-field.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      setSaving(true);

      // Preparar dados (remover espaços em branco)
      const dataToSave = {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || null,
        email: formData.email.trim(),
        telefone: formData.telefone?.trim() || null,
        website: formData.website?.trim() || null,
        endereco: formData.endereco?.trim() || null
      };

      if (isEditMode) {
        await updateOrganizacao(id, dataToSave);
        showSuccess('Organização atualizada com sucesso!');
      } else {
        await createOrganizacao(dataToSave);
        showSuccess('Organização criada com sucesso!');
      }

      // Aguardar um momento e redirecionar
      setTimeout(() => {
        navigate('/admin/organizacoes');
      }, 1000);

    } catch (error) {
      console.error('Erro ao salvar organização:', error);
      showError(error?.message || 'Erro ao salvar organização');
    } finally {
      setSaving(false);
    }
  }

  function handleClear() {
    if (window.confirm('Deseja realmente limpar todos os campos?')) {
      setFormData({
        nome: '',
        descricao: '',
        email: '',
        telefone: '',
        website: '',
        endereco: ''
      });
      setErrors({});
    }
  }

  function handleBack() {
    navigate('/admin/organizacoes');
  }

  if (loading) {
    return (
      <div className="admin-layout">
        <Sidebar />
        <div className="admin-content">
          <Loading 
            fullscreen={false} 
            text="Carregando organização..." 
            size="lg" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="admin-content">
        <div className="admin-header">
          <div>
            <h1>{isEditMode ? '✏️ Editar Organização' : '➕ Nova Organização'}</h1>
            <p>
              {isEditMode 
                ? 'Atualize as informações da organização' 
                : 'Preencha os dados da nova organização'
              }
            </p>
          </div>
          <button 
            type="button"
            className="btn btn-secondary"
            onClick={handleBack}
          >
            ← Voltar para Lista
          </button>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          {/* Seção: Informações Básicas */}
          <FormSection title="📝 Informações Básicas">
            <FormRow>
              <FormField
                label="Nome da Organização"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                error={errors.nome}
                required
                placeholder="Ex: Fundação XYZ"
                width="full"
              />
            </FormRow>

            <FormRow>
              <FormField
                label="Descrição"
                name="descricao"
                type="textarea"
                value={formData.descricao}
                onChange={handleChange}
                error={errors.descricao}
                placeholder="Descreva brevemente a organização, missão e áreas de atuação..."
                rows={4}
                hint="Mínimo 10 caracteres (opcional)"
                width="full"
              />
            </FormRow>
          </FormSection>

          {/* Seção: Contato */}
          <FormSection title="📞 Informações de Contato">
            <FormRow>
              <FormField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="contato@organizacao.com.br"
                width="half"
              />

              <FormField
                label="Telefone"
                name="telefone"
                type="text"
                value={formData.telefone}
                onChange={handleChange}
                error={errors.telefone}
                placeholder="(11) 98765-4321"
                hint="Com DDD (opcional)"
                width="half"
              />
            </FormRow>

            <FormRow>
              <FormField
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                error={errors.website}
                placeholder="https://www.organizacao.com.br"
                hint="URL completa com http:// ou https://"
                width="full"
              />
            </FormRow>
          </FormSection>

          {/* Seção: Localização */}
          <FormSection title="📍 Localização">
            <FormRow>
              <FormField
                label="Endereço"
                name="endereco"
                type="textarea"
                value={formData.endereco}
                onChange={handleChange}
                error={errors.endereco}
                placeholder="Rua, número, complemento, bairro, cidade - UF, CEP"
                rows={3}
                hint="Endereço completo (opcional)"
                width="full"
              />
            </FormRow>
          </FormSection>

          {/* Botões de Ação */}
          <FormActions>
            {!isEditMode && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClear}
                disabled={saving}
              >
                🔄 Limpar Formulário
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving 
                ? (isEditMode ? 'Salvando...' : 'Criando...') 
                : (isEditMode ? '✓ Salvar Alterações' : '✓ Criar Organização')
              }
            </button>
          </FormActions>
        </form>
      </div>
    </div>
  );
}

export default AdminOrganizacoes;
