import { useEffect, useState } from "react";
import { getOportunidades } from "../services/api";

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

  if (loading) return <div style={{ padding: '20px' }}><h1>Carregando...</h1></div>;
  if (error) return <div style={{ padding: '20px' }}><h1>Erro: {error}</h1></div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Oportunidades</h1>
      <p>Total de oportunidades: {dados.length}</p>
      <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
        {dados.map((item) => (
          <div 
            key={item.id} 
            style={{ 
              border: '1px solid #ddd', 
              padding: '15px', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>{item.titulo}</h3>
            <p>{item.descricao}</p>
            <small>Local: {item.localizacao} | Vagas: {item.vagas_disponiveis}</small>
          </div>
        ))}
      </div>
    </div>
  );
}
