import { db } from "../src/database/db.js";

console.log('Criando tabelas e inserindo dados iniciais...');

// Cria as tabelas e insere os dados em uma única transação
const sql = `
-- Cria a tabela de categorias se não existir
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Cria a tabela de organizações se não existir
CREATE TABLE IF NOT EXISTS organizacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  website TEXT,
  email TEXT,
  telefone TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Remove dados existentes
DELETE FROM categorias;
DELETE FROM organizacoes;

-- Insere categorias iniciais
INSERT INTO categorias (nome, descricao) VALUES
  ('Estágio', 'Oportunidades de estágio para estudantes'),
  ('Emprego', 'Vagas de emprego em tempo integral'),
  ('Projeto de Pesquisa', 'Participação em projetos de pesquisa acadêmica'),
  ('Projeto de Extensão', 'Participação em projetos de extensão universitária'),
  ('Voluntariado', 'Oportunidades de trabalho voluntário'),
  ('Iniciação Científica', 'Bolsas de iniciação científica'),
  ('Monitoria', 'Vagas para monitoria em disciplinas'),
  ('Intercâmbio', 'Programas de intercâmbio acadêmico'),
  ('Trainee', 'Programas de trainee em empresas'),
  ('Curso', 'Cursos e capacitações');

-- Insere organizações iniciais
INSERT INTO organizacoes (nome, descricao, website, email, telefone) VALUES
  ('Universidade Federal de São Carlos', 'Instituição de ensino superior pública federal brasileira', 'https://www.ufscar.br', 'contato@ufscar.br', '(16) 3351-8111'),
  ('ICMC-USP', 'Instituto de Ciências Matemáticas e de Computação da USP', 'https://www.icmc.usp.br', 'contato@icmc.usp.br', '(16) 3373-9700'),
  ('Microsoft', 'Empresa multinacional de tecnologia e software', 'https://www.microsoft.com', 'contato@microsoft.com', NULL),
  ('Google', 'Empresa multinacional de tecnologia', 'https://www.google.com', 'contato@google.com', NULL),
  ('FESC São Carlos', 'Fundação Educacional São Carlos', 'https://www.fesc.com.br', 'contato@fesc.com.br', '(16) 3372-1308');
`;

// Executa a transação
db.exec(sql, (err) => {
  if (err) {
    console.error('Erro ao inserir dados:', err);
    process.exit(1);
  } else {
    console.log('Dados inseridos com sucesso!');
    
    // Verifica se os dados foram inseridos
    console.log('Verificando categorias...');
    db.all('SELECT * FROM categorias ORDER BY id', [], (err, categorias) => {
      if (err) {
        console.error('Erro ao verificar categorias:', err);
        process.exit(1);
      }
      console.log('Categorias no banco:', categorias);

      console.log('\nVerificando organizações...');
      db.all('SELECT * FROM organizacoes ORDER BY id', [], (err, organizacoes) => {
        if (err) {
          console.error('Erro ao verificar organizações:', err);
        } else {
          console.log('Organizações no banco:', organizacoes);
        }
        process.exit(0);
      });
    });
  }
});
