// scripts/seed.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do banco 
const dbPath = path.resolve(__dirname, "..", "oportunidades.db");
const db = new sqlite3.Database(dbPath);

const sql = `
PRAGMA foreign_keys = ON;

-- 1) Garante a tabela de categorias
CREATE TABLE IF NOT EXISTS categoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativa INTEGER NOT NULL DEFAULT 1
);

-- 2) Índice útil para buscas por nome
CREATE INDEX IF NOT EXISTS idx_categoria_nome ON categoria (nome);

-- 3) Seeds (não duplica)
INSERT OR IGNORE INTO categoria (id, nome, descricao, ativa) VALUES
  (1,'Curso','Cursos gratuitos e de curta duração',1),
  (2,'Emprego','Vagas de emprego e estágios',1),
  (3,'Mutirão','Ações sociais e serviços comunitários',1);
`;

db.exec(sql, (err) => {
  if (err) {
    console.error("Erro ao aplicar seeds:", err.message);
  } else {
    console.log("Seeds de categorias aplicados com sucesso.");
  }
  db.close();
});
