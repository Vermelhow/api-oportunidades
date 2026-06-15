# 🔍 Guia de Identificação de Problemas Antes da Entrega

## 📋 Objetivo

Este guia ajuda a identificar e corrigir problemas comuns em projetos React/Node.js **antes da entrega final**, evitando surpresas de última hora.

---

## 🚨 Problemas Críticos (Impedem Uso)

### 1. Sistema Não Inicia

#### Sintomas:
- `npm install` falha
- `npm start` ou `npm run dev` dá erro
- Porta já em uso
- Banco de dados não conecta

#### Como Identificar:

```bash
# Teste de instalação limpa
rm -rf node_modules package-lock.json
npm install

# Verifique o output
# Procure por: ERROR, WARN (críticos), dependency issues
```

#### Soluções Comuns:

```bash
# Problema: Porta em uso
# Solução: Mudar porta ou matar processo
lsof -ti:3000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :3000   # Windows

# Problema: Dependências quebradas
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Problema: Versão do Node
node -v  # Verifique se é 18+
nvm use 18  # Se usar nvm
```

#### Prevenção:
- [ ] Documente versão do Node necessária
- [ ] Configure porta via variável de ambiente
- [ ] Teste instalação em máquina limpa
- [ ] Inclua script de verificação de pré-requisitos

---

### 2. Login Não Funciona

#### Sintomas:
- Botão de login não responde
- Credenciais corretas são rejeitadas
- Token não é armazenado
- Redirecionamento não acontece

#### Como Identificar:

```javascript
// Abra DevTools > Console
// Faça login e observe

// Erros comuns:
// - "Network Error" → Backend não está rodando
// - 401 Unauthorized → Credenciais ou endpoint errado
// - 404 Not Found → URL da API incorreta
// - CORS error → Configuração CORS no backend
```

#### Teste Sistemático:

```bash
# 1. Verifique se backend está rodando
curl http://localhost:3000/api/pessoas/login

# 2. Teste login via curl
curl -X POST http://localhost:3000/api/pessoas/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","senha":"123456"}'

# 3. Verifique se retorna token
# Resposta esperada: {"token": "...", "user": {...}}
```

#### Verificações no Código:

```javascript
// frontend/src/services/api.js
// Verifique URL da API
const API_URL = 'http://localhost:3000/api';  // ✅ Correto
const API_URL = 'localhost:3000/api';          // ❌ Falta http://

// Verifique tratamento de resposta
.then(response => {
  localStorage.setItem('token', response.token);  // ✅ Correto
  localStorage.setItem('token', response.data.token);  // ❌ Se API retorna direto
})
```

#### Soluções Comuns:

1. **Backend não rodando**: Inicie com `npm start`
2. **CORS error**: Configure CORS no backend
3. **URL incorreta**: Verifique e corrija em `services/api.js`
4. **Credenciais erradas**: Verifique usuário no banco de dados
5. **Token não salva**: Verifique `localStorage.setItem()`

---

### 3. CRUD Não Funciona

#### Sintomas:
- Listagem vazia mesmo com dados no banco
- Criar oportunidade não salva
- Editar não atualiza
- Excluir não remove

#### Como Identificar:

**Network Tab (DevTools):**

```
1. Abra DevTools > Network
2. Execute a ação (ex: criar oportunidade)
3. Observe:
   - Status Code (200=OK, 201=Criado, 400=Erro, 401=Não autorizado)
   - Response (dados retornados)
   - Request Payload (dados enviados)
```

#### Teste Cada Operação:

**1. READ (Listar):**
```bash
curl http://localhost:3000/api/oportunidades
# Deve retornar array de oportunidades
```

**2. CREATE (Criar):**
```bash
curl -X POST http://localhost:3000/api/oportunidades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"titulo":"Teste","descricao":"Desc","categoria_id":1,"organizacao_id":1}'
# Deve retornar 201 e dados criados
```

