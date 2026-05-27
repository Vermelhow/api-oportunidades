# 📸 Screenshots - Sistema de Gerenciamento de Organizações

**Data:** 02/06/2026  
**Sistema:** API Oportunidades - Módulo Organizações  
**Versão:** 1.0.0

---

## 📋 Índice de Evidências

### 1. [01-listagem-organizacoes.png](01-listagem-organizacoes.png)
**Listagem de Organizações - Interface Completa**

**Funcionalidades visíveis:**
- ✅ **Header administrativo** com título e botão de ação
- ✅ **Botão "➕ Nova Organização"** em destaque
- ✅ **Barra de busca** com ícone de lupa
  - Placeholder: "Buscar por nome, descrição ou email..."
  - Botão limpar (✕) quando há texto
- ✅ **Contador de resultados**: "4 organizações cadastradas"
- ✅ **Grid responsivo** com cards de organizações

**Organizações exibidas:**
1. **Instituto Code+**
   - Descrição: "Instituto de ensino de programação"
   - 📧 contato@codeplus.org
   - 🌐 Website (link para https://codeplus.org)
   - Botões: 👁️ Ver | ✏️ Editar | 🗑️ Excluir

2. **ONG Praia Limpa**
   - Descrição: "Organização focada em preservação ambiental"
   - 📧 contato@praialimpa.ong.br
   - 🌐 Website (link para https://praialimpa.ong.br)
   - Botões: 👁️ Ver | ✏️ Editar | 🗑️ Excluir

3. **Secretaria Municipal de Saúde**
   - Descrição: "Órgão público responsável pela saúde municipal"
   - 📧 saude@santos.sp.gov.br
   - 🌐 Website (link para https://santos.sp.gov.br/saude)
   - Botões: 👁️ Ver | ✏️ Editar | 🗑️ Excluir

4. **TechCorp Solutions**
   - Descrição: "Empresa de desenvolvimento de software"
   - 📧 contato@techcorp.com
   - 🌐 Website (link para https://techcorp.com)
   - Botões: 👁️ Ver | ✏️ Editar | 🗑️ Excluir

**Melhorias implementadas:**
- Design moderno com cards elevados
- Hover effects nos cards
- Layout responsivo com grid
- Ícones descritivos para cada tipo de informação
- Links clicáveis para websites
- Botões de ação bem posicionados

---

### 2. [02-formulario-nova-organizacao.png](02-formulario-nova-organizacao.png)
**Formulário de Cadastro - Estado Vazio**

**Funcionalidades visíveis:**
- ✅ **Título**: "➕ Nova Organização"
- ✅ **Subtítulo**: "Preencha os dados da nova organização"
- ✅ **Botão voltar**: "← Voltar para Lista"

**Seções do formulário:**

**📝 Informações Básicas:**
- ✅ **Nome da Organização** (obrigatório *)
  - Placeholder: "Ex: Fundação XYZ"
- ✅ **Descrição** (opcional)
  - Textarea com placeholder descritivo
  - Hint: "Mínimo 10 caracteres (opcional)"

**📞 Informações de Contato:**
- ✅ **Email** (obrigatório *)
  - Placeholder: "contato@organizacao.com.br"
- ✅ **Telefone** (opcional)
  - Placeholder: "(11) 98765-4321"
  - Hint: "Com DDD (opcional)"
- ✅ **Website** (opcional)
  - Placeholder: "https://www.organizacao.com.br"
  - Hint: "URL completa com http:// ou https://"

**📍 Localização:**
- ✅ **Endereço** (opcional)
  - Textarea com placeholder: "Rua, número, complemento, bairro, cidade - UF, CEP"
  - Hint: "Endereço completo (opcional)"

**Botões de ação:**
- ✅ "🔄 Limpar Formulário" (secundário)
- ✅ "✓ Criar Organização" (primário)

**Características:**
- Campos bem organizados em seções
- Labels com asterisco (*) para obrigatórios
- Hints informativos abaixo dos campos
- Layout limpo e espaçado
- Componentes reutilizáveis (FormField)

---

### 3. [03-cadastro-preenchido.png](03-cadastro-preenchido.png)
**Formulário de Cadastro - Preenchido e Funcionando**

**Demonstração de uso:**
Este screenshot mostra o formulário **completamente preenchido** com dados de exemplo, demonstrando que o sistema está **funcionando corretamente**.

**Dados preenchidos:**

**📝 Informações Básicas:**
- ✅ Nome: "Nova Organização Teste"
- ✅ Descrição: "Descrição de teste para demonstrar o funcionamento do sistema de cadastro de organizações"

**📞 Informações de Contato:**
- ✅ Email: "teste@organizacao.com.br"
- ✅ Telefone: "(11) 98765-4321"
- ✅ Website: "https://organizacao.com.br"

**📍 Localização:**
- ✅ Endereço: "Rua Teste, 123 - Centro, Santos - SP, 11000-000"

**Validações ativas:**
- ✅ Todos os campos obrigatórios preenchidos
- ✅ Email com formato válido
- ✅ Telefone com DDD e formato correto
- ✅ URL completa com protocolo https://
- ✅ Descrição com mais de 10 caracteres

**Próximos passos após clicar em "✓ Criar Organização":**
1. Sistema valida os dados (client-side)
2. Envia POST para `/api/organizacoes`
3. Backend valida e salva no banco
4. Toast verde: "Organização criada com sucesso!"
5. Redireciona para `/admin/organizacoes`
6. Nova organização aparece na listagem

---

### 4. [04-integracao-api-relacionamento.png](04-integracao-api-relacionamento.png)
**Integração API + Relacionamento Organização/Oportunidade**

**Funcionalidades visíveis:**
Esta tela demonstra a **integração completa** entre:
- ✅ **API de Organizações** (backend)
- ✅ **Frontend** (React)
- ✅ **Relacionamento** entre Organizações e Oportunidades

**Formulário de Edição de Oportunidade:**
- ✅ Campos do formulário de oportunidade
- ✅ **Dropdown "Organização"** carregado dinamicamente
- ✅ Lista de organizações vinda da API

**Integração demonstrada:**

```
Frontend (React)
    ↓
getOrganizacoes() ← API /api/organizacoes
    ↓
Preenche dropdown <select>
    ↓
Usuário seleciona organização
    ↓
organizacao_id salvo na oportunidade
    ↓
Relacionamento 1:N (Uma organização → Várias oportunidades)
```

**Fluxo técnico:**
1. Formulário carrega → `useEffect()`
2. Chama `getOrganizacoes()` do `api.js`
3. Backend retorna JSON com lista de organizações
4. React popula o `<select>` com as opções
5. Cada opção tem `value={org.id}` e `{org.nome}`
6. Ao salvar, `organizacao_id` é enviado ao backend
7. Backend cria FK (Foreign Key) na tabela `oportunidades`

**Validações:**
- ✅ Campo obrigatório (organização deve ser selecionada)
- ✅ Validação de FK no backend (organização deve existir)
- ✅ Dropdown só mostra organizações ativas

**Benefícios do relacionamento:**
- 📊 Cada oportunidade pertence a uma organização
- 🔍 Possibilidade de filtrar oportunidades por organização
- 📈 Relatórios de oportunidades por organização
- 🔗 Navegação entre organizações e suas oportunidades

---

## 🎯 Resumo das Evidências

| Screenshot | Evidência | Status |
|------------|-----------|--------|
| **01** | Listagem completa funcionando | ✅ Funcional |
| **02** | Formulário vazio pronto para uso | ✅ Funcional |
| **03** | Cadastro preenchido e validado | ✅ Funcional |
| **04** | Integração API + Relacionamento | ✅ Funcional |

---

## 🔄 Fluxo Completo Demonstrado

### 1️⃣ **Listar Organizações**
- Acessa `/admin/organizacoes`
- Backend: `GET /api/organizacoes`
- Retorna JSON com array de organizações
- React renderiza cards

### 2️⃣ **Criar Nova Organização**
- Clica em "➕ Nova Organização"
- Preenche formulário
- Clica em "✓ Criar Organização"
- Backend: `POST /api/organizacoes` + body JSON
- Retorna 201 Created com dados da organização
- Toast: "Organização criada com sucesso!"
- Redireciona para listagem

### 3️⃣ **Relacionar com Oportunidade**
- Acessa edição de oportunidade
- Dropdown carrega organizações via API
- Seleciona organização
- Salva oportunidade com `organizacao_id`
- Relacionamento criado no banco

---

## 🔗 Relacionamento de Dados

### **Modelo de Dados:**

```sql
-- Tabela organizacoes
CREATE TABLE organizacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  descricao TEXT,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  website TEXT,
  endereco TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela oportunidades (relacionamento)
CREATE TABLE oportunidades (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  organizacao_id INTEGER NOT NULL,  -- FK para organizacoes
  ...
  FOREIGN KEY (organizacao_id) REFERENCES organizacoes(id)
);
```

**Tipo de relacionamento:** 1:N (One-to-Many)
- ✅ Uma organização pode ter várias oportunidades
- ✅ Uma oportunidade pertence a apenas uma organização

---

## 📊 Estatísticas da Implementação

| Métrica | Valor |
|---------|-------|
| **Componentes criados** | 2 páginas |
| **Arquivos CSS** | 2 arquivos |
| **Funções API** | 5 (CRUD completo) |
| **Rotas configuradas** | 4 rotas |
| **Linhas de código** | ~1.070 linhas |
| **Organizações de teste** | 4 registros |
| **Tempo de desenvolvimento** | 1 sessão |

---

## ✅ Checklist de Funcionalidades

### **CRUD Completo:**
- [x] Listar organizações (GET)
- [x] Criar organização (POST)
- [x] Buscar por ID (GET /:id)
- [x] Atualizar organização (PUT /:id)
- [x] Excluir organização (DELETE /:id)

### **Interface:**
- [x] Listagem com cards
- [x] Busca em tempo real
- [x] Formulário de criação
- [x] Formulário de edição
- [x] Modal de confirmação
- [x] Toast notifications
- [x] Loading states
- [x] Estado vazio

### **Validações:**
- [x] Nome (mín. 3 caracteres)
- [x] Email (formato válido)
- [x] Telefone (mín. 10 dígitos)
- [x] Website (URL válida)
- [x] Descrição (mín. 10 caracteres)

### **Integração:**
- [x] API backend funcionando
- [x] Frontend consumindo API
- [x] Relacionamento com oportunidades
- [x] Dropdown populado dinamicamente

---

## 🚀 Como Testar

```bash
# 1. Iniciar backend
cd /Volumes/HD\ VERMELHO/FACUL/PROJETOS/api-oportunidades
npm start

# 2. Iniciar frontend (novo terminal)
cd frontend
npm run dev

# 3. Acessar sistema
# Login: http://localhost:5173/login
# Organizações: http://localhost:5173/admin/organizacoes
```

**Credenciais de teste:**
- Email: `joao.silva@email.com`
- Senha: `senha123`

---

## 📝 Observações Técnicas

### **Backend:**
- ✅ Endpoints REST completos
- ✅ Validações no servidor
- ✅ Email único (constraint)
- ✅ SQLite com migrations
- ✅ Tratamento de erros

### **Frontend:**
- ✅ React 18+ com Hooks
- ✅ React Router v6
- ✅ Context API (Auth, Notifications)
- ✅ Componentes reutilizáveis
- ✅ CSS moderno (Grid, Flexbox)
- ✅ Responsividade completa

### **Boas Práticas:**
- ✅ Código comentado
- ✅ Nomenclatura descritiva
- ✅ Separação de concerns
- ✅ DRY (Don't Repeat Yourself)
- ✅ Error boundaries
- ✅ Loading states para UX

---

**Evidências capturadas em:** 02/06/2026 às 21:14  
**Desenvolvedor:** Leandro Mota Leal  
**Projeto:** API Oportunidades - Extensão Universitária

---

## 🔗 Links Relacionados

- [Documentação Completa](../../SISTEMA-ORGANIZACOES.md)
- [Melhorias CRUD Admin](../../MELHORIAS-CRUD-ADMIN.md)
- [Screenshots CRUD Oportunidades](../screenshots-crud/)
