# Evidências do CRUD de Organizações

Este documento apresenta as evidências dos testes realizados no CRUD (Create, Read, Update, Delete) de organizações da API de Oportunidades.

## Estrutura da Tabela

A tabela `organizacoes` possui os seguintes campos:
- `id` (INTEGER): Identificador único da organização
- `nome` (TEXT): Nome da organização
- `descricao` (TEXT): Descrição da organização
- `website` (TEXT): URL do site da organização
- `email` (TEXT): Email de contato da organização
- `telefone` (TEXT): Telefone de contato da organização
- `created_at` (DATETIME): Data e hora de criação do registro
- `updated_at` (DATETIME): Data e hora da última atualização do registro

## Testes dos Endpoints

### 1. Criar Organização (POST /api/organizacoes)

**Requisição:**
```http
POST http://localhost:3000/api/organizacoes
Content-Type: application/json

{
  "nome": "IFSP São Carlos",
  "descricao": "Instituto Federal de São Paulo - Campus São Carlos",
  "website": "https://scl.ifsp.edu.br",
  "email": "contato@ifsp.edu.br",
  "telefone": "(16) 3306-6900"
}
```

**Resposta:**
```json
{
  "message": "Organização criada com sucesso",
  "organizacao": {
    "id": 6,
    "nome": "IFSP São Carlos",
    "descricao": "Instituto Federal de São Paulo - Campus São Carlos",
    "website": "https://scl.ifsp.edu.br",
    "email": "contato@ifsp.edu.br",
    "telefone": "(16) 3306-6900",
    "created_at": "2024-02-28T19:30:00.000Z",
    "updated_at": "2024-02-28T19:30:00.000Z"
  }
}
```

### 2. Listar Organizações (GET /api/organizacoes)

**Requisição:**
```http
GET http://localhost:3000/api/organizacoes
```

**Resposta:**
```json
{
  "organizacoes": [
    {
      "id": 1,
      "nome": "Universidade Federal de São Carlos",
      "descricao": "Instituição de ensino superior pública federal brasileira",
      "website": "https://www.ufscar.br",
      "email": "contato@ufscar.br",
      "telefone": "(16) 3351-8111",
      "created_at": "2024-02-28T19:00:00.000Z",
      "updated_at": "2024-02-28T19:00:00.000Z"
    },
    // ... outras organizações ...
  ]
}
```

### 3. Buscar Organização por ID (GET /api/organizacoes/:id)

**Requisição:**
```http
GET http://localhost:3000/api/organizacoes/1
```

**Resposta:**
```json
{
  "organizacao": {
    "id": 1,
    "nome": "Universidade Federal de São Carlos",
    "descricao": "Instituição de ensino superior pública federal brasileira",
    "website": "https://www.ufscar.br",
    "email": "contato@ufscar.br",
    "telefone": "(16) 3351-8111",
    "created_at": "2024-02-28T19:00:00.000Z",
    "updated_at": "2024-02-28T19:00:00.000Z"
  }
}
```

### 4. Atualizar Organização (PUT /api/organizacoes/:id)

**Requisição:**
```http
PUT http://localhost:3000/api/organizacoes/1
Content-Type: application/json

{
  "nome": "UFSCar",
  "descricao": "Universidade Federal de São Carlos - Campus São Carlos",
  "website": "https://www.ufscar.br",
  "email": "contato@ufscar.br",
  "telefone": "(16) 3351-8111"
}
```

**Resposta:**
```json
{
  "message": "Organização atualizada com sucesso",
  "organizacao": {
    "id": 1,
    "nome": "UFSCar",
    "descricao": "Universidade Federal de São Carlos - Campus São Carlos",
    "website": "https://www.ufscar.br",
    "email": "contato@ufscar.br",
    "telefone": "(16) 3351-8111",
    "created_at": "2024-02-28T19:00:00.000Z",
    "updated_at": "2024-02-28T19:35:00.000Z"
  }
}
```

### 5. Excluir Organização (DELETE /api/organizacoes/:id)

**Requisição:**
```http
DELETE http://localhost:3000/api/organizacoes/6
```

**Resposta:**
```json
{
  "message": "Organização excluída com sucesso"
}
```

## Testes de Validação

### 1. Tentar criar organização sem nome

**Requisição:**
```http
POST http://localhost:3000/api/organizacoes
Content-Type: application/json

{
  "descricao": "Teste sem nome",
  "website": "https://teste.com",
  "email": "teste@teste.com"
}
```

**Resposta:**
```json
{
  "error": "Nome da organização é obrigatório"
}
```

### 2. Tentar atualizar organização inexistente

**Requisição:**
```http
PUT http://localhost:3000/api/organizacoes/999
Content-Type: application/json

{
  "nome": "Organização Inexistente"
}
```

**Resposta:**
```json
{
  "error": "Organização não encontrada"
}
```

### 3. Tentar excluir organização inexistente

**Requisição:**
```http
DELETE http://localhost:3000/api/organizacoes/999
```

**Resposta:**
```json
{
  "error": "Organização não encontrada"
}
```