**3. UPDATE (Editar):**
```bash
curl -X PUT http://localhost:3000/api/oportunidades/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"titulo":"Teste Editado"}'
# Deve retornar 200 e dados atualizados
```

**4. DELETE (Excluir):**
```bash
curl -X DELETE http://localhost:3000/api/oportunidades/1 \
  -H "Authorization: Bearer SEU_TOKEN"
# Deve retornar 200 ou 204
```

#### Problemas Comuns e Soluções:

| Problema | Causa Provável | Solução |
|----------|----------------|---------|
| 401 Unauthorized | Token não enviado | Verificar header Authorization |
| 400 Bad Request | Dados inválidos | Validar dados antes de enviar |
| 404 Not Found | Endpoint errado | Verificar URL da API |
| 500 Internal Error | Erro no backend | Verificar logs do servidor |
| Listagem vazia | Sem dados no DB | Rodar `npm run seed` |

#### Verificação no Frontend:

```javascript
// Verifique se token está sendo enviado
// frontend/src/services/api.js
headers: {
  'Authorization': `Bearer ${localStorage.getItem('token')}`  // ✅
  'Authorization': localStorage.getItem('token')              // ❌ Falta "Bearer"
}

// Verifique se dados estão no formato correto
const data = {
  titulo: "Teste",          // ✅ String
  categoria_id: 1,          // ✅ Number
  categoria_id: "1",        // ⚠️ Pode dar problema, depende do backend
}
```

---

## ⚠️ Problemas Comuns (Afetam UX)

### 4. Responsividade Quebrada

#### Como Identificar:

```
1. F12 > Toggle Device Toolbar (Ctrl+Shift+M)
2. Teste resoluções:
   - 375px (Mobile)
   - 768px (Tablet)
   - 1920px (Desktop)
3. Observe:
   - Elementos sobrepostos
   - Textos cortados
   - Scroll horizontal
   - Menu não funcional
```

#### Problemas Comuns:

**1. Largura Fixa:**
```css
/* ❌ Evitar */
.container {
  width: 1200px;
}

/* ✅ Usar */
.container {
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
}
```

**2. Fontes Muito Grandes:**
```css
/* ❌ Evitar */
h1 {
  font-size: 48px;
}

/* ✅ Usar */
h1 {
  font-size: clamp(24px, 5vw, 48px);
}
```

**3. Menu Não Adaptado:**
```css
/* Mobile */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  .mobile-menu {
    display: block;
  }
}
```

#### Teste Rápido:

- [ ] Texto legível em mobile sem zoom
- [ ] Botões clicáveis (min 44x44px)
- [ ] Formulários utilizáveis
- [ ] Imagens responsivas
- [ ] Sem scroll horizontal

---

### 5. Erros no Console

#### Como Identificar:

```
1. F12 > Console
2. Navegue pela aplicação
3. Procure por:
   - ❌ Errors (vermelho)
   - ⚠️ Warnings (amarelo)
   - ℹ️ Info (azul - geralmente OK)
```

#### Erros Comuns:

**1. Key prop missing:**
```javascript
// ❌ Erro
{oportunidades.map(op => (
  <Card>{op.titulo}</Card>
))}

// ✅ Correto
{oportunidades.map(op => (
  <Card key={op.id}>{op.titulo}</Card>
))}
```

**2. Cannot read property of undefined:**
```javascript
// ❌ Erro se 'user' for null
<p>{user.nome}</p>

// ✅ Correto
<p>{user?.nome}</p>
// ou
{user && <p>{user.nome}</p>}
```

**3. Memory leak:**
```javascript
// ❌ Pode causar leak
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  // Esqueceu de limpar
}, []);

// ✅ Correto
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  return () => clearInterval(timer);  // Cleanup
}, []);
```

