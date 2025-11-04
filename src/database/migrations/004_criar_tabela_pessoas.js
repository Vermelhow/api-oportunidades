export function up(db) {
    db.prepare(`
        CREATE TABLE IF NOT EXISTS pessoas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            bio TEXT,
            linkedin_url TEXT,
            github_url TEXT,
            portfolio_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();
}

export function down(db) {
    db.prepare('DROP TABLE IF EXISTS pessoas').run();
}