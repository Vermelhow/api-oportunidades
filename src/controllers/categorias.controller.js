import { db } from "../database/db.js";

export const list = (_req, res) => {
  console.log('Listando categorias...');
  db.all(`SELECT id, nome FROM categorias ORDER BY nome ASC`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar categorias:', err);
      return res.status(500).json({ message: "Erro ao listar categorias", error: String(err?.message || err) });
    }
    console.log('Categorias encontradas:', rows);
    res.json(rows);
  });
};

export const get = (req, res) => {
  db.get(`SELECT id, nome FROM categorias WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Erro ao buscar categoria", error: String(err?.message || err) });
    }
    if (!row) return res.status(404).json({ message: "Categoria não encontrada" });
    res.json(row);
  });
};

export const create = (req, res) => {
  const nome = (req.body?.nome || "").trim();
  if (!nome) return res.status(400).json({ message: "nome é obrigatório" });
  
  db.run(`INSERT INTO categorias (nome) VALUES (?)`, [nome], function(err) {
    if (err) {
      if (String(err?.message || "").includes("UNIQUE")) {
        return res.status(409).json({ message: "Categoria já existe" });
      }
      return res.status(500).json({ message: "Erro ao criar", error: String(err?.message || err) });
    }
    
    db.get(`SELECT id, nome FROM categorias WHERE id = ?`, [this.lastID], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao buscar categoria criada", error: String(err?.message || err) });
      }
      res.status(201).json(row);
    });
  });
};

export const update = (req, res) => {
  const id = Number(req.params.id);
  const nome = req.body?.nome?.trim();
  if (nome === undefined) return res.status(400).json({ message: "nome é obrigatório" });

  db.run(`UPDATE categorias SET nome = ? WHERE id = ?`, [nome, id], function(err) {
    if (err) {
      if (String(err?.message || "").includes("UNIQUE")) {
        return res.status(409).json({ message: "Já existe outra categoria com esse nome" });
      }
      return res.status(500).json({ message: "Erro ao atualizar", error: String(err?.message || err) });
    }

    if (this.changes === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }

    db.get(`SELECT id, nome FROM categorias WHERE id = ?`, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao buscar categoria atualizada", error: String(err?.message || err) });
      }
      res.json(row);
    });
  });
};

export const remove = (req, res) => {
  const id = Number(req.params.id);
  db.run(`DELETE FROM categorias WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ message: "Erro ao excluir categoria", error: String(err?.message || err) });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.status(204).end();
  });
};
