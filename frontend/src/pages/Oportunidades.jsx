import { useEffect, useState } from "react";
import { getOportunidades } from "../services/api";
import Layout from '../components/Layout';
import OpportunityCard from '../components/OpportunityCard';
import '../styles/Oportunidades.css';

export default function Oportunidades() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getOportunidades()
      .then((response) => {
        setDados(response.data || response);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <Layout>
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Carregando oportunidades...</h2>
      </div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div className="error-container">
        <h2>❌ Erro ao carregar oportunidades</h2>
        <p>{error}</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="oportunidades-page">
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">Oportunidades de Voluntariado</h1>
            <p className="page-subtitle">
              Encontre a causa perfeita para você e faça a diferença na sua comunidade
            </p>
          </div>
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-number">{dados.length}</span>
              <span className="stat-label">Oportunidades disponíveis</span>
            </div>
          </div>
        </div>

        {dados.length === 0 ? (
          <div className="empty-state">
            <h2>📋 Nenhuma oportunidade disponível</h2>
            <p>No momento não há oportunidades cadastradas. Volte em breve!</p>
          </div>
        ) : (
          <div className="opportunities-grid">
            {dados.map((oportunidade) => (
              <OpportunityCard 
                key={oportunidade.id} 
                oportunidade={oportunidade} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
