import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// usa o arquivo na pasta data
const dbPath = path.resolve(__dirname, "../../data/oportunidades.db");
const dbDir = path.dirname(dbPath);

// cria o diretório se não existir
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// abre/cria o banco
const db = new Database(dbPath, { verbose: console.log });

// Habilita as foreign keys
db.pragma('foreign_keys = ON');

console.log('Conectado ao banco de dados SQLite.');

// Funções auxiliares
function getAll(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.all(...params);
}

function getOne(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.get(...params);
}

function runQuery(sql, params = []) {
    const stmt = db.prepare(sql);
    return stmt.run(...params);
}

export { db, getAll, getOne, runQuery };
