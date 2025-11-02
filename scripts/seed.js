import { db } from "../src/database/db.js";

console.log('Criando tabela e inserindo categorias...');

// Cria a tabela e insere as categorias em uma única transação
const sql = `
CREATE TABLE IF NOT EXISTS categorias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO categorias (id, nome) VALUES
  (1, 'Estágio'),
  (2, 'Emprego'),
  (3, 'Trainee'),
  (4, 'Projeto de Extensão'),
  (5, 'Iniciação Científica'),
  (6, 'Monitoria'),
  (7, 'Voluntariado'),
  (8, 'Curso');
`;

// Executa a transação
db.exec(sql, (err) => {
  if (err) {
    console.error('Erro ao inserir categorias:', err);
    process.exit(1);
  } else {
    console.log('Categorias inseridas com sucesso!');
    
    // Verifica se as categorias foram inseridas
    db.all('SELECT * FROM categorias ORDER BY id', [], (err, rows) => {
      if (err) {
        console.error('Erro ao verificar categorias:', err);
      } else {
        console.log('Categorias no banco:', rows);
      }
      process.exit(0);
    });
  }
});
