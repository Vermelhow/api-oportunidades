import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { createOportunidade, getCategorias, getOrganizacoes } from '../services/api';
import '../styles/AdminOportunidades.css';

export default function AdminOportunidades() {
  const navigate = useNavigate();

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

  // Carregar categorias e organizações
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        const [categoriasData, organizacoesData] = await Promise.all([
          getCategorias(),
          getOrganizacoes()
        ]);
        // Garantir que sempre sejam arrays
        setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
        setOrganizacoes(Array.isArray(organizacoesData) ? organizacoesData : []);
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente.');
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  // Atualizar campo do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro do campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulário
  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório';
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = 'Descrição é obrigatória';
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = 'Categoria é obrigatória';
    }

    if (!formData.organizacao_id) {
      newErrors.organizacao_id = 'Organização é obrigatória';
    }

    if (!formData.localizacao.trim()) {
      newErrors.localizacao = 'Localização é obrigatória';
    }

    if (!formData.data_inicio) {
      newErrors.data_inicio = 'Data de início é obrigatória';
    }

    if (!formData.data_fim) {
      newErrors.data_fim = 'Data de término é obrigatória';
    }

    // Validar datas
    if (formData.data_inicio && formData.data_fim) {
      const inicio = new Date(formData.data_inicio);
      const fim = new Date(formData.data_fim);
      if (fim <= inicio) {
        newErrors.data_fim = 'Data de término deve ser posterior à data de início';
      }
    }

    // Validar salários
    if (formData.salario_min && formData.salario_max) {
      const min = parseFloat(formData.salario_min);
      const max = parseFloat(formData.salario_max);
      if (max < min) {
        newErrors.salario_max = 'Salário máximo deve ser maior que o mínimo';
      }
    }

    // Validar vagas
    if (formData.vagas && parseInt(formData.vagas) < 1) {
      newErrors.vagas = 'Número de vagas deve ser maior que 0';
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
      setError('Por favor, corrija os erros no formulário.');
      return;
    }

    try {
      setLoading(true);

      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        categoria_id: parseInt(formData.categoria_id),
        organizacao_id: parseInt(formData.organizacao_id),
        salario_min: formData.salario_min ? parseFloat(formData.salario_min) : null,
        salario_max: formData.salario_max ? parseFloat(formData.salario_max) : null,
        vagas: formData.vagas ? parseInt(formData.vagas) : null,
      };

      await createOportunidade(dataToSend);
      
      setSuccess('Oportunidade criada com sucesso! Redirecionando...');
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/oportunidades');
      }, 2000);

    } catch (err) {
      setError('Erro ao criar oportunidade. Tente novamente.');
      console.error(err);
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
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Carregando dados...</p>
          </div>
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
              <h1 className="page-title">📋 Cadastrar Oportunidade</h1>
              <p className="page-subtitle">
                Preencha os campos abaixo para criar uma nova oportunidade
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => navigate('/oportunidades')}
              className="btn btn-outline"
            >
              ← Voltar
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
                    className="form-input"
                    placeholder="https://exemplo.com/inscricao"
                  />
                  <small className="form-hint">
                    Link externo onde os interessados podem se inscrever
                  </small>
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
                disabled={loading}
              >
                {loading ? '⏳ Criando...' : '✓ Criar Oportunidade'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
