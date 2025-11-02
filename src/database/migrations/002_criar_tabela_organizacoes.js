export function up(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS organizacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      descricao TEXT,
      website TEXT,
      email TEXT,
      telefone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
}

export function down(db) {
  db.prepare(`DROP TABLE IF EXISTS organizacoes`).run();
}