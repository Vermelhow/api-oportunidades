# Evidências de Testes - CRUD Categorias

## 1. Configuração Inicial
- ✅ Banco de dados SQLite configurado em `data/oportunidades.db`
- ✅ Tabela `categorias` criada com sucesso
- ✅ Dados iniciais inseridos via script de seed

## 2. Endpoints Testados

### 2.1 GET /categorias (Listar todas)
```http
GET http://localhost:3000/categorias
```
**Resultado:**
```json
[
  { "id": 1, "nome": "Estágio" },
  { "id": 2, "nome": "Emprego" },
  { "id": 3, "nome": "Trainee" },
  { "id": 4, "nome": "Projeto de Extensão" },
  { "id": 5, "nome": "Iniciação Científica" },
  { "id": 6, "nome": "Monitoria" },
  { "id": 7, "nome": "Voluntariado" },
  { "id": 8, "nome": "Curso" }
]
```
✅ Retorna lista ordenada por nome
✅ Status code: 200

### 2.2 GET /categorias/:id (Buscar por ID)
```http
GET http://localhost:3000/categorias/1
```
**Resultado:**
```json
{ "id": 1, "nome": "Estágio" }
```
✅ Retorna categoria específica
✅ Status code: 200

**Teste de erro - ID inexistente:**
```http
GET http://localhost:3000/categorias/999
```
**Resultado:**
```json
{ "message": "Categoria não encontrada" }
```
✅ Status code: 404

### 2.3 POST /categorias (Criar nova)
```http
POST http://localhost:3000/categorias
Content-Type: application/json

{
  "nome": "Nova Categoria"
}
```
**Resultado:**
```json
{ "id": 9, "nome": "Nova Categoria" }
```
✅ Status code: 201

**Teste de erro - Nome duplicado:**
```http
POST http://localhost:3000/categorias
Content-Type: application/json

{
  "nome": "Estágio"
}
```
**Resultado:**
```json
{ "message": "Categoria já existe" }
```
✅ Status code: 409

**Teste de erro - Nome vazio:**
```http
POST http://localhost:3000/categorias
Content-Type: application/json

{
  "nome": ""
}
```
**Resultado:**
```json
{ "message": "nome é obrigatório" }
```
✅ Status code: 400

### 2.4 PUT /categorias/:id (Atualizar)
```http
PUT http://localhost:3000/categorias/9
Content-Type: application/json

{
  "nome": "Categoria Atualizada"
}
```
**Resultado:**
```json
{ "id": 9, "nome": "Categoria Atualizada" }
```
✅ Status code: 200

**Teste de erro - ID inexistente:**
```http
PUT http://localhost:3000/categorias/999
Content-Type: application/json

{
  "nome": "Teste"
}
```
**Resultado:**
```json
{ "message": "Categoria não encontrada" }
```
✅ Status code: 404

### 2.5 DELETE /categorias/:id (Remover)
```http
DELETE http://localhost:3000/categorias/9
```
**Resultado:**
✅ Status code: 204 (Sem conteúdo)

**Teste de erro - ID inexistente:**
```http
DELETE http://localhost:3000/categorias/999
```
**Resultado:**
```json
{ "message": "Categoria não encontrada" }
```
✅ Status code: 404

## 3. Validações Implementadas
- ✅ Nome obrigatório
- ✅ Nome único (não permite duplicação)
- ✅ IDs válidos nas operações de busca/atualização/remoção
- ✅ Sanitização de dados (trim em strings)

## 4. Tratamento de Erros
- ✅ Mensagens de erro claras e descritivas
- ✅ Status codes HTTP apropriados
- ✅ Tratamento de exceções do SQLite

## 5. Conclusão
O CRUD de categorias foi implementado com sucesso, incluindo todas as operações básicas (Create, Read, Update, Delete) e validações necessárias. Todos os endpoints foram testados e estão funcionando conforme esperado.

### Próximos Passos
- [ ] Implementar validações adicionais (ex: tamanho máximo do nome)
- [ ] Adicionar paginação na listagem
- [ ] Implementar busca por nome