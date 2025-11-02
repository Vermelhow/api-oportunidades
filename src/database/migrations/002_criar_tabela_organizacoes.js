export function up(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS organizacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      email TEXT NOT NULL UNIQUE,
      telefone TEXT,
      website TEXT,
      endereco TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export function down(db) {
  db.prepare(`DROP TABLE IF EXISTS organizacoes`).run();
}