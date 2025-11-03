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

-- Cria a tabela de oportunidades se não existir
CREATE TABLE IF NOT EXISTS oportunidades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  categoria_id INTEGER NOT NULL,
  organizacao_id INTEGER NOT NULL,
  tipo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa',
  data_inicio DATE,
  data_fim DATE,
  requisitos TEXT,
  beneficios TEXT,
  salario_min DECIMAL(10,2),
  salario_max DECIMAL(10,2),
  formato TEXT,
  localizacao TEXT,
  link_inscricao TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoria_id) REFERENCES categorias (id) ON DELETE RESTRICT,
  FOREIGN KEY (organizacao_id) REFERENCES organizacoes (id) ON DELETE CASCADE
);

-- Cria índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_oportunidades_categoria ON oportunidades(categoria_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_organizacao ON oportunidades(organizacao_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_status ON oportunidades(status);
CREATE INDEX IF NOT EXISTS idx_oportunidades_tipo ON oportunidades(tipo);

-- Remove dados existentes
DELETE FROM oportunidades;
DELETE FROM categorias;
DELETE FROM organizacoes;
DELETE FROM pessoas_interessadas;

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

-- Insere oportunidades iniciais
INSERT INTO oportunidades (
  titulo, 
  descricao, 
  categoria_id, 
  organizacao_id, 
  tipo, 
  status, 
  data_inicio, 
  data_fim, 
  requisitos, 
  beneficios,
  salario_min,
  salario_max,
  formato,
  localizacao,
  link_inscricao
) VALUES
  (
    'Estágio em Desenvolvimento Web',
    'Oportunidade de estágio para estudantes de Análise e Desenvolvimento de Sistemas',
    (SELECT id FROM categorias WHERE nome = 'Estágio'),
    (SELECT id FROM organizacoes WHERE nome = 'Microsoft'),
    'estagio',
    'ativa',
    '2024-01-01',
    '2024-06-30',
    '- Cursando ADS ou área relacionada
- Conhecimentos em JavaScript e React
- Inglês intermediário',
    '- Bolsa auxílio compatível com mercado
- Vale refeição
- Vale transporte
- Plano de saúde
- Dia de trabalho remoto',
    2000.00,
    2500.00,
    'hibrido',
    'São Paulo - SP',
    'https://careers.microsoft.com/students'
  ),
  (
    'Projeto de Iniciação Científica em IA',
    'Pesquisa em Inteligência Artificial aplicada à análise de dados educacionais',
    (SELECT id FROM categorias WHERE nome = 'Iniciação Científica'),
    (SELECT id FROM organizacoes WHERE nome = 'Universidade Federal de São Carlos'),
    'projeto',
    'ativa',
    '2024-03-01',
    '2025-02-28',
    '- Estudante de graduação
- Conhecimentos em Python e Machine Learning
- Disponibilidade de 20h semanais',
    '- Bolsa PIBIC
- Certificado
- Participação em eventos científicos',
    800.00,
    800.00,
    'hibrido',
    'São Carlos - SP',
    'https://www.ufscar.br/ic'
  ),
  (
    'Desenvolvedor Full Stack Java/React',
    'Vaga para desenvolvedor full stack com experiência em Java e React',
    (SELECT id FROM categorias WHERE nome = 'Emprego'),
    (SELECT id FROM organizacoes WHERE nome = 'Google'),
    'emprego',
    'ativa',
    '2024-01-15',
    NULL,
    '- Graduação em Computação ou áreas afins
- 3+ anos de experiência com Java
- Experiência com React e TypeScript
- Inglês fluente',
    '- Salário competitivo
- Plano de saúde e dental
- Vale refeição/alimentação
- Gympass
- Participação nos lucros
- Horário flexível',
    8000.00,
    12000.00,
    'remoto',
    'Remoto - Brasil',
    'https://careers.google.com'
  );
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
          process.exit(1);
        }
        console.log('Organizações no banco:', organizacoes);

        console.log('\nVerificando oportunidades...');
        db.all('SELECT o.*, c.nome as categoria_nome, org.nome as organizacao_nome FROM oportunidades o INNER JOIN categorias c ON o.categoria_id = c.id INNER JOIN organizacoes org ON o.organizacao_id = org.id ORDER BY o.id', [], (err, oportunidades) => {
          if (err) {
            console.error('Erro ao verificar oportunidades:', err);
            process.exit(1);
          }
          console.log('Oportunidades no banco:', oportunidades);

          console.log('\nInserindo pessoas interessadas...');
          const sqlPessoas = `
            INSERT INTO pessoas_interessadas (
              nome,
              email,
              telefone,
              cidade,
              estado,
              area_interesse,
              curriculo_url
            ) VALUES
            (
              'Ana Silva',
              'ana.silva@email.com',
              '(16) 98765-4321',
              'São Carlos',
              'SP',
              'Desenvolvimento de Software',
              'https://drive.google.com/file/curriculo-ana.pdf'
            ),
            (
              'Pedro Santos',
              'pedro.santos@email.com',
              '(16) 99876-5432',
              'São Carlos',
              'SP',
              'Ciência de Dados',
              'https://drive.google.com/file/curriculo-pedro.pdf'
            ),
            (
              'Maria Oliveira',
              'maria.oliveira@email.com',
              '(11) 98888-7777',
              'São Paulo',
              'SP',
              'Design UX/UI',
              'https://drive.google.com/file/curriculo-maria.pdf'
            ),
            (
              'João Pereira',
              'joao.pereira@email.com',
              '(16) 97777-6666',
              'Araraquara',
              'SP',
              'Desenvolvimento Mobile',
              'https://drive.google.com/file/curriculo-joao.pdf'
            ),
            (
              'Beatriz Costa',
              'beatriz.costa@email.com',
              '(16) 96666-5555',
              'São Carlos',
              'SP',
              'Engenharia de Dados',
              'https://drive.google.com/file/curriculo-beatriz.pdf'
            );
          `;

          db.exec(sqlPessoas, (err) => {
            if (err) {
              console.error('Erro ao inserir pessoas interessadas:', err);
              process.exit(1);
            }

            console.log('\nVerificando pessoas interessadas...');
            db.all('SELECT * FROM pessoas_interessadas ORDER BY id', [], (err, pessoas) => {
              if (err) {
                console.error('Erro ao verificar pessoas interessadas:', err);
                process.exit(1);
              }
              console.log('Pessoas interessadas no banco:', pessoas);

            console.log('\nInserindo inscrições...');
            const sqlInscricoes = `
              INSERT INTO inscricoes (
                pessoa_id,
                oportunidade_id,
                mensagem,
                status
              ) VALUES
              (
                1, -- Ana Silva
                1, -- Estágio em Desenvolvimento Web
                'Tenho grande interesse em desenvolvimento web e já possuo conhecimentos em React.',
                'pendente'
              ),
              (
                2, -- Pedro Santos
                2, -- Projeto de IC em IA
                'Gostaria muito de participar deste projeto de pesquisa em IA.',
                'aprovada'
              ),
              (
                3, -- Maria Oliveira
                1, -- Estágio em Desenvolvimento Web
                'Tenho experiência com design de interfaces e gostaria de aprender mais sobre desenvolvimento.',
                'pendente'
              ),
              (
                4, -- João Pereira
                3, -- Desenvolvedor Full Stack
                'Possuo as qualificações necessárias e gostaria de fazer parte da equipe.',
                'rejeitada'
              ),
              (
                5, -- Beatriz Costa
                2, -- Projeto de IC em IA
                'Tenho experiência com Python e Machine Learning e gostaria de contribuir com a pesquisa.',
                'pendente'
              );
            `;

            db.exec(sqlInscricoes, (err) => {
              if (err) {
                console.error('Erro ao inserir inscrições:', err);
                process.exit(1);
              }

              console.log('\nVerificando inscrições...');
              db.all('SELECT i.*, p.nome as pessoa_nome, o.titulo as oportunidade_titulo FROM inscricoes i INNER JOIN pessoas_interessadas p ON i.pessoa_id = p.id INNER JOIN oportunidades o ON i.oportunidade_id = o.id ORDER BY i.id', [], (err, inscricoes) => {
                if (err) {
                  console.error('Erro ao verificar inscrições:', err);
                  process.exit(1);
                }
                console.log('Inscrições no banco:', inscricoes);
                process.exit(0);
              });
            });
            });
          });
        });
      });
    });
  }
});
