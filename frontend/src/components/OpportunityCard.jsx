import { useState } from 'react';
import '../styles/OpportunityCard.css';

export default function OpportunityCard({ oportunidade }) {
  const [expanded, setExpanded] = useState(false);

  const {
    titulo,
    descricao,
    localizacao,
    vagas_disponiveis,
    data_inicio,
    data_fim,
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

  return (
    <div className="opportunity-card">
      <div className="card-header">
        <h3 className="card-title">{titulo}</h3>
        {vagas_disponiveis && (
          <span className="card-badge">
            {vagas_disponiveis} {vagas_disponiveis === 1 ? 'vaga' : 'vagas'}
          </span>
        )}
      </div>

      <div className="card-info">
        {localizacao && (
          <div className="info-item">
            <span className="info-icon">📍</span>
            <span className="info-text">{localizacao}</span>
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
      </div>

      <div className="card-description">
        <p>{expanded ? descricao : descricaoResumida}</p>
      </div>

      <div className="card-actions">
        {descricao?.length > 150 && (
          <button 
            className="btn-link" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Ver menos' : 'Ler mais'}
          </button>
        )}
        <button className="btn btn-primary">
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
