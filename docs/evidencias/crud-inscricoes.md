# CRUD - Inscrições

Este documento descreve as operações CRUD (Create, Read, Update, Delete) disponíveis para o recurso de Inscrições na API.

## Criar Inscrição

**Endpoint:** POST `/api/inscricoes`

Cria uma nova inscrição para uma pessoa em uma oportunidade.

### Requisição

```json
{
  "pessoa_id": 1,
  "oportunidade_id": 1,
  "mensagem": "Tenho interesse nesta oportunidade e gostaria de me candidatar."
}
```

### Resposta (201 Created)

```json
{
  "id": 1,
  "pessoa_id": 1,
  "oportunidade_id": 1,
  "mensagem": "Tenho interesse nesta oportunidade e gostaria de me candidatar.",
  "status": "pendente",
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:00:00.000Z"
}
```

### Possíveis Erros

- 404: Pessoa ou oportunidade não encontrada
- 400: Inscrição já existe
- 500: Erro interno do servidor

## Listar Inscrições por Pessoa

**Endpoint:** GET `/api/inscricoes/pessoa/{pessoa_id}`

Retorna todas as inscrições feitas por uma pessoa específica.

### Resposta (200 OK)

```json
[
  {
    "id": 1,
    "pessoa_id": 1,
    "oportunidade_id": 1,
    "mensagem": "Tenho interesse nesta oportunidade...",
    "status": "pendente",
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z",
    "oportunidade_titulo": "Estágio em Desenvolvimento Web",
    "oportunidade_descricao": "Oportunidade de estágio para estudantes..."
  }
]
```

### Possíveis Erros

- 500: Erro interno do servidor

## Listar Inscrições por Oportunidade

**Endpoint:** GET `/api/inscricoes/oportunidade/{oportunidade_id}`

Retorna todas as inscrições feitas para uma oportunidade específica.

### Resposta (200 OK)

```json
[
  {
    "id": 1,
    "pessoa_id": 1,
    "oportunidade_id": 1,
    "mensagem": "Tenho interesse nesta oportunidade...",
    "status": "pendente",
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z",
    "pessoa_nome": "Ana Silva",
    "pessoa_email": "ana.silva@email.com"
  }
]
```

### Possíveis Erros

- 500: Erro interno do servidor

## Atualizar Status da Inscrição

**Endpoint:** PATCH `/api/inscricoes/{id}/status`

Atualiza o status de uma inscrição específica.

### Requisição

```json
{
  "status": "aprovada"
}
```

Status permitidos:
- pendente
- aprovada
- rejeitada

### Resposta (200 OK)

```json
{
  "id": 1,
  "pessoa_id": 1,
  "oportunidade_id": 1,
  "mensagem": "Tenho interesse nesta oportunidade...",
  "status": "aprovada",
  "created_at": "2024-01-01T10:00:00.000Z",
  "updated_at": "2024-01-01T10:30:00.000Z"
}
```

### Possíveis Erros

- 404: Inscrição não encontrada
- 400: Status inválido
- 500: Erro interno do servidor

## Cancelar Inscrição

**Endpoint:** DELETE `/api/inscricoes/{id}`

Remove uma inscrição específica.

### Resposta (204 No Content)

Não retorna conteúdo.

### Possíveis Erros

- 404: Inscrição não encontrada
- 500: Erro interno do servidor

## Exemplos de Uso

### Criar uma Inscrição

```http
POST /api/inscricoes
Content-Type: application/json

{
  "pessoa_id": 1,
  "oportunidade_id": 1,
  "mensagem": "Tenho interesse nesta oportunidade e gostaria de me candidatar."
}
```

### Listar Inscrições de uma Pessoa

```http
GET /api/inscricoes/pessoa/1
```

### Listar Inscrições de uma Oportunidade

```http
GET /api/inscricoes/oportunidade/1
```

### Atualizar Status de uma Inscrição

```http
PATCH /api/inscricoes/1/status
Content-Type: application/json

{
  "status": "aprovada"
}
```

### Cancelar uma Inscrição

```http
DELETE /api/inscricoes/1
```