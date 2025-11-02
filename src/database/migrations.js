import { db } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cria a tabela de controle de migrations se não existir
function initMigrationsTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

// Executa todas as migrations pendentes
export async function runMigrations() {
  console.log("Verificando migrations...");
  initMigrationsTable();

  const migrationsDir = path.join(__dirname, "migrations");
  const executedMigrations = db.prepare("SELECT name FROM migrations").all().map(m => m.name);
  
  // Lista todos os arquivos de migration
  const files = fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith(".js"))
    .sort(); // Garante ordem de execução

  for (const file of files) {
    if (!executedMigrations.includes(file)) {
      console.log(`Executando migration: ${file}`);
      const migration = await import(`./migrations/${file}`);
      
      try {
        // Inicia uma transação
        const transaction = db.transaction(() => {
          migration.up(db);
          db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
        });
        
        transaction();
        console.log(`Migration ${file} executada com sucesso!`);
      } catch (error) {
        console.error(`Erro ao executar migration ${file}:`, error);
        throw error;
      }
    }
  }
  
  console.log("Todas as migrations estão atualizadas!");
}