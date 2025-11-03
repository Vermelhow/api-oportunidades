# Evidências - CRUD Oportunidades

Este documento apresenta as evidências de testes realizados nos endpoints de Oportunidades da API Oportunidades.

## 📌 Endpoints Testados

### 1. Listar Todas as Oportunidades
```http
GET http://localhost:3000/api/oportunidades
```
**Resposta (200 OK)**
```json
[
    {
        "id": 1,
        "titulo": "Curso Gratuito de Auxiliar Administrativo",
        "descricao": "Curso completo de Auxiliar Administrativo com certificado",
        "categoria_id": 1,
        "organizacao_id": 1,
        "tipo": "curso",
        "status": "ativa",
        "data_inicio": "2025-12-01",
        "data_fim": "2026-02-28",
        "requisitos": "Idade mínima 16 anos, Ensino Fundamental completo",
        "beneficios": "Certificado reconhecido pelo MEC, Material didático",
        "salario_min": null,
        "formato": "presencial",
        "localizacao": "SENAI Unidade Centro",
        "link_inscricao": "www.senai.org.br/auxiliar-administrativo",
        "categoria": {
            "id": 1,
            "nome": "Cursos Gratuitos"
        },
        "organizacao": {
            "id": 1,
            "nome": "Centro de Capacitação Profissional"
        }
    }
]
```

### 2. Buscar Oportunidade por ID
```http
GET http://localhost:3000/api/oportunidades/1
```
**Resposta (200 OK)**
```json
{
    "id": 1,
    "titulo": "Curso Gratuito de Auxiliar Administrativo",
    "descricao": "Curso completo de Auxiliar Administrativo com certificado",
    "categoria_id": 1,
    "organizacao_id": 1,
    "tipo": "curso",
    "status": "ativa",
    "data_inicio": "2025-12-01",
    "data_fim": "2026-02-28",
    "requisitos": "Idade mínima 16 anos, Ensino Fundamental completo",
    "beneficios": "Certificado reconhecido pelo MEC, Material didático",
    "formato": "presencial",
    "localizacao": "SENAI Unidade Centro",
    "link_inscricao": "www.senai.org.br/auxiliar-administrativo",
    "categoria": {
        "id": 1,
        "nome": "Cursos Gratuitos"
    },
    "organizacao": {
        "id": 1,
        "nome": "Centro de Capacitação Profissional",
        "email": "contato@centrocap.org.br"
    }
}
```

### 3. Criar Nova Oportunidade
```http
POST http://localhost:3000/api/oportunidades
Content-Type: application/json

{
    "titulo": "Programa de Estágio em TI",
    "descricao": "Oportunidade para estudantes de TI",
    "categoria_id": 3,
    "organizacao_id": 1,
    "tipo": "estagio",
    "status": "ativa",
    "data_inicio": "2026-01-15",
    "data_fim": "2026-07-15",
    "requisitos": "Cursando TI, conhecimento básico em programação",
    "beneficios": "Bolsa R$ 1.800,00, VT, VR, Plano de Saúde",
    "salario_min": 1800.00,
    "formato": "hibrido",
    "localizacao": "Centro de Capacitação - Unidade TI",
    "link_inscricao": "www.centrocap.org.br/estagio-ti"
}
```
**Resposta (201 Created)**
```json
{
    "id": 2,
    "titulo": "Programa de Estágio em TI",
    "descricao": "Oportunidade para estudantes de TI",
    "categoria_id": 3,
    "organizacao_id": 1,
    "tipo": "estagio",
    "status": "ativa",
    "data_inicio": "2026-01-15",
    "data_fim": "2026-07-15",
    "requisitos": "Cursando TI, conhecimento básico em programação",
    "beneficios": "Bolsa R$ 1.800,00, VT, VR, Plano de Saúde",
    "salario_min": 1800.00,
    "formato": "hibrido",
    "localizacao": "Centro de Capacitação - Unidade TI",
    "link_inscricao": "www.centrocap.org.br/estagio-ti",
    "created_at": "2025-11-03T14:30:00.000Z"
}
```

### 4. Atualizar Oportunidade
```http
PUT http://localhost:3000/api/oportunidades/2
Content-Type: application/json

{
    "status": "encerrada",
    "data_fim": "2025-11-30"
}
```
**Resposta (200 OK)**
```json
{
    "id": 2,
    "titulo": "Programa de Estágio em TI",
    "status": "encerrada",
    "data_fim": "2025-11-30",
    "updated_at": "2025-11-03T14:35:00.000Z"
}
```

### 5. Excluir Oportunidade
```http
DELETE http://localhost:3000/api/oportunidades/2
```
**Resposta (204 No Content)**

**Erro - Oportunidade com Interesses (400 Bad Request)**
```http
DELETE http://localhost:3000/api/oportunidades/1
```
```json
{
    "erro": "Não é possível excluir a oportunidade pois existem interesses cadastrados"
}
```

## 🔍 Filtros Testados

### Filtrar por Categoria
```http
GET http://localhost:3000/api/oportunidades?categoria=1
```

### Filtrar por Tipo
```http
GET http://localhost:3000/api/oportunidades?tipo=curso
```

### Filtrar por Status
```http
GET http://localhost:3000/api/oportunidades?status=ativa
```

### Filtrar por Formato
```http
GET http://localhost:3000/api/oportunidades?formato=presencial
```

### Busca por Texto
```http
GET http://localhost:3000/api/oportunidades?q=administrativo
```

## ✅ Validações Testadas

1. ✓ Campos obrigatórios preenchidos
2. ✓ Categoria existe
3. ✓ Organização existe
4. ✓ Tipo válido (curso, emprego, estagio, evento, projeto)
5. ✓ Status válido (ativa, encerrada, pausada)
6. ✓ Formato válido (presencial, remoto, hibrido)
7. ✓ Data início < Data fim
8. ✓ Salário mínimo > 0
9. ✓ Link de inscrição válido
10. ✓ Não permite exclusão com interesses vinculados

## 📊 Resultados

Todos os endpoints do CRUD de Oportunidades foram testados com sucesso, incluindo:
- Operações básicas (GET, POST, PUT, DELETE)
- Validações de dados
- Relacionamentos (Categoria, Organização)
- Filtros e buscas
- Tratamento de erros
- Respostas com códigos HTTP apropriados
- Proteção contra exclusão com dependências