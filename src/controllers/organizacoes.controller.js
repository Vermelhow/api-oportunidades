import { db } from "../database/db.js";

export const list = (_req, res) => {
  console.log('Listando instituições...');
  db.all(`SELECT * FROM organizacoes ORDER BY nome ASC`, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar instituições:', err);
      return res.status(500).json({ 
        message: "Erro ao listar instituições", 
        error: String(err?.message || err) 
      });
    }
    console.log('Instituições encontradas:', rows);
    res.json(rows);
  });
};

export const get = (req, res) => {
  db.get(`SELECT * FROM organizacoes WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ 
        message: "Erro ao buscar instituição", 
        error: String(err?.message || err) 
      });
    }
    if (!row) return res.status(404).json({ message: "Instituição não encontrada" });
    res.json(row);
  });
};

export const create = (req, res) => {
  const { nome, descricao, website, email, telefone } = req.body;
  
  // Validações
  if (!nome?.trim()) {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }
  
  console.log('Criando organização:', { nome, descricao, website, email, telefone });
  
  db.run(
    `INSERT INTO organizacoes (nome, descricao, website, email, telefone) 
     VALUES (?, ?, ?, ?, ?)`,
    [nome.trim(), descricao?.trim(), website?.trim(), email?.trim(), telefone?.trim()],
    function(err) {
      if (err) {
        console.error('Erro ao criar organização:', err);
        if (String(err?.message || "").includes("UNIQUE")) {
          return res.status(409).json({ message: "Já existe uma instituição com este email" });
        }
        return res.status(500).json({ 
          message: "Erro ao criar instituição", 
          error: String(err?.message || err) 
        });
      }
      
      db.get(`SELECT * FROM organizacoes WHERE id = ?`, [this.lastID], (err, row) => {
        if (err) {
          return res.status(500).json({ 
            message: "Erro ao buscar instituição criada", 
            error: String(err?.message || err) 
          });
        }
        res.status(201).json(row);
      });
    }
  );
};

export const update = (req, res) => {
  const id = Number(req.params.id);
  const { nome, descricao, website, email, telefone } = req.body;
  
  // Validações
  if (!nome?.trim()) {
    return res.status(400).json({ message: "Nome é obrigatório" });
  }

  db.run(
    `UPDATE organizacoes 
     SET nome = ?, descricao = ?, website = ?, email = ?, telefone = ?,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [nome.trim(), descricao?.trim(), website?.trim(), email?.trim(), telefone?.trim(), id],
    function(err) {
      if (err) {
        if (String(err?.message || "").includes("UNIQUE")) {
          return res.status(409).json({ message: "Já existe outra instituição com este email" });
        }
        return res.status(500).json({ 
          message: "Erro ao atualizar instituição", 
          error: String(err?.message || err) 
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Instituição não encontrada" });
      }

      db.get(`SELECT * FROM organizacoes WHERE id = ?`, [id], (err, row) => {
        if (err) {
          return res.status(500).json({ 
            message: "Erro ao buscar instituição atualizada", 
            error: String(err?.message || err) 
          });
        }
        res.json(row);
      });
    }
  );
};

export const remove = (req, res) => {
  const id = Number(req.params.id);
  db.run(`DELETE FROM organizacoes WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(500).json({ 
        message: "Erro ao excluir instituição", 
        error: String(err?.message || err) 
      });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Instituição não encontrada" });
    }
    res.status(204).end();
  });
};