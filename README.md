
# 🧩 API Oportunidades

## 📖 Sobre o Projeto

A **API Oportunidades** é uma aplicação backend desenvolvida em **Node.js**, com **Express** e **SQLite**, voltada para o **gerenciamento e divulgação de oportunidades profissionais, acadêmicas e sociais**.
Faz parte de um **projeto de extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas**, com foco em soluções de impacto social.

---

## 🎯 Objetivos

* Facilitar o acesso a **vagas de emprego, cursos, mutirões e projetos sociais**
* Oferecer uma **interface padronizada de gestão de oportunidades**
* Conectar **pessoas interessadas** e **instituições** de forma simples e acessível
* Automatizar o processo de **cadastro e divulgação** de oportunidades

---

## ⚙️ Tecnologias Utilizadas

| Tecnologia                   | Descrição                              |
| ---------------------------- | -------------------------------------- |
| **Node.js**                  | Plataforma de execução JavaScript      |
| **Express**                  | Framework para criação de APIs REST    |
| **SQLite**                   | Banco de dados leve e embutido         |
| **dotenv**                   | Gerenciamento de variáveis de ambiente |
| **better-sqlite3 / sqlite3** | Driver para conexão com banco SQLite   |

---

## 🚧 Status do Projeto

✅ **CRUD de Categorias concluído**
🚧 Em desenvolvimento: demais entidades (`instituicao`, `oportunidade`, `pessoa_interessada`, `interesse`)

---

## 🧠 Funcionalidades Implementadas

### 📂 **Categorias**

Gerencia os tipos de oportunidade (ex.: Cursos, Empregos, Mutirões).

#### Endpoints

| Método     | Rota              | Descrição                        |
| ---------- | ----------------- | -------------------------------- |
| **GET**    | `/categorias`     | Retorna todas as categorias      |
| **GET**    | `/categorias/:id` | Retorna uma categoria específica |
| **POST**   | `/categorias`     | Cria uma nova categoria          |
| **PUT**    | `/categorias/:id` | Atualiza uma categoria existente |
| **DELETE** | `/categorias/:id` | Remove uma categoria             |

#### Exemplo de Requisição `POST`

```http
POST http://localhost:3000/categorias
Content-Type: application/json

{
  "nome": "Emprego"
}
```

#### Exemplo de Resposta `201 Created`

```json
{
  "id": 1,
  "nome": "Emprego"
}
```

#### Códigos de Status

| Código  | Descrição                          |
| ------- | ---------------------------------- |
| **200** | Sucesso (GET, PUT)                 |
| **201** | Criado com sucesso                 |
| **204** | Removido com sucesso               |
| **400** | Dados inválidos                    |
| **404** | Categoria não encontrada           |
| **409** | Categoria já existente (duplicada) |

---

## 🧪 Testes Locais

### 1️⃣ Rodar servidor

```bash
npm install
npm run dev
```

### 2️⃣ Testar rotas no navegador ou via PowerShell

```powershell
# Health check
irm http://localhost:3000/health

# Listar categorias
iwr http://localhost:3000/categorias | select -Expand Content

# Criar categoria
irm http://localhost:3000/categorias `
  -Method Post -ContentType "application/json" `
  -Body '{"nome":"Emprego"}'
```

---

## 🗂️ Estrutura do Projeto

```
api/
├── scripts/
│   └── seed.js
├── src/
│   ├── controllers/
│   │   └── categorias.controller.js
│   ├── routes/
│   │   └── categorias.routes.js
│   ├── database/
│   │   └── db.js
│   └── server.js
├── oportunidades.db
├── package.json
└── README.md
```

---

## 💾 Banco de Dados (SQLite)

Tabela atual:

```sql
CREATE TABLE IF NOT EXISTS categoria (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL UNIQUE,
  descricao TEXT,
  ativa INTEGER NOT NULL DEFAULT 1
);
```

Exemplo de dados iniciais:

| id | nome    | descricao                             | ativa |
| -- | ------- | ------------------------------------- | ----- |
| 1  | Curso   | Cursos gratuitos e de curta duração   | 1     |
| 2  | Emprego | Vagas de emprego e estágios           | 1     |
| 3  | Mutirão | Ações sociais e serviços comunitários | 1     |


---

## 🧑‍💻 Autor

**Leandro Mota Leal**
Projeto de Extensão — Curso de Análise e Desenvolvimento de Sistemas
Instituto INFNET
leandro.leal@al.infnet.edu.br

---

⚡ **Desenvolvido com Node.js + Express + SQLite — Projeto de Extensão Universitária.**

