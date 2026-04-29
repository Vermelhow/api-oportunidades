# 📚 Documentação da API - Endpoints

## 🔗 URL Base
```
http://localhost:3000/api
```

## 📋 Índice
- [Autenticação](#autenticação)
- [Pessoas](#pessoas)
- [Categorias](#categorias)
- [Organizações](#organizações)
- [Oportunidades](#oportunidades)
- [Interesses](#interesses)
- [Padrões de Resposta](#padrões-de-resposta)
- [Códigos de Status](#códigos-de-status)

---

## 🔐 Autenticação

A API usa autenticação JWT (JSON Web Token). Após fazer login, inclua o token no header de todas as requisições protegidas:

```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

### Login

**POST** `/api/pessoas/login`

Autentica um usuário e retorna um token JWT.

**Request Body:**
```json
{
  "email": "usuario@exemplo.com",
  "senha": "senha123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": {
      "id": 1,
      "nome": "João Silva",
      "email": "usuario@exemplo.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Erros:**
- `401`: Credenciais inválidas
- `400`: Email e senha são obrigatórios (validação)

---

## 👥 Pessoas

### Listar todas as pessoas

**GET** `/api/pessoas`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "bio": "Desenvolvedor Full Stack",
      "linkedin_url": "https://linkedin.com/in/joaosilva",
      "github_url": "https://github.com/joaosilva",
      "portfolio_url": "https://joaosilva.dev",
      "created_at": "2025-11-20T10:00:00.000Z",
      "updated_at": "2025-11-20T10:00:00.000Z"
    }
  ]
}
```

### Buscar pessoa por ID

**GET** `/api/pessoas/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "bio": "Desenvolvedor Full Stack",
    "linkedin_url": "https://linkedin.com/in/joaosilva",
    "github_url": "https://github.com/joaosilva",
    "portfolio_url": "https://joaosilva.dev",
    "created_at": "2025-11-20T10:00:00.000Z",
    "updated_at": "2025-11-20T10:00:00.000Z"
  }
}
```

**Erros:**
- `404`: Pessoa não encontrada
- `400`: ID inválido (validação)

### Criar nova pessoa

**POST** `/api/pessoas`

**Request Body:**
```json
{
  "nome": "Maria Santos",
  "email": "maria@exemplo.com",
  "senha": "senha123",
  "bio": "Designer UX/UI",
  "linkedin_url": "https://linkedin.com/in/mariasantos",
  "github_url": "https://github.com/mariasantos",
  "portfolio_url": "https://mariasantos.design"
}
```

**Campos obrigatórios:**
- `nome` (3-255 caracteres)
- `email` (formato válido)
- `senha` (mínimo 6 caracteres)

**Campos opcionais:**
- `bio` (máximo 1000 caracteres)
- `linkedin_url`, `github_url`, `portfolio_url` (URLs válidas)

**Response (201):**
```json
{
  "success": true,
  "message": "Pessoa criada com sucesso",
  "data": {
    "id": 2,
    "nome": "Maria Santos",
    "email": "maria@exemplo.com",
    "bio": "Designer UX/UI",
    "linkedin_url": "https://linkedin.com/in/mariasantos",
    "github_url": "https://github.com/mariasantos",
    "portfolio_url": "https://mariasantos.design",
    "created_at": "2025-11-23T14:30:00.000Z",
    "updated_at": "2025-11-23T14:30:00.000Z"
  }
}
```

**Erros:**
- `400`: Email já cadastrado
- `400`: Erro de validação (campos obrigatórios, formato inválido)

### Atualizar pessoa

**PUT** `/api/pessoas/:id` 🔒 **Requer autenticação** (apenas o próprio usuário)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:** (todos os campos são opcionais)
```json
{
  "nome": "Maria Santos Silva",
  "email": "maria.silva@exemplo.com",
  "senha": "novaSenha456",
  "bio": "Senior UX/UI Designer",
  "linkedin_url": "https://linkedin.com/in/mariasantossilva",
  "github_url": null,
  "portfolio_url": "https://mariasilva.design"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Pessoa atualizada com sucesso",
  "data": {
    "id": 2,
    "nome": "Maria Santos Silva",
    "email": "maria.silva@exemplo.com",
    "bio": "Senior UX/UI Designer",
    "linkedin_url": "https://linkedin.com/in/mariasantossilva",
    "github_url": null,
    "portfolio_url": "https://mariasilva.design",
    "created_at": "2025-11-23T14:30:00.000Z",
    "updated_at": "2025-11-23T15:00:00.000Z"
  }
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `403`: Você não tem permissão para acessar este recurso
- `404`: Pessoa não encontrada
- `400`: Email já cadastrado

### Excluir pessoa

**DELETE** `/api/pessoas/:id` 🔒 **Requer autenticação** (apenas o próprio usuário)

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (204):** Sem conteúdo

**Erros:**
- `401`: Token não fornecido ou inválido
- `403`: Você não tem permissão para acessar este recurso
- `404`: Pessoa não encontrada

### Listar interesses de uma pessoa

**GET** `/api/pessoas/:id/interesses`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pessoa_id": 1,
      "oportunidade_id": 5,
      "oportunidade_titulo": "Desenvolvedor Full Stack",
      "mensagem": "Tenho interesse nesta vaga",
      "status": "pendente",
      "created_at": "2025-11-23T10:00:00.000Z"
    }
  ]
}
```

---

## 📂 Categorias

### Listar todas as categorias

**GET** `/api/categorias`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Tecnologia",
      "descricao": "Vagas e cursos na área de TI"
    },
    {
      "id": 2,
      "nome": "Design",
      "descricao": "Oportunidades em design gráfico e UX/UI"
    }
  ]
}
```

### Buscar categoria por ID

**GET** `/api/categorias/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Tecnologia",
    "descricao": "Vagas e cursos na área de TI"
  }
}
```

**Erros:**
- `404`: Categoria não encontrada

### Criar categoria

**POST** `/api/categorias`

**Request Body:**
```json
{
  "nome": "Marketing",
  "descricao": "Oportunidades em marketing digital e comunicação"
}
```

**Campos obrigatórios:**
- `nome` (3-100 caracteres)

**Campos opcionais:**
- `descricao` (máximo 500 caracteres)

**Response (201):**
```json
{
  "success": true,
  "message": "Categoria criada com sucesso",
  "data": {
    "id": 3,
    "nome": "Marketing",
    "descricao": "Oportunidades em marketing digital e comunicação"
  }
}
```

**Erros:**
- `409`: Categoria já existe
- `400`: Erro de validação

### Atualizar categoria

**PUT** `/api/categorias/:id`

**Request Body:** (campos opcionais)
```json
{
  "nome": "Marketing Digital",
  "descricao": "Oportunidades em marketing digital, comunicação e redes sociais"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Categoria atualizada com sucesso",
  "data": {
    "id": 3,
    "nome": "Marketing Digital",
    "descricao": "Oportunidades em marketing digital, comunicação e redes sociais"
  }
}
```

**Erros:**
- `404`: Categoria não encontrada
- `409`: Já existe outra categoria com esse nome

### Excluir categoria

**DELETE** `/api/categorias/:id`

**Response (204):** Sem conteúdo

**Erros:**
- `404`: Categoria não encontrada

---

## 🏢 Organizações

### Listar todas as organizações

**GET** `/api/organizacoes`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nome": "Tech Solutions LTDA",
      "email": "contato@techsolutions.com",
      "telefone": "(11) 98765-4321",
      "descricao": "Empresa de desenvolvimento de software",
      "website": "https://techsolutions.com",
      "created_at": "2025-11-20T08:00:00.000Z",
      "updated_at": "2025-11-20T08:00:00.000Z"
    }
  ]
}
```

### Buscar organização por ID

**GET** `/api/organizacoes/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Tech Solutions LTDA",
    "email": "contato@techsolutions.com",
    "telefone": "(11) 98765-4321",
    "descricao": "Empresa de desenvolvimento de software",
    "website": "https://techsolutions.com",
    "created_at": "2025-11-20T08:00:00.000Z",
    "updated_at": "2025-11-20T08:00:00.000Z"
  }
}
```

**Erros:**
- `404`: Organização não encontrada

### Criar organização

**POST** `/api/organizacoes`

**Request Body:**
```json
{
  "nome": "Design Studio",
  "email": "contato@designstudio.com",
  "telefone": "(11) 91234-5678",
  "descricao": "Estúdio de design especializado em branding",
  "website": "https://designstudio.com"
}
```

**Campos obrigatórios:**
- `nome` (3-255 caracteres)
- `email` (formato válido)

**Campos opcionais:**
- `telefone` (apenas números, espaços, parênteses, hífens e +)
- `descricao` (máximo 2000 caracteres)
- `website` (URL válida)

**Response (201):**
```json
{
  "success": true,
  "message": "Organização criada com sucesso",
  "data": {
    "id": 2,
    "nome": "Design Studio",
    "email": "contato@designstudio.com",
    "telefone": "(11) 91234-5678",
    "descricao": "Estúdio de design especializado em branding",
    "website": "https://designstudio.com",
    "created_at": "2025-11-23T16:00:00.000Z",
    "updated_at": "2025-11-23T16:00:00.000Z"
  }
}
```

**Erros:**
- `400`: Email já cadastrado
- `400`: Erro de validação

### Atualizar organização

**PUT** `/api/organizacoes/:id`

**Request Body:** (todos os campos opcionais)
```json
{
  "nome": "Design Studio & Co.",
  "telefone": "(11) 91234-9999",
  "descricao": "Estúdio de design especializado em branding e identidade visual"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Organização atualizada com sucesso",
  "data": {
    "id": 2,
    "nome": "Design Studio & Co.",
    "email": "contato@designstudio.com",
    "telefone": "(11) 91234-9999",
    "descricao": "Estúdio de design especializado em branding e identidade visual",
    "website": "https://designstudio.com",
    "created_at": "2025-11-23T16:00:00.000Z",
    "updated_at": "2025-11-23T16:30:00.000Z"
  }
}
```

**Erros:**
- `404`: Organização não encontrada
- `400`: Email já cadastrado

### Excluir organização

**DELETE** `/api/organizacoes/:id`

**Response (204):** Sem conteúdo

**Erros:**
- `404`: Organização não encontrada

---

## 💼 Oportunidades

### Listar todas as oportunidades

**GET** `/api/oportunidades`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "Desenvolvedor Full Stack",
      "descricao": "Buscamos desenvolvedor com experiência em Node.js e React",
      "categoria_id": 1,
      "categoria_nome": "Tecnologia",
      "organizacao_id": 1,
      "organizacao_nome": "Tech Solutions LTDA",
      "organizacao_email": "contato@techsolutions.com",
      "tipo": "emprego",
      "status": "ativa",
      "data_inicio": "2025-11-23",
      "data_fim": "2025-12-31",
      "requisitos": "Node.js, React, SQL",
      "beneficios": "Vale alimentação, plano de saúde, home office",
      "salario_min": 5000.00,
      "salario_max": 8000.00,
      "formato": "hibrido",
      "localizacao": "São Paulo, SP",
      "link_inscricao": "https://techsolutions.com/vagas/123",
      "created_at": "2025-11-23T09:00:00.000Z",
      "updated_at": "2025-11-23T09:00:00.000Z"
    }
  ]
}
```

