
-- Projeto de Extensão - API de Oportunidades (SQLite versão)
-- Criar arquivo .db e rodar este script no DB Browser for SQLite

PRAGMA foreign_keys = ON;

-- ===========================================
-- Tabela: categoria
-- ===========================================
DROP TABLE IF EXISTS categoria;
CREATE TABLE categoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativa INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===========================================
-- Tabela: instituicao
-- ===========================================
DROP TABLE IF EXISTS instituicao;
CREATE TABLE instituicao (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  email TEXT,
  telefone TEXT,
  site TEXT,
  endereco TEXT,
  cidade TEXT,
  uf TEXT CHECK(length(uf) = 2),
  ativa INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===========================================
-- Tabela: oportunidade
-- ===========================================
DROP TABLE IF EXISTS oportunidade;
CREATE TABLE oportunidade (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  modalidade TEXT NOT NULL DEFAULT 'presencial' CHECK (modalidade IN ('presencial','online','hibrida')),
  local TEXT,
  cidade TEXT,
  uf TEXT CHECK(length(uf) = 2),
  data_inicio TEXT,
  data_fim TEXT,
  vagas INTEGER NOT NULL DEFAULT 0,
  requisitos TEXT,
  publico_alvo TEXT,
  link_inscricao TEXT,
  id_categoria INTEGER NOT NULL,
  id_instituicao INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'aberta' CHECK (status IN ('aberta','fechada','encerrada','cancelada')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT,
  FOREIGN KEY (id_categoria) REFERENCES categoria(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  FOREIGN KEY (id_instituicao) REFERENCES instituicao(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CHECK (data_fim IS NULL OR data_inicio IS NULL OR date(data_fim) >= date(data_inicio))
);

-- ===========================================
-- Tabela: pessoa_interessada
-- ===========================================
DROP TABLE IF EXISTS pessoa_interessada;
CREATE TABLE pessoa_interessada (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cidade TEXT,
  uf TEXT CHECK(length(uf) = 2),
  renda_mensal REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ===========================================
-- Tabela: interesse (N:N)
-- ===========================================
DROP TABLE IF EXISTS interesse;
CREATE TABLE interesse (
  id_pessoa INTEGER NOT NULL,
  id_oportunidade INTEGER NOT NULL,
  data_interesse TEXT NOT NULL DEFAULT (datetime('now')),
  status TEXT NOT NULL DEFAULT 'novo' CHECK (status IN ('novo','contato_realizado','inscrito','desistiu')),
  observacao TEXT,
  PRIMARY KEY (id_pessoa, id_oportunidade),
  FOREIGN KEY (id_pessoa) REFERENCES pessoa_interessada(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_oportunidade) REFERENCES oportunidade(id) ON UPDATE CASCADE ON DELETE CASCADE
);

-- ===========================================
-- Seeds (dados de teste)
-- ===========================================
INSERT INTO categoria (nome, descricao) VALUES
 ('Curso', 'Cursos gratuitos e de curta duração'),
 ('Emprego', 'Vagas de emprego e estágios'),
 ('Mutirão', 'Ações sociais e serviços comunitários');

INSERT INTO instituicao (nome, cnpj, email, telefone, site, cidade, uf, endereco) VALUES
 ('ONG Esperança', '12345678000199', 'contato@esperanca.org', '(11) 99999-9999', 'https://esperanca.org', 'São Paulo', 'SP', 'Rua A, 100'),
 ('Associação Futuro', '98765432000111', 'info@futuro.org', '(21) 88888-8888', 'https://futuro.org', 'Rio de Janeiro', 'RJ', 'Av. B, 200');

INSERT INTO oportunidade (titulo, descricao, modalidade, local, cidade, uf, data_inicio, data_fim, vagas, requisitos, publico_alvo, link_inscricao, id_categoria, id_instituicao, status)
VALUES
 ('Curso de Lógica de Programação', 'Curso introdutório com certificado', 'online', NULL, 'São Paulo', 'SP', '2025-08-20', '2025-09-10', 50, 'Ensino fundamental completo', 'Jovens a partir de 16 anos', 'https://esperanca.org/inscricao-logica', 1, 1, 'aberta'),
 ('Mutirão de Documentação', 'Emissão de RG e CPF', 'presencial', 'Centro Comunitário', 'Rio de Janeiro', 'RJ', '2025-09-05', '2025-09-05', 200, NULL, 'Adultos sem documentação', 'https://futuro.org/mutirao-docs', 3, 2, 'aberta'),
 ('Vaga de Auxiliar Administrativo', 'Jornada de 6h, vale transporte', 'presencial', 'Sede da empresa', 'São Paulo', 'SP', NULL, NULL, 2, 'Conhecimento básico em Excel', 'Público geral', 'https://esperanca.org/aux-admin', 2, 1, 'aberta');

INSERT INTO pessoa_interessada (nome, cpf, email, telefone, cidade, uf, renda_mensal) VALUES
 ('Ana Silva', '11122233344', 'ana.silva@email.com', '(11) 91234-5678', 'São Paulo', 'SP', 1200.00),
 ('Carlos Souza', NULL, 'carlos.souza@email.com', '(21) 92345-6789', 'Rio de Janeiro', 'RJ', 0.00);

INSERT INTO interesse (id_pessoa, id_oportunidade, status, observacao) VALUES
 (1, 1, 'inscrito', 'Cadastrada via site'),
 (2, 2, 'novo', 'Precisa de auxílio no transporte'),
 (1, 3, 'contato_realizado', 'Retorno por e-mail');

-- ===========================================
-- Consultas de validação
-- ===========================================
-- Oportunidades com suas categorias e instituições
SELECT o.id, o.titulo, c.nome AS categoria, i.nome AS instituicao, o.status
FROM oportunidade o
JOIN categoria c ON c.id = o.id_categoria
JOIN instituicao i ON i.id = o.id_instituicao
ORDER BY o.id;

-- Contagem de interessados por oportunidade
SELECT o.id, o.titulo, COUNT(it.id_pessoa) AS qtde_interessados
FROM oportunidade o
LEFT JOIN interesse it ON it.id_oportunidade = o.id
GROUP BY o.id, o.titulo
ORDER BY qtde_interessados DESC;

-- Pessoas interessadas em cada oportunidade
SELECT o.titulo, p.nome AS pessoa, it.status, it.data_interesse
FROM interesse it
JOIN pessoa_interessada p ON p.id = it.id_pessoa
JOIN oportunidade o ON o.id = it.id_oportunidade
ORDER BY o.id, it.data_interesse DESC;
