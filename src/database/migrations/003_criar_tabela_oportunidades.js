export function up(db) {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS oportunidades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      categoria_id INTEGER NOT NULL,
      organizacao_id INTEGER NOT NULL,
      tipo TEXT NOT NULL, -- 'emprego', 'estagio', 'curso', 'evento', 'projeto'
      status TEXT NOT NULL DEFAULT 'ativa', -- 'ativa', 'encerrada', 'pausada'
      data_inicio DATE,
      data_fim DATE,
      requisitos TEXT,
      beneficios TEXT,
      salario_min DECIMAL(10,2),
      salario_max DECIMAL(10,2),
      formato TEXT, -- 'presencial', 'remoto', 'hibrido'
      localizacao TEXT,
      link_inscricao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE RESTRICT,
      FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id) ON DELETE CASCADE
    )
  `).run();

  // Criar índices para melhor performance
  db.prepare('CREATE INDEX IF NOT EXISTS idx_oportunidades_categoria ON oportunidades(categoria_id)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_oportunidades_organizacao ON oportunidades(organizacao_id)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_oportunidades_status ON oportunidades(status)').run();
  db.prepare('CREATE INDEX IF NOT EXISTS idx_oportunidades_tipo ON oportunidades(tipo)').run();
}

export function down(db) {
  // Remover índices
  db.prepare('DROP INDEX IF EXISTS idx_oportunidades_categoria').run();
  db.prepare('DROP INDEX IF EXISTS idx_oportunidades_organizacao').run();
  db.prepare('DROP INDEX IF EXISTS idx_oportunidades_status').run();
  db.prepare('DROP INDEX IF EXISTS idx_oportunidades_tipo').run();
  
  // Remover tabela
  db.prepare(`DROP TABLE IF EXISTS oportunidades`).run();
}