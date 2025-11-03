import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('data/oportunidades.db');

db.serialize(() => {
    db.run(`
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
    `, err => {
        if (err) {
            console.error('Erro ao criar tabela:', err);
        } else {
            console.log('Tabela criada com sucesso');
            db.run('CREATE INDEX IF NOT EXISTS idx_interesses_pessoa ON interesses(pessoa_id)');
            db.run('CREATE INDEX IF NOT EXISTS idx_interesses_oportunidade ON interesses(oportunidade_id)');
            db.run('CREATE INDEX IF NOT EXISTS idx_interesses_status ON interesses(status)');
        }
        db.close();
    });
});