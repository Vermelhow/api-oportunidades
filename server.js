import express from "express";
import categorias from "./src/routes/categorias.routes.js";
import { db } from "./src/database/db.js";
import { runMigrations } from "./src/database/migrations.js";

const app = express();
app.use(express.json());

// root endpoint
app.get("/", (_req, res) => {
  res.json({
    name: "API Oportunidades",
    status: "ok",
    endpoints: ["/health", "/categorias"],
  });
});

// health check endpoint
app.get("/health", (_req, res) => {
  try { db.prepare("SELECT 1").get(); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: String(e?.message||e) }); }
});

// suas rotas 
app.use("/categorias", categorias);

// 404 handler
app.use((_req, res) => res.status(404).json({ message: "Rota não encontrada" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  await runMigrations();
  console.log(`API rodando em http://localhost:${PORT}`);
});
