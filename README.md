
# 🧩 API Oportunidades

## 📖 Sobre o Projeto

A **API Oportunidades** é uma aplicação backend desenvolvida em **Node.js**, com **Express** e **SQLite**, voltada para o **gerenciamento e divulgação de oportunidades profissionais, acadêmicas e sociais**.
Faz parte de um **projeto de extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas**, com foco em soluções de impacto social.

### ✨ Funcionalidades Principais

- 📂 **CRUD completo** de categorias, organizações, oportunidades, pessoas e interesses
- 🔐 **Autenticação JWT** com tokens de 7 dias
- ✅ **Validação automática** de dados com express-validator
- 🛡️ **Rotas protegidas** (apenas usuários autenticados)
- 📝 **Logs detalhados** com timestamp, status e tempo de execução
- ⚠️ **Tratamento centralizado de erros** com mensagens padronizadas
- 🔍 **Filtros** por categoria, organização e pessoa
- 📨 **Sistema de interesses** com status (pendente, aceito, rejeitado)

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **SQLite** + **Better-SQLite3** - Banco de dados
- **BCrypt** - Hash de senhas (10 rounds)
- **JWT (jsonwebtoken)** - Autenticação baseada em tokens
- **Express Validator** - Validação de dados
- **CORS** - Compartilhamento de recursos
- **Dotenv** - Gerenciamento de variáveis de ambiente

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

Edite o arquivo `.env` e configure:
- `JWT_SECRET` - Chave secreta para tokens JWT (troque em produção!)
- `JWT_EXPIRES_IN` - Tempo de expiração dos tokens (padrão: 7d)
- `PORT` - Porta do servidor (padrão: 3000)

4. Execute as migrations (executam automaticamente no primeiro start):
```bash
npm run reset
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

## 📚 Documentação da API

### 📖 Documentação Completa
Acesse a documentação detalhada em: **[docs/endpoints.md](docs/endpoints.md)**

### 🔐 Autenticação
```bash
# 1. Fazer login
POST /api/pessoas/login
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}

# 2. Usar o token nas requisições protegidas
Authorization: Bearer SEU_TOKEN_JWT
```

### 🚀 Rotas Principais

#### 📂 Categorias (públicas)
- `GET /api/categorias` - Listar
- `GET /api/categorias/:id` - Buscar por ID
- `POST /api/categorias` - Criar
- `PUT /api/categorias/:id` - Atualizar
- `DELETE /api/categorias/:id` - Excluir

#### 👥 Pessoas
- `GET /api/pessoas` - Listar
- `GET /api/pessoas/:id` - Buscar por ID
- `POST /api/pessoas` - Criar (cadastro)
- `POST /api/pessoas/login` - Login (retorna JWT)
- `PUT /api/pessoas/:id` 🔒 - Atualizar (próprio usuário)
- `DELETE /api/pessoas/:id` 🔒 - Excluir (próprio usuário)

#### 🏢 Organizações (públicas)
- `GET /api/organizacoes` - Listar
- `GET /api/organizacoes/:id` - Buscar por ID
- `POST /api/organizacoes` - Criar
- `PUT /api/organizacoes/:id` - Atualizar
- `DELETE /api/organizacoes/:id` - Excluir

#### 💼 Oportunidades
- `GET /api/oportunidades` - Listar
- `GET /api/oportunidades/:id` - Buscar por ID
- `GET /api/oportunidades/categoria/:id` - Por categoria
- `GET /api/oportunidades/organizacao/:id` - Por organização
- `POST /api/oportunidades` 🔒 - Criar
- `PUT /api/oportunidades/:id` 🔒 - Atualizar
- `DELETE /api/oportunidades/:id` 🔒 - Excluir

#### 🤝 Interesses
- `GET /api/interesses` - Listar
- `GET /api/interesses/:id` - Buscar por ID
- `GET /api/interesses/pessoa/:id` - Por pessoa
- `GET /api/interesses/oportunidade/:id` - Por oportunidade
- `POST /api/interesses` 🔒 - Criar
- `PUT /api/interesses/:id` 🔒 - Atualizar
- `DELETE /api/interesses/:id` 🔒 - Excluir

🔒 = Requer autenticação JWT

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

