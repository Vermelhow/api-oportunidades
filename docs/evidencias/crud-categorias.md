# Evidências - CRUD Categorias

Este documento apresenta as evidências de testes realizados nos endpoints de Categorias da API Oportunidades.

## 📌 Endpoints Testados

### 1. Listar Todas as Categorias
```http
GET http://localhost:3000/api/categorias
```
**Resposta (200 OK)**
```json
[
    {
        "id": 1,
        "nome": "Cursos Gratuitos"
    },
    {
        "id": 2,
        "nome": "Vagas de Emprego"
    },
    {
        "id": 3,
        "nome": "Estágios"
    },
    {
        "id": 4,
        "nome": "Projetos Sociais"
    },
    {
        "id": 5,
        "nome": "Eventos Comunitários"
    }
]
```

### 2. Buscar Categoria por ID
```http
GET http://localhost:3000/api/categorias/1
```
**Resposta (200 OK)**
```json
{
    "id": 1,
    "nome": "Cursos Gratuitos"
}
```

**Caso não encontrado (404 Not Found)**
```json
{
    "erro": "Categoria não encontrada"
}
```

### 3. Criar Nova Categoria
```http
POST http://localhost:3000/api/categorias
Content-Type: application/json

{
    "nome": "Jovem Aprendiz"
}
```
**Resposta (201 Created)**
```json
{
    "id": 6,
    "nome": "Jovem Aprendiz",
    "created_at": "2025-11-03T14:30:00.000Z"
}
```

**Erro - Nome Duplicado (400 Bad Request)**
```http
POST http://localhost:3000/api/categorias
Content-Type: application/json

{
    "nome": "Cursos Gratuitos"
}
```
```json
{
    "erro": "Já existe uma categoria com este nome"
}
```

### 4. Atualizar Categoria
```http
PUT http://localhost:3000/api/categorias/4
Content-Type: application/json

{
    "nome": "Projetos Sociais e Voluntariado"
}
```
**Resposta (200 OK)**
```json
{
    "id": 4,
    "nome": "Projetos Sociais e Voluntariado",
    "updated_at": "2025-11-03T14:35:00.000Z"
}
```

### 5. Excluir Categoria
```http
DELETE http://localhost:3000/api/categorias/6
```
**Resposta (204 No Content)**

**Erro - Categoria com Oportunidades (400 Bad Request)**
```http
DELETE http://localhost:3000/api/categorias/1
```
```json
{
    "erro": "Não é possível excluir a categoria pois existem oportunidades vinculadas"
}
```

## ✅ Validações Testadas

1. ✓ Não permite nomes duplicados
2. ✓ Nome é obrigatório
3. ✓ Não permite exclusão de categoria com oportunidades vinculadas
4. ✓ Retorna 404 para ID inexistente
5. ✓ Sanitização de dados de entrada

## 📊 Resultados

Todos os endpoints do CRUD de Categorias foram testados com sucesso, incluindo:
- Operações básicas (GET, POST, PUT, DELETE)
- Validações de dados
- Tratamento de erros
- Respostas com códigos HTTP apropriados
- Relacionamentos (proteção contra exclusão com dependências)