### Buscar oportunidade por ID

**GET** `/api/oportunidades/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "titulo": "Desenvolvedor Full Stack",
    "descricao": "Buscamos desenvolvedor com experiência em Node.js e React",
    "categoria_id": 1,
    "categoria_nome": "Tecnologia",
    "organizacao_id": 1,
    "organizacao_nome": "Tech Solutions LTDA",
    "organizacao_email": "contato@techsolutions.com",
    "tipo": "emprego",
    "status": "ativa",
    "data_inicio": "2025-11-23",
    "data_fim": "2025-12-31",
    "requisitos": "Node.js, React, SQL",
    "beneficios": "Vale alimentação, plano de saúde, home office",
    "salario_min": 5000.00,
    "salario_max": 8000.00,
    "formato": "hibrido",
    "localizacao": "São Paulo, SP",
    "link_inscricao": "https://techsolutions.com/vagas/123",
    "created_at": "2025-11-23T09:00:00.000Z",
    "updated_at": "2025-11-23T09:00:00.000Z"
  }
}
```

**Erros:**
- `404`: Oportunidade não encontrada

### Listar oportunidades por categoria

**GET** `/api/oportunidades/categoria/:categoria_id`

**Response:** Mesmo formato da listagem geral

### Listar oportunidades por organização

