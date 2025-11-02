import express from "express";
import categorias from "./src/routes/categorias.routes.js";
import { db, ensureCategoriasTable } from "./src/database/db.js";

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

app.use("/categorias", categorias); // << base da rota

app.use((_req, res) => res.status(404).json({ message: "Rota não encontrada" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  ensureCategoriasTable((err) => {
    if (err) {
      console.error('Erro ao inicializar banco:', err);
      process.exit(1);
    }
    console.log(`API rodando em http://localhost:${PORT}`);
  });
});
