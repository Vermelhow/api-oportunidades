# Evidências - CRUD Pessoas

Este documento apresenta as evidências de testes realizados nos endpoints de Pessoas da API Oportunidades.

## 📌 Endpoints Testados

### 1. Listar Todas as Pessoas
```http
GET http://localhost:3000/api/pessoas
```
**Resposta (200 OK)**
```json
[
    {
        "id": 1,
        "nome": "Maria da Silva",
        "email": "maria.silva@email.com",
        "bio": "Jovem de 19 anos buscando primeira oportunidade profissional",
        "linkedin_url": "linkedin.com/in/mariasilva",
        "telefone": "(11) 98888-7777",
        "created_at": "2025-11-03T10:00:00.000Z"
    },
    {
        "id": 2,
        "nome": "João Santos",
        "email": "joao.santos@email.com",
        "bio": "Estudante de TI buscando estágio",
        "linkedin_url": "linkedin.com/in/joaosantos",
        "telefone": "(11) 97777-8888"
    }
]
```

### 2. Buscar Pessoa por ID
```http
GET http://localhost:3000/api/pessoas/1
```
**Resposta (200 OK)**
```json
{
    "id": 1,
    "nome": "Maria da Silva",
    "email": "maria.silva@email.com",
    "bio": "Jovem de 19 anos buscando primeira oportunidade profissional",
    "linkedin_url": "linkedin.com/in/mariasilva",
    "telefone": "(11) 98888-7777",
    "created_at": "2025-11-03T10:00:00.000Z",
    "updated_at": "2025-11-03T10:00:00.000Z"
}
```

### 3. Criar Nova Pessoa
```http
POST http://localhost:3000/api/pessoas
Content-Type: application/json

{
    "nome": "Ana Oliveira",
    "email": "ana.oliveira@email.com",
    "bio": "Profissional em transição de carreira buscando oportunidades em TI",
    "linkedin_url": "linkedin.com/in/anaoliveira",
    "telefone": "(11) 96666-5555"
}
```
**Resposta (201 Created)**
```json
{
    "id": 3,
    "nome": "Ana Oliveira",
    "email": "ana.oliveira@email.com",
    "bio": "Profissional em transição de carreira buscando oportunidades em TI",
    "linkedin_url": "linkedin.com/in/anaoliveira",
    "telefone": "(11) 96666-5555",
    "created_at": "2025-11-03T14:30:00.000Z"
}
```

**Erro - Email Duplicado (400 Bad Request)**
```http
POST http://localhost:3000/api/pessoas
Content-Type: application/json

{
    "nome": "Ana Silva",
    "email": "ana.oliveira@email.com"
}
```
```json
{
    "erro": "Email já cadastrado"
}
```

### 4. Atualizar Pessoa
```http
PUT http://localhost:3000/api/pessoas/3
Content-Type: application/json

{
    "bio": "Profissional em transição de carreira buscando oportunidades em Desenvolvimento Web",
    "linkedin_url": "linkedin.com/in/anaoliveira-dev"
}
```
**Resposta (200 OK)**
```json
{
    "id": 3,
    "nome": "Ana Oliveira",
    "email": "ana.oliveira@email.com",
    "bio": "Profissional em transição de carreira buscando oportunidades em Desenvolvimento Web",
    "linkedin_url": "linkedin.com/in/anaoliveira-dev",
    "telefone": "(11) 96666-5555",
    "updated_at": "2025-11-03T14:35:00.000Z"
}
```

### 5. Excluir Pessoa
```http
DELETE http://localhost:3000/api/pessoas/3
```
**Resposta (204 No Content)**

**Erro - Pessoa com Interesses (400 Bad Request)**
```http
DELETE http://localhost:3000/api/pessoas/1
```
```json
{
    "erro": "Não é possível excluir a pessoa pois existem interesses vinculados"
}
```

## ✅ Validações Testadas

1. ✓ Email único por pessoa
2. ✓ Campos obrigatórios: nome, email
3. ✓ Formato válido de email
4. ✓ Formato válido de telefone
5. ✓ URL válida para LinkedIn
6. ✓ Não permite exclusão com interesses vinculados
7. ✓ Sanitização de dados de entrada
8. ✓ Atualização parcial permitida

## 📊 Resultados

Todos os endpoints do CRUD de Pessoas foram testados com sucesso, incluindo:
- Operações básicas (GET, POST, PUT, DELETE)
- Validações de dados
- Tratamento de erros
- Respostas com códigos HTTP apropriados
- Relacionamentos (proteção contra exclusão com dependências)
- Campos opcionais (bio, linkedin_url, telefone)
- Atualizações parciais