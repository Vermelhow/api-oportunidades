import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// usa o arquivo na pasta data do projeto
const projectRoot = path.resolve(__dirname, '..', '..');
const dbPath = path.join(projectRoot, 'data', 'oportunidades.db');

// habilita verbose mode para debug
sqlite3.verbose();

// abre/cria o banco
export const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco:', err);
  } else {
    console.log('Conectado ao banco SQLite em:', dbPath);
  }
});

// cria tabela se não existir
export function ensureCategoriasTable(callback) {
  db.run(`
    CREATE TABLE IF NOT EXISTS categorias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL UNIQUE
    )`, (err) => {
    if (err) {
      console.error('Erro ao criar tabela categorias:', err);
      if (callback) callback(err);
    } else {
      console.log('Tabela categorias verificada/criada com sucesso');
      if (callback) callback(null);
    }
  });
}
