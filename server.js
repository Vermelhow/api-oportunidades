import express from "express";
import categorias from "./src/routes/categorias.routes.js";
import organizacoes from "./src/routes/organizacoes.routes.js";
import { db, ensureCategoriasTable, ensureOrganizacoesTable } from "./src/database/db.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  db.get("SELECT 1", [], (err) => {
    if (err) {
      res.status(500).json({ ok: false, error: String(err?.message || err) });
    } else {
      res.json({ ok: true });
    }
  });
});

app.use("/api/categorias", categorias);
app.use("/api/organizacoes", organizacoes);

app.use((_req, res) => res.status(404).json({ message: "Rota não encontrada" }));

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
