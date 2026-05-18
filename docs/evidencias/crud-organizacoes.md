# Evidências - CRUD Organizações

Este documento apresenta as evidências de testes realizados nos endpoints de Organizações da API Oportunidades.

## 📌 Endpoints Testados

### 1. Listar Todas as Organizações
```http
GET http://localhost:3000/api/organizacoes
```
**Resposta (200 OK)**
```json
[
    {
        "id": 1,
        "nome": "Centro de Capacitação Profissional",
        "descricao": "Instituição focada em capacitação profissional gratuita para jovens de baixa renda",
        "email": "contato@centrocap.org.br",
        "telefone": "(11) 3333-4444",
        "website": "www.centrocap.org.br",
        "endereco": "Rua da Capacitação, 100 - Centro",
        "created_at": "2025-11-03T10:00:00.000Z"
    },
    {
        "id": 2,
        "nome": "Instituto Oportunidade Social",
        "descricao": "ONG dedicada à inclusão social através da educação e trabalho",
        "email": "contato@ios.org.br",
        "telefone": "(11) 2222-3333",
        "website": "www.ios.org.br",
        "endereco": "Av. da Oportunidade, 500 - Vila Nova"
    }
]
```

### 2. Buscar Organização por ID
```http
GET http://localhost:3000/api/organizacoes/1
```
**Resposta (200 OK)**
```json
{
    "id": 1,
    "nome": "Centro de Capacitação Profissional",
    "descricao": "Instituição focada em capacitação profissional gratuita para jovens de baixa renda",
    "email": "contato@centrocap.org.br",
    "telefone": "(11) 3333-4444",
    "website": "www.centrocap.org.br",
    "endereco": "Rua da Capacitação, 100 - Centro",
    "created_at": "2025-11-03T10:00:00.000Z",
    "updated_at": "2025-11-03T10:00:00.000Z"
}
```

### 3. Criar Nova Organização
```http
POST http://localhost:3000/api/organizacoes
Content-Type: application/json

{
    "nome": "Instituto de Tecnologia Social",
    "descricao": "ONG focada em ensino de programação para jovens",
    "email": "contato@its.org.br",
    "telefone": "(11) 2222-3333",
    "website": "www.its.org.br",
    "endereco": "Av. da Tecnologia, 200 - Centro"
}
```
**Resposta (201 Created)**
```json
{
    "id": 3,
    "nome": "Instituto de Tecnologia Social",
    "descricao": "ONG focada em ensino de programação para jovens",
    "email": "contato@its.org.br",
    "telefone": "(11) 2222-3333",
    "website": "www.its.org.br",
    "endereco": "Av. da Tecnologia, 200 - Centro",
    "created_at": "2025-11-03T14:30:00.000Z"
}
```

**Erro - Email Duplicado (400 Bad Request)**
```http
POST http://localhost:3000/api/organizacoes
Content-Type: application/json

{
    "nome": "Outro Instituto",
    "email": "contato@its.org.br"
}
```
```json
{
    "erro": "Já existe uma organização com este email"
}
```

### 4. Atualizar Organização
```http
PUT http://localhost:3000/api/organizacoes/3
Content-Type: application/json

{
    "nome": "Instituto de Tecnologia Social - ITS",
    "descricao": "ONG focada em ensino de programação e tecnologia para jovens",
    "telefone": "(11) 2222-4444"
}
```
**Resposta (200 OK)**
```json
{
    "id": 3,
    "nome": "Instituto de Tecnologia Social - ITS",
    "descricao": "ONG focada em ensino de programação e tecnologia para jovens",
    "email": "contato@its.org.br",
    "telefone": "(11) 2222-4444",
    "website": "www.its.org.br",
    "endereco": "Av. da Tecnologia, 200 - Centro",
    "updated_at": "2025-11-03T14:35:00.000Z"
}
```

### 5. Excluir Organização
```http
DELETE http://localhost:3000/api/organizacoes/3
```
**Resposta (204 No Content)**

**Erro - Organização com Oportunidades (400 Bad Request)**
```http
DELETE http://localhost:3000/api/organizacoes/1
```
```json
{
    "erro": "Não é possível excluir a organização pois existem oportunidades vinculadas"
}
```

## ✅ Validações Testadas

1. ✓ Email único por organização
2. ✓ Campos obrigatórios: nome, email
3. ✓ Formato válido de email
4. ✓ Formato válido de telefone
5. ✓ URL válida para website
6. ✓ Não permite exclusão com oportunidades vinculadas
7. ✓ Sanitização de dados de entrada
8. ✓ Atualização parcial permitida

## 📊 Resultados

Todos os endpoints do CRUD de Organizações foram testados com sucesso, incluindo:
- Operações básicas (GET, POST, PUT, DELETE)
- Validações de dados
- Tratamento de erros
- Respostas com códigos HTTP apropriados
- Relacionamentos (proteção contra exclusão com dependências)
- Campos opcionais (website, descrição)
- Atualizações parciais