**GET** `/api/oportunidades/organizacao/:organizacao_id`

**Response:** Mesmo formato da listagem geral

### Criar oportunidade

**POST** `/api/oportunidades` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "titulo": "Designer UX/UI Pleno",
  "descricao": "Vaga para designer com experiência em Figma e protótipos de alta fidelidade",
  "categoria_id": 2,
  "organizacao_id": 2,
  "tipo": "emprego",
  "status": "ativa",
  "data_inicio": "2025-12-01",
  "data_fim": "2026-01-15",
  "requisitos": "Figma, Adobe XD, experiência com design systems",
  "beneficios": "Vale refeição, plano de saúde, flexibilidade de horário",
  "salario_min": 4000.00,
  "salario_max": 6500.00,
  "formato": "remoto",
  "localizacao": "Remoto - qualquer lugar do Brasil",
  "link_inscricao": "https://designstudio.com/vagas/ux-pleno"
}
```

**Campos obrigatórios:**
- `titulo` (5-255 caracteres)
- `descricao` (mínimo 20 caracteres)
- `categoria_id` (número inteiro positivo)
- `organizacao_id` (número inteiro positivo)
- `tipo`: `emprego`, `estagio`, `curso`, `evento` ou `projeto`

**Campos opcionais:**
- `status`: `ativa` (padrão), `encerrada` ou `pausada`
- `data_inicio`, `data_fim` (formato ISO 8601: YYYY-MM-DD)
- `requisitos`, `beneficios`, `localizacao` (texto)
- `salario_min`, `salario_max` (números positivos)
- `formato`: `presencial`, `remoto` ou `hibrido`
- `link_inscricao` (URL válida)

**Response (201):**
```json
{
  "success": true,
  "message": "Oportunidade criada com sucesso",
  "data": {
    "id": 2,
    "titulo": "Designer UX/UI Pleno",
    "descricao": "Vaga para designer com experiência em Figma...",
    "categoria_id": 2,
    "organizacao_id": 2,
    "tipo": "emprego",
    "status": "ativa",
    "data_inicio": "2025-12-01",
    "data_fim": "2026-01-15",
    "requisitos": "Figma, Adobe XD, experiência com design systems",
    "beneficios": "Vale refeição, plano de saúde...",
    "salario_min": 4000.00,
    "salario_max": 6500.00,
    "formato": "remoto",
    "localizacao": "Remoto - qualquer lugar do Brasil",
    "link_inscricao": "https://designstudio.com/vagas/ux-pleno",
    "created_at": "2025-11-23T17:00:00.000Z",
    "updated_at": "2025-11-23T17:00:00.000Z"
  }
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Categoria não encontrada
- `404`: Organização não encontrada
- `400`: Erro de validação

### Atualizar oportunidade

**PUT** `/api/oportunidades/:id` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:** (todos os campos opcionais)
```json
{
  "status": "pausada",
  "salario_max": 7000.00
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Oportunidade atualizada com sucesso",
  "data": {
    "id": 2,
    "titulo": "Designer UX/UI Pleno",
    "status": "pausada",
    "salario_max": 7000.00,
    ...
  }
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Oportunidade não encontrada

### Excluir oportunidade

**DELETE** `/api/oportunidades/:id` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (204):** Sem conteúdo

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Oportunidade não encontrada

---

## 🤝 Interesses

### Listar todos os interesses

**GET** `/api/interesses`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pessoa_id": 1,
      "pessoa_nome": "João Silva",
      "oportunidade_id": 1,
      "oportunidade_titulo": "Desenvolvedor Full Stack",
      "mensagem": "Tenho muito interesse nesta vaga. Tenho 5 anos de experiência.",
      "status": "pendente",
      "created_at": "2025-11-23T10:00:00.000Z"
    }
  ]
}
```

### Buscar interesse por ID

**GET** `/api/interesses/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "pessoa_id": 1,
    "pessoa_nome": "João Silva",
    "oportunidade_id": 1,
    "oportunidade_titulo": "Desenvolvedor Full Stack",
    "mensagem": "Tenho muito interesse nesta vaga. Tenho 5 anos de experiência.",
    "status": "pendente",
    "created_at": "2025-11-23T10:00:00.000Z"
  }
}
```

**Erros:**
- `404`: Interesse não encontrado

### Listar interesses de uma pessoa

**GET** `/api/interesses/pessoa/:pessoa_id`

**Response:** Mesmo formato da listagem geral

### Listar interesses em uma oportunidade

**GET** `/api/interesses/oportunidade/:oportunidade_id`

**Response:** Mesmo formato da listagem geral

### Demonstrar interesse

**POST** `/api/interesses` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:**
```json
{
  "pessoa_id": 1,
  "oportunidade_id": 2,
  "mensagem": "Tenho grande interesse nesta oportunidade. Possuo experiência com Figma e Adobe XD.",
  "status": "pendente"
}
```

**Campos obrigatórios:**
- `pessoa_id` (número inteiro positivo)
- `oportunidade_id` (número inteiro positivo)

**Campos opcionais:**
- `mensagem` (máximo 1000 caracteres)
- `status`: `pendente` (padrão), `aceito` ou `rejeitado`

**Response (201):**
```json
{
  "success": true,
  "message": "Interesse criado com sucesso",
  "data": {
    "id": 2,
    "pessoa_id": 1,
    "oportunidade_id": 2,
    "mensagem": "Tenho grande interesse nesta oportunidade...",
    "status": "pendente",
    "created_at": "2025-11-23T18:00:00.000Z"
  }
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Pessoa não encontrada
- `404`: Oportunidade não encontrada
- `400`: Interesse já existe

### Atualizar interesse

**PUT** `/api/interesses/:id` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Request Body:** (todos os campos opcionais)
```json
{
  "status": "aceito",
  "mensagem": "Fui aceito! Muito feliz!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Interesse atualizado com sucesso",
  "data": {
    "id": 2,
    "pessoa_id": 1,
    "oportunidade_id": 2,
    "mensagem": "Fui aceito! Muito feliz!",
    "status": "aceito",
    "created_at": "2025-11-23T18:00:00.000Z"
  }
}
```

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Interesse não encontrado

### Excluir interesse

**DELETE** `/api/interesses/:id` 🔒 **Requer autenticação**

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Response (204):** Sem conteúdo

**Erros:**
- `401`: Token não fornecido ou inválido
- `404`: Interesse não encontrado

---

## 📦 Padrões de Resposta

### Sucesso (2xx)

**200 OK - Listagem/Busca:**
```json
{
  "success": true,
  "data": { ... }
}
```

**200 OK - Com mensagem:**
```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

**201 Created - Criação:**
```json
{
  "success": true,
  "message": "Recurso criado com sucesso",
  "data": { ... }
}
```

**204 No Content - Exclusão:**
```
(sem corpo de resposta)
```

### Erro (4xx/5xx)

**Erro de validação (400):**
```json
{
  "success": false,
  "status": 400,
  "message": "Erro de validação",
  "details": [
    {
      "field": "email",
      "message": "Email inválido",
      "value": "email-invalido"
    },
    {
      "field": "senha",
      "message": "Senha deve ter no mínimo 6 caracteres",
      "value": "123"
    }
  ]
}
```

**Token não fornecido (401):**
```json
{
  "success": false,
  "status": 401,
  "message": "Token não fornecido",
  "details": {
    "hint": "Inclua o header: Authorization: Bearer <seu_token>"
  }
}
```

**Token inválido/expirado (401):**
```json
{
  "success": false,
  "status": 401,
  "message": "Token expirado"
}
```

**Sem permissão (403):**
```json
{
  "success": false,
  "status": 403,
  "message": "Você não tem permissão para acessar este recurso"
}
```

**Recurso não encontrado (404):**
```json
{
  "success": false,
  "status": 404,
  "message": "Categoria não encontrada"
}
```

**Rota não encontrada (404):**
```json
{
  "success": false,
  "status": 404,
  "message": "Rota não encontrada: GET /api/rota-invalida"
}
```

**Conflito (409):**
```json
{
  "success": false,
  "status": 409,
  "message": "Categoria já existe"
}
```

**Erro interno (500):**
```json
{
  "success": false,
  "status": 500,
  "message": "Erro interno do servidor"
}
```

---

## 🔢 Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem-sucedida |
| 201 | Created - Recurso criado com sucesso |
| 204 | No Content - Recurso excluído com sucesso |
| 400 | Bad Request - Erro de validação ou dados inválidos |
| 401 | Unauthorized - Não autenticado (token ausente/inválido) |
| 403 | Forbidden - Sem permissão para acessar o recurso |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito (ex: email já cadastrado) |
| 500 | Internal Server Error - Erro interno do servidor |

---

## 🛡️ Rotas Protegidas

As seguintes rotas requerem autenticação via token JWT:

### Pessoas
- `PUT /api/pessoas/:id` - Atualizar (apenas próprio usuário)
- `DELETE /api/pessoas/:id` - Excluir (apenas próprio usuário)

### Oportunidades
- `POST /api/oportunidades` - Criar
- `PUT /api/oportunidades/:id` - Atualizar
- `DELETE /api/oportunidades/:id` - Excluir

### Interesses
- `POST /api/interesses` - Criar
- `PUT /api/interesses/:id` - Atualizar
- `DELETE /api/interesses/:id` - Excluir

---

## 📝 Exemplos de Uso com cURL

### Login
```bash
curl -X POST http://localhost:3000/api/pessoas/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@exemplo.com",
    "senha": "senha123"
  }'
```

### Criar oportunidade (com autenticação)
```bash
curl -X POST http://localhost:3000/api/oportunidades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_JWT" \
  -d '{
    "titulo": "Vaga de Desenvolvedor",
    "descricao": "Descrição da vaga aqui...",
    "categoria_id": 1,
    "organizacao_id": 1,
    "tipo": "emprego"
  }'
```

### Listar oportunidades
```bash
curl http://localhost:3000/api/oportunidades
```

---

## 🔍 Observações

1. **Datas**: Use o formato ISO 8601 (YYYY-MM-DD)
2. **URLs**: Devem incluir o protocolo (http:// ou https://)
3. **Tokens JWT**: Válidos por 7 dias (padrão)
4. **Validações**: Campos são validados automaticamente
5. **Senhas**: São hasheadas com bcrypt (10 rounds)
6. **Emails**: São normalizados (lowercase, trim)

---

**Versão da API:** 1.0.0  
**Última atualização:** 23 de novembro de 2025
