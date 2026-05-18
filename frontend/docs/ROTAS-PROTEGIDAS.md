# 🔒 Rotas Protegidas - Guia de Implementação

## 📋 Visão Geral

Sistema de rotas protegidas implementado para restringir acesso a páginas administrativas da aplicação, garantindo que apenas usuários autenticados possam acessá-las.

## 🎯 Objetivos Alcançados

✅ Criar componente de rota protegida  
✅ Validar token do usuário  
✅ Proteger páginas administrativas  
✅ Redirecionar usuários não autenticados  

---

## 🏗️ Arquitetura

### 1. Componente PrivateRoute

**Arquivo:** `src/routes/PrivateRoute.jsx`

**Funcionalidades:**
- Verifica se o usuário está autenticado
- Aguarda o carregamento dos dados do localStorage
- Redireciona para `/login` se não autenticado
- Renderiza o componente filho se autenticado

**Exemplo de código:**
```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { signed, loading } = useAuth();

  if (loading) {
    return <div>Verificando autenticação...</div>;
  }

  if (!signed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

---

### 2. Integração com App.jsx

**Arquivo:** `src/App.jsx`

**Como usar:**
```jsx
import PrivateRoute from "./routes/PrivateRoute";

<Route 
  path="/dashboard" 
  element={
    <PrivateRoute>
      <Dashboard />
    </PrivateRoute>
  } 
/>
```

---

## 🔐 Rotas Protegidas

### Rotas que requerem autenticação:

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/dashboard` | `Dashboard` | Área administrativa do usuário |

### Rotas públicas:

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | `Home` | Página inicial |
| `/login` | `Login` | Página de login |
| `/oportunidades` | `Oportunidades` | Listagem de oportunidades |

---

## 🔄 Fluxo de Autenticação

### 1. Acesso a rota protegida

```
Usuário tenta acessar /dashboard
    ↓
PrivateRoute verifica autenticação
    ↓
  ┌─────────────┬──────────────┐
  │ Autenticado │ Não autent.  │
  └─────────────┴──────────────┘
        ↓               ↓
   Renderiza      Redireciona
   Dashboard      para /login
```

### 2. Login bem-sucedido

```
Usuário faz login
    ↓
AuthContext salva token e user
    ↓
Redireciona para /dashboard
    ↓
PrivateRoute valida
    ↓
Renderiza Dashboard
```

### 3. Logout

```
Usuário clica em "Sair"
    ↓
AuthContext limpa token e user
    ↓
Redireciona para /
    ↓
Tentativa de acessar /dashboard
    ↓
PrivateRoute redireciona para /login
```

---

## 🧪 Como Testar

### Teste 1: Acesso sem autenticação
1. Limpe o localStorage do navegador
2. Tente acessar `http://localhost:5173/dashboard`
3. **Resultado esperado:** Redirecionamento para `/login`

### Teste 2: Acesso após login
1. Faça login com credenciais válidas
2. Verifique se foi redirecionado para `/dashboard`
3. **Resultado esperado:** Dashboard renderizado com sucesso

### Teste 3: Acesso ao login já autenticado
1. Com usuário já logado, tente acessar `/login`
2. **Resultado esperado:** Redirecionamento automático para `/dashboard`

### Teste 4: Logout e tentativa de acesso
1. Faça logout
2. Tente acessar `/dashboard`
3. **Resultado esperado:** Redirecionamento para `/login`

### Teste 5: Persistência de sessão
1. Faça login
2. Recarregue a página (F5)
3. **Resultado esperado:** Continua autenticado (dados do localStorage)

---

## 🛠️ Melhorias Implementadas

### Login.jsx
- ✅ Redirecionamento automático para `/dashboard` se já autenticado
- ✅ Validação de formulário antes de submeter
- ✅ Mensagens de erro amigáveis
- ✅ Loading state durante autenticação

### Dashboard.jsx
- ✅ Remoção de verificação duplicada (agora gerenciada pelo PrivateRoute)
- ✅ Código mais limpo e responsabilidade única

### Header.jsx
- ✅ Botão de logout funcional
- ✅ Exibição condicional de menu baseado em autenticação
- ✅ Link para Dashboard apenas para usuários autenticados

---

## 📦 Dependências

- **react-router-dom** - Navegação e redirecionamento
- **AuthContext** - Gerenciamento de estado de autenticação

---

## 🚀 Próximos Passos

### Futuras implementações:
- [ ] Página de cadastro (`/cadastro`)
- [ ] Recuperação de senha
- [ ] Refresh token automático
- [ ] Rota de perfil do usuário (`/perfil`)
- [ ] Rota de criação de oportunidades (`/oportunidades/nova`)
- [ ] Rota de edição de oportunidades (`/oportunidades/:id/editar`)
- [ ] Permissões baseadas em roles (admin, user, etc.)

---

## 📝 Notas Técnicas

### Por que usar `replace` no Navigate?
```jsx
<Navigate to="/login" replace />
```
- Remove a rota protegida do histórico
- Evita que o usuário volte para a rota protegida com o botão "voltar"
- Melhora a experiência do usuário

### Por que verificar `loading`?
```jsx
if (loading) {
  return <div>Verificando autenticação...</div>;
}
```
- Aguarda o carregamento dos dados do localStorage
- Evita flash de redirecionamento indesejado
- Garante que a verificação seja feita com dados corretos

---

## ✅ Checklist de Implementação

- [x] Criar `PrivateRoute.jsx`
- [x] Integrar PrivateRoute no `App.jsx`
- [x] Proteger rota `/dashboard`
- [x] Adicionar redirecionamento no `Login.jsx`
- [x] Simplificar `Dashboard.jsx`
- [x] Testar fluxo de autenticação
- [x] Documentar implementação

---

**Data de implementação:** 11/05/2026  
**Status:** ✅ Completo
