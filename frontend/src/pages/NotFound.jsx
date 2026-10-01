import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import '../styles/NotFound.css';

export default function NotFound() {
  return (
    <Layout>
      <div className="not-found-container">
        <div className="not-found-icon" aria-hidden="true">🔍</div>
        <h1 className="not-found-title">404</h1>
        <p className="not-found-message">
          A página que você está procurando não existe ou foi removida.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <span aria-hidden="true">🏠</span> Voltar para o Início
          </Link>
          <Link to="/oportunidades" className="btn btn-outline">
            <span aria-hidden="true">🔍</span> Ver Oportunidades
          </Link>
        </div>
      </div>
    </Layout>
  );
}
