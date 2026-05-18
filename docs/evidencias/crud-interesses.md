# Evidências - CRUD Interesses

Este documento apresenta as evidências de testes realizados nos endpoints de Interesses da API Oportunidades.

## 📌 Endpoints Testados

### 1. Listar Todos os Interesses
```http
GET http://localhost:3000/api/interesses
```
**Resposta (200 OK)**
```json
[
    {
        "id": 1,
        "pessoa_id": 1,
        "oportunidade_id": 1,
        "mensagem": "Tenho muito interesse neste curso para iniciar minha carreira",
        "status": "pendente",
        "created_at": "2025-11-03T10:00:00.000Z",
        "pessoa": {
            "id": 1,
            "nome": "Maria da Silva",
            "email": "maria.silva@email.com"
        },
        "oportunidade": {
            "id": 1,
            "titulo": "Curso Gratuito de Auxiliar Administrativo",
            "tipo": "curso"
        }
    }
]
```

### 2. Buscar Interesse por ID
```http
GET http://localhost:3000/api/interesses/1
```
**Resposta (200 OK)**
```json
{
    "id": 1,
    "pessoa_id": 1,
    "oportunidade_id": 1,
    "mensagem": "Tenho muito interesse neste curso para iniciar minha carreira",
    "status": "pendente",
    "created_at": "2025-11-03T10:00:00.000Z",
    "updated_at": "2025-11-03T10:00:00.000Z",
    "pessoa": {
        "id": 1,
        "nome": "Maria da Silva",
        "email": "maria.silva@email.com"
    },
    "oportunidade": {
        "id": 1,
        "titulo": "Curso Gratuito de Auxiliar Administrativo",
        "tipo": "curso",
        "status": "ativa"
    }
}
```

### 3. Criar Novo Interesse
```http
POST http://localhost:3000/api/interesses
Content-Type: application/json

{
    "pessoa_id": 2,
    "oportunidade_id": 3,
    "mensagem": "Possuo experiência na área e gostaria muito desta oportunidade"
}
```
**Resposta (201 Created)**
```json
{
    "id": 2,
    "pessoa_id": 2,
    "oportunidade_id": 3,
    "mensagem": "Possuo experiência na área e gostaria muito desta oportunidade",
    "status": "pendente",
    "created_at": "2025-11-03T14:30:00.000Z",
    "pessoa": {
        "id": 2,
        "nome": "João Santos"
    },
    "oportunidade": {
        "id": 3,
        "titulo": "Programa de Estágio em TI"
    }
}
```

**Erro - Interesse Duplicado (400 Bad Request)**
```http
POST http://localhost:3000/api/interesses
Content-Type: application/json

{
    "pessoa_id": 2,
    "oportunidade_id": 3,
    "mensagem": "Novo interesse"
}
```
```json
{
    "erro": "Você já demonstrou interesse nesta oportunidade"
}
```

**Erro - Oportunidade Inativa (400 Bad Request)**
```http
POST http://localhost:3000/api/interesses
Content-Type: application/json

{
    "pessoa_id": 1,
    "oportunidade_id": 4,
    "mensagem": "Tenho interesse"
}
```
```json
{
    "erro": "Esta oportunidade não está mais disponível"
}
```

### 4. Atualizar Status do Interesse
```http
PUT http://localhost:3000/api/interesses/2
Content-Type: application/json

{
    "status": "aprovado"
}
```
**Resposta (200 OK)**
```json
{
    "id": 2,
    "status": "aprovado",
    "updated_at": "2025-11-03T14:35:00.000Z",
    "pessoa": {
        "id": 2,
        "nome": "João Santos"
    },
    "oportunidade": {
        "id": 3,
        "titulo": "Programa de Estágio em TI"
    }
}
```

### 5. Excluir Interesse
```http
DELETE http://localhost:3000/api/interesses/2
```
**Resposta (204 No Content)**

## 🔍 Filtros Testados

### Filtrar por Pessoa
```http
GET http://localhost:3000/api/interesses?pessoa_id=1
```

### Filtrar por Oportunidade
```http
GET http://localhost:3000/api/interesses?oportunidade_id=1
```

### Filtrar por Status
```http
GET http://localhost:3000/api/interesses?status=pendente
```

## ✅ Validações Testadas

1. ✓ Pessoa existe e está ativa
2. ✓ Oportunidade existe e está ativa
3. ✓ Não permite interesse duplicado
4. ✓ Status válido (pendente, aprovado, rejeitado, cancelado)
5. ✓ Mensagem opcional
6. ✓ Sanitização de dados de entrada
7. ✓ Atualização de status controlada
8. ✓ Verificação de relacionamentos

## 📊 Resultados

Todos os endpoints do CRUD de Interesses foram testados com sucesso, incluindo:
- Operações básicas (GET, POST, PUT, DELETE)
- Validações de dados
- Relacionamentos (Pessoa, Oportunidade)
- Filtros
- Tratamento de erros
- Respostas com códigos HTTP apropriados
- Controle de status
- Regras de negócio específicas:
  - Não permitir interesse em oportunidade inativa
  - Não permitir interesse duplicado
  - Controle de status do interesse