import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidebar, Loading } from '../components';
import { createOportunidade, updateOportunidade, getOportunidadeById, getCategorias, getOrganizacoes } from '../services/api';
import { useNotification } from '../context/NotificationContext';
import '../styles/AdminOportunidades.css';

export default function AdminOportunidades() {
  const navigate = useNavigate();
  const { id } = useParams(); // Captura ID da URL se estiver editando
  const isEditMode = Boolean(id); // Define se está em modo de edição
  const { showSuccess, showError } = useNotification();

  // Estados para listas
  const [categorias, setCategorias] = useState([]);
  const [organizacoes, setOrganizacoes] = useState([]);
  
  // Estados do formulário
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    requisitos: '',
    beneficios: '',
    categoria_id: '',
    organizacao_id: '',
    localizacao: '',
    tipo: 'emprego',
    formato: 'presencial',
    salario_min: '',
    salario_max: '',
    vagas: '',
    data_inicio: '',
    data_fim: '',
    link_inscricao: '',
    status: 'ativa',
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  // Carregar categorias, organizações e oportunidade (se editando)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        setError('');
        
        // Carregar categorias e organizações
        const [categoriasResponse, organizacoesResponse] = await Promise.all([
          getCategorias(),
          getOrganizacoes()
        ]);
        
        const categoriasData = categoriasResponse?.data || [];
        const organizacoesData = organizacoesResponse?.data || [];
        
        setCategorias(categoriasData);
        setOrganizacoes(organizacoesData);
        
        // Validar se há dados disponíveis
        if (categoriasData.length === 0) {
          setError('⚠️ Nenhuma categoria cadastrada. Cadastre categorias antes de criar oportunidades.');
        }
        if (organizacoesData.length === 0) {
          setError('⚠️ Nenhuma organização cadastrada. Cadastre organizações antes de criar oportunidades.');
        }
        
        // Se estiver em modo de edição, carregar dados da oportunidade
        if (isEditMode) {
          const oportunidadeResponse = await getOportunidadeById(id);
          const oportunidade = oportunidadeResponse?.data;
          
          if (!oportunidade) {
            throw new Error('Oportunidade não encontrada.');
          }
          
          // Preencher formulário com dados existentes
          setFormData({
            titulo: oportunidade.titulo || '',
            descricao: oportunidade.descricao || '',
            requisitos: oportunidade.requisitos || '',
            beneficios: oportunidade.beneficios || '',
            categoria_id: oportunidade.categoria_id || '',
            organizacao_id: oportunidade.organizacao_id || '',
            localizacao: oportunidade.localizacao || '',
            tipo: oportunidade.tipo || 'emprego',
            formato: oportunidade.formato || 'presencial',
            salario_min: oportunidade.salario_min || '',
            salario_max: oportunidade.salario_max || '',
            vagas: '',
            data_inicio: oportunidade.data_inicio ? oportunidade.data_inicio.split('T')[0] : '',
            data_fim: oportunidade.data_fim ? oportunidade.data_fim.split('T')[0] : '',
            link_inscricao: oportunidade.link_inscricao || '',
            status: oportunidade.status || 'ativa',
          });
        }
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        const errorMsg = err.message || (isEditMode 
          ? 'Erro ao carregar dados da oportunidade. Tente novamente.' 
          : 'Erro ao carregar dados necessários. Verifique sua conexão.');
        setError(errorMsg);
        showError(errorMsg);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [id, isEditMode, showError]);

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo e mensagem geral
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) {
      setError('');
    }
  };

  // Verificar se os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    return (
      formData.titulo.trim() !== '' &&
      formData.descricao.trim() !== '' &&
      formData.categoria_id !== '' &&
      formData.organizacao_id !== '' &&
      formData.localizacao.trim() !== '' &&
      formData.data_inicio !== '' &&
      formData.data_fim !== '' &&
      categorias.length > 0 &&
      organizacoes.length > 0 &&
      !loading
    );
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    // Título
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    } else if (formData.titulo.trim().length < 5) {
      newErrors.titulo = 'Título deve ter no mínimo 5 caracteres';
    } else if (formData.titulo.trim().length > 200) {
      newErrors.titulo = 'Título deve ter no máximo 200 caracteres';
    }

    // Descrição
    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    } else if (formData.descricao.trim().length < 20) {
      newErrors.descricao = 'Descrição deve ter no mínimo 20 caracteres';
    } else if (formData.descricao.trim().length > 5000) {
      newErrors.descricao = 'Descrição deve ter no máximo 5000 caracteres';
    }

    // Categoria
    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória';
    }

    // Organização
    if (!formData.organizacao_id) {
      newErrors.organizacao_id = 'Organização é obrigatória';
    }

    // Localização
    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    } else if (formData.localizacao.trim().length < 3) {
      newErrors.localizacao = 'Localização deve ter no mínimo 3 caracteres';
    }

    // Datas
    if (!formData.data_inicio) {
      newErrors.data_inicio = 'Data de início é obrigatória';
    }

    if (!formData.data_fim) {
      newErrors.data_fim = 'Data de término é obrigatória';
    }

    // Validar intervalo de datas
    if (formData.data_inicio && formData.data_fim) {
      const inicio = new Date(formData.data_inicio);
      const fim = new Date(formData.data_fim);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      if (fim <= inicio) {
        newErrors.data_fim = 'Data de término deve ser posterior à data de início';
      }
      
      // Avisar se a data de início já passou (apenas para novas oportunidades)
      if (!isEditMode && inicio < hoje) {
        newErrors.data_inicio = 'Data de início já passou. Use uma data futura.';
      }
    }

    // Validar salários
    if (formData.salario_min && formData.salario_max) {
      const min = parseFloat(formData.salario_min);
      const max = parseFloat(formData.salario_max);
      
      if (isNaN(min) || min < 0) {
        newErrors.salario_min = 'Salário mínimo inválido';
      }
      
      if (isNaN(max) || max < 0) {
        newErrors.salario_max = 'Salário máximo inválido';
      }
      
      if (!isNaN(min) && !isNaN(max) && max < min) {
        newErrors.salario_max = 'Salário máximo deve ser maior ou igual ao mínimo';
      }
    }

    // Validar vagas
    if (formData.vagas) {
      const vagas = parseInt(formData.vagas);
      if (isNaN(vagas) || vagas < 1) {
        newErrors.vagas = 'Número de vagas deve ser maior que 0';
      } else if (vagas > 1000) {
        newErrors.vagas = 'Número de vagas parece muito alto. Verifique o valor.';
      }
    }

    // Validar URL
    if (formData.link_inscricao && formData.link_inscricao.trim()) {
      try {
        const url = new URL(formData.link_inscricao);
        // Verificar se o protocolo é http ou https
        if (!['http:', 'https:'].includes(url.protocol)) {
          newErrors.link_inscricao = 'URL deve começar com http:// ou https://';
        }
      } catch {
        newErrors.link_inscricao = 'URL inválida. Use o formato: https://exemplo.com';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');

    if (!validateForm()) {
      const errorMsg = 'Por favor, corrija os erros no formulário antes de continuar.';
      setError(errorMsg);
      showError(errorMsg);
      
      // Scroll até o primeiro campo com erro
      setTimeout(() => {
        const firstErrorField = Object.keys(errors)[0];
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }, 100);
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para envio (removendo campo vagas que não existe no banco)
      const { vagas, ...restFormData } = formData;
      
      const dataToSend = {
        ...restFormData,
        categoria_id: parseInt(formData.categoria_id),
        organizacao_id: parseInt(formData.organizacao_id),
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null,
      };

      // Criar ou atualizar baseado no modo
      let response;
      if (isEditMode) {
        response = await updateOportunidade(id, dataToSend);
        showSuccess('✓ Oportunidade atualizada com sucesso!');
      } else {
        response = await createOportunidade(dataToSend);
        showSuccess('✓ Oportunidade criada com sucesso!');
      }
      
      // Redirecionar imediatamente para a listagem
      setTimeout(() => {
        navigate('/admin/oportunidades/lista', { 
          replace: true,
          state: { refresh: true } // Sinaliza que deve recarregar a lista
        });
      }, 800);

    } catch (err) {
      console.error(isEditMode ? 'Erro ao atualizar oportunidade:' : 'Erro ao criar oportunidade:', err);
      
      // Tratamento melhorado de erros da API
      let errorMsg = '';
      
      // Verificar se há erros de validação específicos da API
      if (err.data?.errors && Array.isArray(err.data.errors)) {
        const apiErrors = {};
        err.data.errors.forEach(error => {
          if (error.field) {
            apiErrors[error.field] = error.message;
          }
        });
        
        if (Object.keys(apiErrors).length > 0) {
          setErrors(apiErrors);
          errorMsg = 'Corrija os erros indicados nos campos destacados.';
          
          // Scroll suave até o primeiro campo com erro
          setTimeout(() => {
            const firstErrorField = Object.keys(apiErrors)[0];
            const element = document.getElementById(firstErrorField);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              element.focus();
            }
          }, 100);
        }
      }
      
      // Se não há erros de campo específicos, usar mensagem geral
      if (!errorMsg) {
        // Usar mensagem personalizada do erro da API se disponível
        if (err.message) {
          errorMsg = err.message;
        } else {
          errorMsg = isEditMode 
            ? 'Não foi possível atualizar a oportunidade. Verifique os dados e tente novamente.' 
            : 'Não foi possível criar a oportunidade. Verifique os dados e tente novamente.';
        }
      }
      
      setError(errorMsg);
      showError(errorMsg);
      
      // Scroll para o topo para visualizar a mensagem de erro
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // Limpar formulário
  const handleReset = () => {
    setFormData({
      titulo: '',
      descricao: '',
      requisitos: '',
      beneficios: '',
      categoria_id: '',
      organizacao_id: '',
      localizacao: '',
      tipo: 'emprego',
      formato: 'presencial',
      salario_min: '',
      salario_max: '',
      vagas: '',
      data_inicio: '',
      data_fim: '',
      link_inscricao: '',
      status: 'ativa',
    });
    setErrors({});
    setError('');
    setSuccess('');
  };

  if (loadingData) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <Loading 
            fullscreen={false}
            text={isEditMode ? 'Carregando oportunidade...' : 'Carregando dados...'}
            size="lg"
          />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      
      <main className="dashboard-content">
        <div className="admin-page">
          {/* Header */}
          <div className="page-header">
            <div>
              <h1 className="page-title">{isEditMode ? '✏️ Editar Oportunidade' : '📋 Cadastrar Oportunidade'}</h1>
              <p className="page-subtitle">
                {isEditMode ? 'Atualize as informações da oportunidade' : 'Preencha os campos abaixo para criar uma nova oportunidade'}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => navigate('/admin/oportunidades/lista')}
              className="btn btn-outline"
            >
              ← Voltar para Lista
            </button>
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span className="alert-icon">✓</span>
              <span>{success}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="form-card">
            {/* Informações Básicas */}
            <div className="form-section">
              <h2 className="form-section-title">📝 Informações Básicas</h2>
              
              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="titulo" className="form-label required">
                    Título da Oportunidade
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className={`form-input ${errors.titulo ? 'error' : ''}`}
                    placeholder="Ex: Voluntário para projeto social"
                  />
                  {!errors.titulo && <span className="field-hint">Mínimo de 5 caracteres</span>}
                  {errors.titulo && <span className="error-message">{errors.titulo}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="categoria_id" className="form-label required">
                    Categoria
                  </label>
                  <select
                    id="categoria_id"
                    name="categoria_id"
                    value={formData.categoria_id}
                    onChange={handleChange}
                    className={`form-select ${errors.categoria_id ? 'error' : ''}`}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nome}
                      </option>
                    ))}
                  </select>
                  {errors.categoria_id && <span className="error-message">{errors.categoria_id}</span>}
                </div>

                <div className="form-group half">
                  <label htmlFor="organizacao_id" className="form-label required">
                    Organização
                  </label>
                  <select
                    id="organizacao_id"
                    name="organizacao_id"
                    value={formData.organizacao_id}
                    onChange={handleChange}
                    className={`form-select ${errors.organizacao_id ? 'error' : ''}`}
                  >
                    <option value="">Selecione uma organização</option>
                    {organizacoes.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.nome}
                      </option>
                    ))}
                  </select>
                  {errors.organizacao_id && <span className="error-message">{errors.organizacao_id}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="descricao" className="form-label required">
                    Descrição
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    className={`form-textarea ${errors.descricao ? 'error' : ''}`}
                    rows="5"
                    placeholder="Descreva os detalhes da oportunidade..."
                  ></textarea>
                  {!errors.descricao && <span className="field-hint">Mínimo de 20 caracteres</span>}
                  {errors.descricao && <span className="error-message">{errors.descricao}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="requisitos" className="form-label">
                    Requisitos
                  </label>
                  <textarea
                    id="requisitos"
                    name="requisitos"
                    value={formData.requisitos}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Liste os requisitos necessários..."
                  ></textarea>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="beneficios" className="form-label">
                    Benefícios
                  </label>
                  <textarea
                    id="beneficios"
                    name="beneficios"
                    value={formData.beneficios}
                    onChange={handleChange}
                    className="form-textarea"
                    rows="3"
                    placeholder="Descreva os benefícios oferecidos..."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Detalhes */}
            <div className="form-section">
              <h2 className="form-section-title">📍 Detalhes</h2>
              
              <div className="form-row">
                <div className="form-group third">
                  <label htmlFor="tipo" className="form-label required">
                    Tipo
                  </label>
                  <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="emprego">💼 Emprego</option>
                    <option value="estagio">🎓 Estágio</option>
                    <option value="curso">📚 Curso</option>
                    <option value="evento">🎉 Evento</option>
                    <option value="projeto">🚀 Projeto</option>
                    <option value="voluntariado">❤️ Voluntariado</option>
                  </select>
                </div>

                <div className="form-group third">
                  <label htmlFor="formato" className="form-label required">
                    Formato
                  </label>
                  <select
                    id="formato"
                    name="formato"
                    value={formData.formato}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="presencial">🏢 Presencial</option>
                    <option value="remoto">💻 Remoto</option>
                    <option value="hibrido">🔄 Híbrido</option>
                  </select>
                </div>

                <div className="form-group third">
                  <label htmlFor="status" className="form-label required">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="ativa">✓ Ativa</option>
                    <option value="pausada">⏸ Pausada</option>
                    <option value="encerrada">✗ Encerrada</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="localizacao" className="form-label required">
                    Localização
                  </label>
                  <input
                    type="text"
                    id="localizacao"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    className={`form-input ${errors.localizacao ? 'error' : ''}`}
                    placeholder="Ex: São Paulo, SP"
                  />
                  {errors.localizacao && <span className="error-message">{errors.localizacao}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group third">
                  <label htmlFor="vagas" className="form-label">
                    Vagas Disponíveis
                  </label>
                  <input
                    type="number"
                    id="vagas"
                    name="vagas"
                    value={formData.vagas}
                    onChange={handleChange}
                    className={`form-input ${errors.vagas ? 'error' : ''}`}
                    min="1"
                    placeholder="Ex: 5"
                  />
                  {errors.vagas && <span className="error-message">{errors.vagas}</span>}
                </div>

                <div className="form-group third">
                  <label htmlFor="data_inicio" className="form-label required">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    id="data_inicio"
                    name="data_inicio"
                    value={formData.data_inicio}
                    onChange={handleChange}
                    className={`form-input ${errors.data_inicio ? 'error' : ''}`}
                  />
                  {errors.data_inicio && <span className="error-message">{errors.data_inicio}</span>}
                </div>

                <div className="form-group third">
                  <label htmlFor="data_fim" className="form-label required">
                    Data de Término
                  </label>
                  <input
                    type="date"
                    id="data_fim"
                    name="data_fim"
                    value={formData.data_fim}
                    onChange={handleChange}
                    className={`form-input ${errors.data_fim ? 'error' : ''}`}
                  />
                  {errors.data_fim && <span className="error-message">{errors.data_fim}</span>}
                </div>
              </div>
            </div>

            {/* Remuneração */}
            <div className="form-section">
              <h2 className="form-section-title">💰 Remuneração</h2>
              
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="salario_min" className="form-label">
                    Salário Mínimo (R$)
                  </label>
                  <input
                    type="number"
                    id="salario_min"
                    name="salario_min"
                    value={formData.salario_min}
                    onChange={handleChange}
                    className={`form-input ${errors.salario_min ? 'error' : ''}`}
                    min="0"
                    step="0.01"
                    placeholder="Ex: 2000.00"
                  />
                  {!errors.salario_min && <span className="field-hint">Valor opcional em reais (R$)</span>}
                  {errors.salario_min && <span className="error-message">{errors.salario_min}</span>}
                </div>

                <div className="form-group half">
                  <label htmlFor="salario_max" className="form-label">
                    Salário Máximo (R$)
                  </label>
                  <input
                    type="number"
                    id="salario_max"
                    name="salario_max"
                    value={formData.salario_max}
                    onChange={handleChange}
                    className={`form-input ${errors.salario_max ? 'error' : ''}`}
                    min="0"
                    step="0.01"
                    placeholder="Ex: 5000.00"
                  />
                  {!errors.salario_max && <span className="field-hint">Valor opcional em reais (R$)</span>}
                  {errors.salario_max && <span className="error-message">{errors.salario_max}</span>}
                </div>
              </div>
            </div>

            {/* Link de Inscrição */}
            <div className="form-section">
              <h2 className="form-section-title">🔗 Link de Inscrição</h2>
              
              <div className="form-row">
                <div className="form-group full">
                  <label htmlFor="link_inscricao" className="form-label">
                    URL para Inscrição
                  </label>
                  <input
                    type="url"
                    id="link_inscricao"
                    name="link_inscricao"
                    value={formData.link_inscricao}
                    onChange={handleChange}
                    className={`form-input ${errors.link_inscricao ? 'error' : ''}`}
                    placeholder="https://exemplo.com/inscricao"
                  />
                  {!errors.link_inscricao && (
                    <small className="form-hint">
                      Link externo onde os interessados podem se inscrever
                    </small>
                  )}
                  {errors.link_inscricao && <span className="error-message">{errors.link_inscricao}</span>}
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-secondary"
                disabled={loading}
              >
                🔄 Limpar Formulário
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || !isFormValid()}
                title={!isFormValid() && !loading ? 'Preencha todos os campos obrigatórios' : ''}
              >
                {loading 
                  ? (isEditMode ? '⏳ Atualizando...' : '⏳ Criando...') 
                  : (isEditMode ? '✓ Salvar Alterações' : '✓ Criar Oportunidade')
                }
              </button>
            </div>
            
            {!isFormValid() && !loading && !loadingData && (
              <div className="form-validation-hint">
                💡 Preencha todos os campos obrigatórios (marcados com *) para {isEditMode ? 'salvar' : 'criar'} a oportunidade
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