**4. CORS Error:**
```javascript
// Backend: src/app.js
app.use(cors());  // ✅ Adicione isso

// Ou específico:
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

---

### 6. Loading States Ausentes

#### Sintomas:
- Interface trava durante requisições
- Usuário não sabe se algo está acontecendo
- Cliques múltiplos em botões

#### Como Identificar:

```
1. Desacelere a conexão (DevTools > Network > Slow 3G)
2. Tente fazer login, criar oportunidade, etc.
3. Observe se há indicação visual de carregamento
```

#### Implementação:

```javascript
// ❌ Sem loading
function Login() {
  const handleLogin = async () => {
    const response = await api.login(email, senha);
    // Usuário não sabe que está processando
  };
}

// ✅ Com loading
function Login() {
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await api.login(email, senha);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button disabled={loading}>
      {loading ? 'Entrando...' : 'Entrar'}
    </button>
  );
}
```

---

### 7. Validações Ausentes

#### Como Identificar:

```
Tente submeter formulários com:
- Campos vazios
- Email inválido
- Dados fora do padrão esperado
```

#### Teste Cada Campo:

- [ ] Campo obrigatório vazio
- [ ] Email sem @
- [ ] Senha muito curta
- [ ] Números onde deveria ser texto
- [ ] Texto onde deveria ser número
- [ ] Data inválida
- [ ] Arquivo muito grande

#### Implementação:

```javascript
// Validação básica
const validateForm = (data) => {
  const errors = {};
  
  if (!data.titulo) {
    errors.titulo = 'Título é obrigatório';
  }
  
  if (!data.email || !data.email.includes('@')) {
    errors.email = 'Email inválido';
  }
  
  if (data.senha && data.senha.length < 6) {
    errors.senha = 'Senha deve ter no mínimo 6 caracteres';
  }
  
  return errors;
};
```

---

## 🐛 Problemas de Documentação

### 8. README Incompleto

#### Como Identificar:

```
Teste seguir o README do zero:
1. Clone em nova pasta
2. Siga instruções passo a passo
3. Anote onde trava ou não fica claro
```

#### Checklist Mínimo:

- [ ] **Pré-requisitos** com versões (Node 18+, npm 9+)
- [ ] **Clonar repositório** com comando
- [ ] **Instalar dependências** (backend E frontend)
- [ ] **Configurar .env** com exemplo
- [ ] **Rodar migrations** (se necessário)
- [ ] **Popular banco** (comando seed)
- [ ] **Iniciar backend** (comando e porta)
- [ ] **Iniciar frontend** (comando e porta)
- [ ] **Acessar aplicação** (URL)
- [ ] **Credenciais de teste** para login

#### Exemplo de README Completo:

```markdown
## Instalação

### Pré-requisitos
- Node.js 18+
- npm 9+

### Backend
\`\`\`bash
# Clone
git clone [url]
cd api-oportunidades

# Instale
npm install

# Configure (crie arquivo .env)
cp .env.example .env

# Popule banco
npm run seed

# Inicie
npm start
# Servidor rodando em http://localhost:3000
\`\`\`

### Frontend
\`\`\`bash
# Nova aba do terminal
cd frontend

# Instale
npm install

# Inicie
npm run dev
# Aplicação em http://localhost:5173
\`\`\`

### Credenciais de Teste
- Email: admin@teste.com
- Senha: 123456
```

---

### 9. Links Quebrados

#### Como Identificar:

```
Abra README e clique em TODOS os links:
- Links para documentação
- Links para vídeo
- Links internos (#seção)
- Links para GitHub
- Links para deploy (se houver)
```

#### Verificação Automática:

```bash
# Usando ferramenta (opcional)
npx markdown-link-check README.md
```

#### Correção:

```markdown
<!-- ❌ Errado -->
[Documentação](docs/api.md)  # Caminho relativo pode não funcionar no GitHub

<!-- ✅ Correto -->
[Documentação](./docs/api.md)
# ou
[Documentação](https://github.com/user/repo/blob/main/docs/api.md)
```

---

## 📱 Problemas de Deploy (Opcional)

### 10. Deploy Não Funciona

#### Sintomas Comuns:

**Frontend:**
- Página em branco
- 404 em todas as rotas
- Assets não carregam
- API não conecta

