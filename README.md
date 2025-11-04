
# 🧩 API Oportunidades

## 📖 Sobre o Projeto

A **API Oportunidades** é uma aplicação backend desenvolvida em **Node.js**, com **Express** e **SQLite**, voltada para o **gerenciamento e divulgação de oportunidades profissionais, acadêmicas e sociais**.
Faz parte de um **projeto de extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas**, com foco em soluções de impacto social.

### ✨ Funcionalidades Principais

- 📂 Cadastro e gerenciamento de categorias
- 🏢 Cadastro e gerenciamento de organizações
- 💼 Publicação e gerenciamento de oportunidades
- 👥 Cadastro de pessoas interessadas
- 🤝 Sistema de demonstração de interesse
- 🔍 Filtros e buscas avançadas
- 📨 Notificações de status

## 🚀 Tecnologias

- Node.js
- Express
- SQLite
- Better-SQLite3
- BCrypt (hash de senhas)
- CORS
- Dotenv
- Express Validator

## ⚙️ Requisitos

- Node.js 18+
- NPM ou Yarn
- Git

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/Vermelhow/api-oportunidades.git
cd api-oportunidades
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrations:
```bash
npm run migrate
```

5. (Opcional) Popule o banco com dados iniciais:
```bash
npm run seed
```

## 🎯 Uso

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

## 📚 Estrutura da API

### Categorias
- GET `/api/categorias` - Lista todas as categorias
- GET `/api/categorias/:id` - Busca uma categoria
- POST `/api/categorias` - Cria uma categoria
- PUT `/api/categorias/:id` - Atualiza uma categoria
- DELETE `/api/categorias/:id` - Remove uma categoria

### Organizações
- GET `/api/organizacoes` - Lista todas as organizações
- GET `/api/organizacoes/:id` - Busca uma organização
- POST `/api/organizacoes` - Cria uma organização
- PUT `/api/organizacoes/:id` - Atualiza uma organização
- DELETE `/api/organizacoes/:id` - Remove uma organização

### Oportunidades
- GET `/api/oportunidades` - Lista todas as oportunidades
- GET `/api/oportunidades/:id` - Busca uma oportunidade
- POST `/api/oportunidades` - Cria uma oportunidade
- PUT `/api/oportunidades/:id` - Atualiza uma oportunidade
- PATCH `/api/oportunidades/:id/status` - Atualiza status
- DELETE `/api/oportunidades/:id` - Remove uma oportunidade

### Pessoas
- GET `/api/pessoas` - Lista todas as pessoas
- GET `/api/pessoas/:id` - Busca uma pessoa
- POST `/api/pessoas` - Cria uma pessoa
- PUT `/api/pessoas/:id` - Atualiza uma pessoa
- DELETE `/api/pessoas/:id` - Remove uma pessoa

### Interesses
- GET `/api/interesses` - Lista todos os interesses
- GET `/api/interesses/:id` - Busca um interesse
- POST `/api/interesses` - Cria um interesse
- PATCH `/api/interesses/:id/status` - Atualiza status
- DELETE `/api/interesses/:id` - Remove um interesse

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

### Funcionalidades Implementadas ✅
- **CRUD de Categorias**: Gerenciamento completo de categorias de oportunidades
- **CRUD de Organizações**: Cadastro e gestão de instituições e empresas
- **CRUD de Oportunidades**: Publicação e gerenciamento de vagas e ações
- **CRUD de Pessoas**: Gestão de perfis de pessoas interessadas
- **Sistema de Interesses**: Conexão entre pessoas e oportunidades

### Próximos Passos 🚀
- Implementação de autenticação JWT
- Sistema de notificações
- Documentação com Swagger
- Melhorias de validação com Joi/Zod

---

## 🧠 Funcionalidades Detalhadas

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

