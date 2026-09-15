import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ErrorBoundary } from "./components";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Oportunidades from "./pages/Oportunidades";
import OportunidadeDetalhe from "./pages/OportunidadeDetalhe";
import Dashboard from "./pages/Dashboard";
import AdminOportunidades from "./pages/AdminOportunidades";
import AdminOportunidadesLista from "./pages/AdminOportunidadesLista";
import AdminOrganizacoes from "./pages/AdminOrganizacoes";
import AdminOrganizacoesLista from "./pages/AdminOrganizacoesLista";
import OrganizacaoDetalhe from "./pages/OrganizacaoDetalhe";
import AdminCategorias from "./pages/AdminCategorias";
import AdminPessoas from "./pages/AdminPessoas";
import Perfil from "./pages/Perfil";
import MeusInteresses from "./pages/MeusInteresses";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/oportunidades" element={<Oportunidades />} />
              <Route 
                path="/perfil" 
                element={
                  <PrivateRoute>
                    <Perfil />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/meus-interesses" 
                element={
                  <PrivateRoute>
                    <MeusInteresses />
                  </PrivateRoute>
                } 
              />
              <Route path="/oportunidades/:id" element={<OportunidadeDetalhe />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/oportunidades" 
                element={
                  <PrivateRoute>
                    <AdminOportunidadesLista />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/oportunidades/nova" 
                element={
                  <PrivateRoute>
                    <AdminOportunidades />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/oportunidades/:id/editar" 
                element={
                  <PrivateRoute>
                    <AdminOportunidades />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/organizacoes" 
                element={
                  <PrivateRoute>
                    <AdminOrganizacoesLista />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/organizacoes/nova" 
                element={
                  <PrivateRoute>
                    <AdminOrganizacoes />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/organizacoes/:id/editar" 
                element={
                  <PrivateRoute>
                    <AdminOrganizacoes />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/organizacoes/:id/detalhes" 
                element={
                  <PrivateRoute>
                    <OrganizacaoDetalhe />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/categorias" 
                element={
                  <PrivateRoute>
                    <AdminCategorias />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/admin/pessoas" 
                element={
                  <PrivateRoute>
                    <AdminPessoas />
                  </PrivateRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;
