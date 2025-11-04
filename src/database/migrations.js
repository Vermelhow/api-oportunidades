import { db } from './db.js';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

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

// Executa uma migration específica dentro de uma transação
function executeMigration(file, migrationModule) {
    try {
        db.prepare('BEGIN TRANSACTION').run();
        
        // Executa a migration
        migrationModule.up(db);
        
        // Registra a execução
        db.prepare("INSERT INTO migrations (name) VALUES (?)").run(file);
        
        // Commit se tudo deu certo
        db.prepare('COMMIT').run();
    } catch (err) {
        // Rollback em caso de erro
        db.prepare('ROLLBACK').run();
        throw err;
    }
}

// Executa todas as migrations pendentes
export async function runMigrations() {
    try {
        console.log("Verificando migrations...");
        initMigrationsTable();

        // Verifica as migrations já executadas
        const executedMigrations = db.prepare("SELECT name FROM migrations").all().map(m => m.name);

        // Lista todos os arquivos de migration
        const files = fs.readdirSync(path.join(__dirname, "migrations"))
            .filter(f => f.endsWith('.js'))
            .sort(); // Garante ordem de execução

        for (const file of files) {
            if (!executedMigrations.includes(file)) {
                console.log('Executando migration:', file);
                
                try {
                    // Carrega o módulo de migration
                    const migrationPath = path.join(__dirname, "migrations", file);
                    const migrationModule = await import('file:///' + migrationPath.replaceAll('\\', '/'));

                    // Executa a migration
                    executeMigration(file, migrationModule);
                    
                    console.log('Migration', file, 'executada com sucesso!');
                } catch (error) {
                    console.error('Erro ao executar migration', file, ':', error);
                    throw error;
                }
            }
        }

        console.log("Migrations concluídas!");
    } catch (error) {
        console.error("Erro ao executar migrations:", error);
        throw error;
    }
}

// Se este arquivo for executado diretamente
if (import.meta.url === new URL(import.meta.resolve(import.meta.url)).href) {
    try {
        runMigrations();
    } catch (error) {
        console.error('Erro no processo de migração:', error);
        process.exit(1);
    }
}