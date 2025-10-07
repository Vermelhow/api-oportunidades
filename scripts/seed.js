const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco
const dbPath = path.resolve(__dirname, '..', 'oportunidades.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  const statements = [

    // Índices
    `CREATE INDEX IF NOT EXISTS idx_instituicao_nome ON instituicao (nome)`,
    `CREATE INDEX IF NOT EXISTS idx_instituicao_cidade_uf ON instituicao (cidade, uf)`,
    `CREATE INDEX IF NOT EXISTS idx_oportunidade_categoria ON oportunidade (id_categoria)`,
    `CREATE INDEX IF NOT EXISTS idx_oportunidade_instituicao ON oportunidade (id_instituicao)`,
    `CREATE INDEX IF NOT EXISTS idx_oportunidade_cidade_uf ON oportunidade (cidade, uf)`,
    `CREATE INDEX IF NOT EXISTS idx_oportunidade_status ON oportunidade (status)`,
    `CREATE INDEX IF NOT EXISTS idx_pessoa_cidade_uf ON pessoa_interessada (cidade, uf)`,
    `CREATE INDEX IF NOT EXISTS idx_interesse_status ON interesse (status)`,

    // Seeds
    `INSERT OR IGNORE INTO categoria (id, nome, descricao, ativa) VALUES
      (1,'Curso','Cursos gratuitos e de curta duração',1),
      (2,'Emprego','Vagas de emprego e estágios',1),
      (3,'Mutirão','Ações sociais e serviços comunitários',1)`,

    `INSERT OR IGNORE INTO instituicao (id, nome, cnpj, email, telefone, site, cidade, uf, endereco, ativa) VALUES
      (1,'ONG Esperança','12345678000199','contato@esperanca.org','(11) 99999-9999','https://esperanca.org','São Paulo','SP','Rua A, 100',1),
      (2,'Associação Futuro','98765432000111','info@futuro.org','(21) 88888-8888','https://futuro.org','Rio de Janeiro','RJ','Av. B, 200',1)`,

    `INSERT OR IGNORE INTO oportunidade (id, titulo, descricao, modalidade, local, cidade, uf, data_inicio, data_fim, vagas, requisitos, publico_alvo, link_inscricao, id_categoria, id_instituicao, status) VALUES
      (1,'Curso de Lógica de Programação','Curso introdutório com certificado','online',NULL,'São Paulo','SP','2025-08-20','2025-09-10',50,'Ensino fundamental completo','Jovens a partir de 16 anos','https://esperanca.org/inscricao-logica',1,1,'aberta'),
      (2,'Mutirão de Documentação','Emissão de RG e CPF','presencial','Centro Comunitário','Rio de Janeiro','RJ','2025-09-05','2025-09-05',200,NULL,'Adultos sem documentação','https://futuro.org/mutirao-docs',3,2,'aberta'),
      (3,'Vaga de Auxiliar Administrativo','Jornada de 6h, VT','presencial','Sede da empresa','São Paulo','SP',NULL,NULL,2,'Básico de Excel','Público geral','https://esperanca.org/aux-admin',2,1,'aberta')`,

    `INSERT OR IGNORE INTO pessoa_interessada (id, nome, cpf, email, telefone, cidade, uf, renda_mensal) VALUES
      (1,'Ana Silva','11122233344','ana.silva@email.com','(11) 91234-5678','São Paulo','SP',1200.00),
      (2,'Carlos Souza',NULL,'carlos.souza@email.com','(21) 92345-6789','Rio de Janeiro','RJ',0.00)`,

    `INSERT OR IGNORE INTO interesse (id_pessoa, id_oportunidade, status, observacao) VALUES
      (1,1,'inscrito','Cadastrada via site'),
      (2,2,'novo','Precisa de auxílio no transporte'),
      (1,3,'contato_realizado','Retorno por e-mail')`,
  ];

  statements.forEach(sql => {
    db.run(sql, (err) => {
      if (err) console.error('Erro:', err.message);
    });
  });
});

db.close(() => console.log('Seeds aplicados com sucesso.'));
