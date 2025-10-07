import express from "express";
import categorias from "./src/routes/categorias.routes.js";
import { db, ensureCategoriasTable } from "./src/database/db.js";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  try { db.prepare("SELECT 1").get(); res.json({ ok: true }); }
  catch (e) { res.status(500).json({ ok: false, error: String(e?.message||e) }); }
});

app.use("/categorias", categorias); // << base da rota

app.use((_req, res) => res.status(404).json({ message: "Rota não encontrada" }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  ensureCategoriasTable();
  console.log(`API rodando em http://localhost:${PORT}`);
});
