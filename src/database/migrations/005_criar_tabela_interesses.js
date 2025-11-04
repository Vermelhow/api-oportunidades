export function up(db) {
    // Criar tabela
    db.prepare(`
        CREATE TABLE IF NOT EXISTS interesses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pessoa_id INTEGER NOT NULL,
            oportunidade_id INTEGER NOT NULL,
            status TEXT CHECK(status IN ('pendente', 'aceito', 'recusado')) DEFAULT 'pendente',
            mensagem TEXT,
            data_interesse DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
            FOREIGN KEY (oportunidade_id) REFERENCES oportunidades(id) ON DELETE CASCADE,
            UNIQUE(pessoa_id, oportunidade_id)
        )
    `).run();

    // Criar índices para melhor performance
    db.prepare('CREATE INDEX IF NOT EXISTS idx_interesses_pessoa ON interesses(pessoa_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_interesses_oportunidade ON interesses(oportunidade_id)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_interesses_status ON interesses(status)').run();
}

export function down(db) {
    db.prepare('DROP TABLE IF EXISTS interesses').run();
}