import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OpportunityCard.css';

export default function OpportunityCard({ oportunidade }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const {
    titulo,
    descricao,
    localizacao,
    vagas_disponiveis,
    data_inicio,
    data_fim,
    tipo,
    status,
    formato,
    categoria_nome,
    organizacao_nome,
    link_inscricao,
    id
  } = oportunidade;

  // Limita a descrição para exibição
  const descricaoResumida = descricao?.length > 150 
    ? descricao.substring(0, 150) + '...' 
    : descricao;

  // Formata datas se disponíveis
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  // Mapeia ícones para tipos
  const tipoIcons = {
    emprego: '💼',
    estagio: '🎓',
    curso: '📚',
    evento: '🎉',
    projeto: '🚀',
    voluntariado: '❤️'
  };

  // Mapeia ícones para formatos
  const formatoIcons = {
    presencial: '🏢',
    remoto: '💻',
    hibrido: '🔄'
  };

  // Mapeia classes CSS para status
  const statusClasses = {
    ativa: 'status-active',
    encerrada: 'status-closed',
    pausada: 'status-paused'
  };

  // Mapeia textos para status
  const statusTexts = {
    ativa: 'Ativa',
    encerrada: 'Encerrada',
    pausada: 'Pausada'
  };

  return (
    <div className="opportunity-card">
      {/* Badges de Status e Tipo */}
      <div className="card-badges">
        {status && (
          <span className={`badge badge-status ${statusClasses[status] || ''}`}>
            {statusTexts[status] || status}
          </span>
        )}
        {tipo && (
          <span className="badge badge-type">
            {tipoIcons[tipo] || '📌'} {tipo}
          </span>
        )}
      </div>

      {/* Header */}
      <div className="card-header">
        <h3 className="card-title">{titulo}</h3>
        {categoria_nome && (
          <span className="card-category">
            🏷️ {categoria_nome}
          </span>
        )}
      </div>

      {/* Organização */}
      {organizacao_nome && (
        <div className="card-organization">
          <span className="org-icon">🏢</span>
          <span className="org-name">{organizacao_nome}</span>
        </div>
      )}

      {/* Info Grid */}
      <div className="card-info-grid">
        {localizacao && (
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-text">{localizacao}</span>
          </div>
        )}
        
        {formato && (
          <div className="info-item">
            <span className="info-icon">{formatoIcons[formato] || '📋'}</span>
            <span className="info-text">{formato}</span>
          </div>
        )}

        {(data_inicio || data_fim) && (
          <div className="info-item">
            <span className="info-icon">📅</span>
            <span className="info-text">
              {data_inicio && formatDate(data_inicio)}
              {data_inicio && data_fim && ' - '}
              {data_fim && formatDate(data_fim)}
            </span>
          </div>
        )}

        {vagas_disponiveis && (
          <div className="info-item">
            <span className="info-icon">👥</span>
            <span className="info-text">
              {vagas_disponiveis} {vagas_disponiveis === 1 ? 'vaga' : 'vagas'}
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="card-description">
        <p>{expanded ? descricao : descricaoResumida}</p>
        {descricao?.length > 150 && (
          <button 
            className="btn-expand" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ver menos ▲' : 'Ler mais ▼'}
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="card-actions">
        <button 
          className="btn btn-outline"
          onClick={() => navigate(`/oportunidades/${id}`)}
        >
          Ver detalhes
        </button>
        <button 
          className="btn btn-primary"
          onClick={() => navigate(`/oportunidades/${id}`)}
        >
          {link_inscricao ? 'Candidatar-se' : 'Demonstrar Interesse'}
        </button>
      </div>
    </div>
  );
}
