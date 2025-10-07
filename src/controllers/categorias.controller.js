import { db } from "../database/db.js";

export const list = (_req, res) => {
  const rows = db.prepare(`SELECT id, nome FROM categorias ORDER BY nome ASC`).all();
  res.json(rows);
};

export const get = (req, res) => {
  const row = db.prepare(`SELECT id, nome FROM categorias WHERE id = ?`).get(req.params.id);
  if (!row) return res.status(404).json({ message: "Categoria não encontrada" });
  res.json(row);
};

export const create = (req, res) => {
  const nome = (req.body?.nome || "").trim();
  if (!nome) return res.status(400).json({ message: "nome é obrigatório" });
  try {
    const info = db.prepare(`INSERT INTO categorias (nome) VALUES (?)`).run(nome);
    const row = db.prepare(`SELECT id, nome FROM categorias WHERE id = ?`).get(info.lastInsertRowid);
    res.status(201).json(row);
  } catch (e) {
    if (String(e?.message || "").includes("UNIQUE")) {
      return res.status(409).json({ message: "Categoria já existe" });
    }
    res.status(500).json({ message: "Erro ao criar", error: String(e?.message || e) });
  }
};

export const update = (req, res) => {
  const id = Number(req.params.id);
  const nome = req.body?.nome?.trim();
  if (nome === undefined) return res.status(400).json({ message: "nome é obrigatório" });

  try {
    const r = db.prepare(`UPDATE categorias SET nome = ? WHERE id = ?`).run(nome, id);
    if (r.changes === 0) return res.status(404).json({ message: "Categoria não encontrada" });
    const row = db.prepare(`SELECT id, nome FROM categorias WHERE id = ?`).get(id);
    res.json(row);
  } catch (e) {
    if (String(e?.message || "").includes("UNIQUE")) {
      return res.status(409).json({ message: "Já existe outra categoria com esse nome" });
    }
    res.status(500).json({ message: "Erro ao atualizar", error: String(e?.message || e) });
  }
};

export const remove = (req, res) => {
  const id = Number(req.params.id);
  const r = db.prepare(`DELETE FROM categorias WHERE id = ?`).run(id);
  if (r.changes === 0) return res.status(404).json({ message: "Categoria não encontrada" });
  res.status(204).end();
};
