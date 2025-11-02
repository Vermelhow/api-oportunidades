import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa rotas
import categorias from "./routes/categorias.routes.js";

// Cria a aplicação Express
const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de log básico
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Rotas base
app.get("/", (_req, res) => {
  res.json({
    name: "API Oportunidades",
    version: "1.0.0",
    description: "API para gerenciamento de oportunidades profissionais e acadêmicas",
    endpoints: {
      "/": "Informações da API",
      "/health": "Verificação de saúde da API",
      "/categorias": "CRUD de categorias",
      "/organizacoes": "CRUD de organizações (em breve)",
      "/oportunidades": "CRUD de oportunidades (em breve)",
      "/pessoas": "CRUD de pessoas interessadas (em breve)",
      "/interesses": "Gestão de interesses em oportunidades (em breve)"
    }
  });
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Rotas da API
app.use("/categorias", categorias);

// Middleware de erro 404
app.use((_req, res) => {
  res.status(404).json({ 
    error: "Não encontrado",
    message: "A rota solicitada não existe nesta API" 
  });
});

// Middleware de tratamento de erros
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: "Erro interno",
    message: err.message || "Ocorreu um erro inesperado no servidor"
  });
});

export default app;