**Backend:**
- 503 Service Unavailable
- Timeout
- Banco de dados não conecta
- Variáveis de ambiente não carregadas

#### Checklist Frontend (Vercel/Netlify):

- [ ] Build funciona localmente (`npm run build`)
- [ ] `dist/` é gerado corretamente
- [ ] Variáveis de ambiente configuradas no serviço
- [ ] URL da API atualizada para produção
- [ ] SPA fallback configurado (para React Router)

```javascript
// vite.config.js
export default {
  build: {
    outDir: 'dist',
  },
  // Para Netlify
  base: '/',
}
```

```toml
# netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Checklist Backend (Render/Railway):

- [ ] Variáveis de ambiente configuradas
- [ ] Porta dinâmica (`process.env.PORT`)
- [ ] Banco de dados configurado (produção)
- [ ] CORS configurado para URL do frontend
- [ ] Start script correto no package.json

```javascript
// server.js
const PORT = process.env.PORT || 3000;  // ✅ Porta dinâmica

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
```

---

## 🔧 Ferramentas de Diagnóstico

### Console do Navegador

```javascript
// Verificar estado da aplicação
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Verificar variáveis globais
console.log(window.location);
console.log(document.cookie);
```

### Network Tab

```
1. F12 > Network
2. Filtre por tipo:
   - XHR: Requisições AJAX
   - Doc: Documentos HTML
   - JS: JavaScripts
   - CSS: Estilos

3. Analise:
   - Status (200=OK, 404=Não encontrado, 500=Erro servidor)
   - Time (quanto tempo levou)
   - Size (tamanho do arquivo)
   - Headers (cabeçalhos da requisição)
   - Preview (prévia da resposta)
```

### React DevTools

```
Extensão do navegador:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

Use para:
- Ver componentes renderizados
- Inspecionar props
- Ver hooks e state
- Identificar re-renders desnecessários
```

---

## 📋 Checklist Rápido Final

### Antes de Entregar - 10 Minutos

1. [ ] **Clone fresh** e instale
2. [ ] **Inicie backend e frontend**
3. [ ] **Faça login**
4. [ ] **Crie uma oportunidade**
5. [ ] **Edite a oportunidade**
6. [ ] **Exclua a oportunidade**
7. [ ] **Teste em mobile** (DevTools)
8. [ ] **Verifique console** (sem erros críticos)
9. [ ] **Teste todos os links** do README
10. [ ] **Confirme vídeo** acessível

### Se Tudo Passou ✅

**Você está pronto para entregar!**

---

## 🆘 Troubleshooting de Emergência

### "Funcionava Ontem!"

1. **Git log** - O que mudou?
```bash
git log --oneline -n 10
git diff HEAD~1
```

2. **Reverta última mudança**
```bash
git revert HEAD
# ou
git reset --hard HEAD~1  # ⚠️ Perde mudanças
```

3. **Branches**
```bash
# Crie branch de backup
git branch backup-antes-entrega

# Volte para versão funcional
git checkout [commit-funcional]
```

### "Erro que Nunca Vi"

1. **Copie erro completo**
2. **Google**: "erro exato + react" ou "erro + nodejs"
3. **Stack Overflow** geralmente tem resposta
4. **GitHub Issues** da biblioteca
5. **Documentação oficial**

### "Não Tenho Mais Tempo"

**Prioridades:**

1. **Sistema funciona** localmente ← CRÍTICO
2. **Vídeo mostra** funcionando ← CRÍTICO
3. **README com instruções** ← CRÍTICO
4. **Código no GitHub** ← CRÍTICO
5. Deploy online ← Opcional
6. Documentação extra ← Opcional

---

<div align="center">

**Você consegue! 💪**

*"Debugging is twice as hard as writing the code. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it." - Brian Kernighan*

</div>

---

**Criado em**: 14/06/2026  
**Versão**: 1.0  
**Autor**: Leandro Mota Leal
