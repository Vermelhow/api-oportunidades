import { db } from "../src/database/db.js";

console.log("Aplicando seeds...");

// Seeds de categorias
const categorias = [
  { nome: "Curso", descricao: "Cursos gratuitos e de curta duração" },
  { nome: "Emprego", descricao: "Vagas de emprego e estágios" },
  { nome: "Mutirão", descricao: "Ações sociais e serviços comunitários" }
];

// Insere cada categoria se não existir
categorias.forEach(cat => {
  try {
    db.prepare(`
      INSERT OR IGNORE INTO categorias (nome) 
      VALUES (?)
    `).run(cat.nome);
  } catch (e) {
    console.error(`Erro ao inserir categoria ${cat.nome}:`, e.message);
  }
});

console.log("Seeds aplicados com sucesso!");