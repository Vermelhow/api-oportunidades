import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Oportunidades from "./pages/Oportunidades";
import OportunidadeDetalhe from "./pages/OportunidadeDetalhe";
import Dashboard from "./pages/Dashboard";
import AdminOportunidades from "./pages/AdminOportunidades";
import AdminOportunidadesLista from "./pages/AdminOportunidadesLista";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oportunidades" element={<Oportunidades />} />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
