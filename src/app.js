import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importa middlewares
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";
import { logger } from "./middlewares/logger.js";

// Importa rotas
import categorias from "./routes/categorias.routes.js";
import pessoas from "./routes/pessoas.routes.js";
import interesses from "./routes/interesses.routes.js";
import oportunidades from "./routes/oportunidades.routes.js";
import organizacoes from "./routes/organizacoes.routes.js";

// Cria a aplicação Express
const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use(logger);

// Configura rotas
app.use('/api/categorias', categorias);
app.use('/api/pessoas', pessoas);
app.use('/api/interesses', interesses);
app.use('/api/oportunidades', oportunidades);
app.use('/api/organizacoes', organizacoes);

// Rotas base
app.get("/", (_req, res) => {
  res.json({
    name: "API Oportunidades",
    version: "1.0.0",
    description: "API para gerenciamento de oportunidades profissionais e acadêmicas",
    endpoints: {
      "/": "Informações da API",
      "/health": "Verificação de saúde da API",
      "/api/categorias": "CRUD de categorias",
      "/api/organizacoes": "CRUD de organizações",
      "/api/oportunidades": "CRUD de oportunidades",
      "/api/pessoas": "CRUD de pessoas interessadas",
      "/api/interesses": "Gestão de interesses em oportunidades"
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Middleware de erro 404 (deve vir antes do errorHandler)
app.use(notFoundHandler);

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorHandler);

export default app;