export const up = async (db) => {
  const sql = `
    CREATE TABLE IF NOT EXISTS inscricoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pessoa_id INTEGER NOT NULL,
      oportunidade_id INTEGER NOT NULL,
      status TEXT DEFAULT 'pendente',
      mensagem TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (pessoa_id) REFERENCES pessoas_interessadas (id) ON DELETE CASCADE,
      FOREIGN KEY (oportunidade_id) REFERENCES oportunidades (id) ON DELETE CASCADE,
      UNIQUE(pessoa_id, oportunidade_id)
    )
  `;

  try {
    await db.run(sql);
    
    // Cria índices para melhor performance
    await db.run('CREATE INDEX IF NOT EXISTS idx_inscricoes_pessoa ON inscricoes(pessoa_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_inscricoes_oportunidade ON inscricoes(oportunidade_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_inscricoes_status ON inscricoes(status)');
    
    console.log('Tabela inscricoes criada com sucesso!');
  } catch (error) {
    console.error('Erro ao criar tabela inscricoes:', error);
    throw error;
  }
};

export const down = async (db) => {
  const sql = `DROP TABLE IF EXISTS inscricoes`;
  
  try {
    await db.run(sql);
    console.log('Tabela inscricoes removida com sucesso!');
  } catch (error) {
    console.error('Erro ao remover tabela inscricoes:', error);
    throw error;
  }
};