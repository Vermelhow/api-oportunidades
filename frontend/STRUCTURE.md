# Estrutura do Projeto Frontend

## 📁 Organização de Pastas

```
frontend/src/
├── assets/              # Recursos estáticos (imagens, ícones)
├── components/          # Componentes reutilizáveis
│   └── index.js        # Barrel export para imports simplificados
├── context/            # Contextos React (AuthContext, NotificationContext)
├── hooks/              # Custom hooks reutilizáveis
├── pages/              # Páginas/Rotas da aplicação
├── routes/             # Configuração e proteção de rotas
├── services/           # Serviços de comunicação com API
├── styles/             # Arquivos CSS organizados por componente
├── utils/              # Funções utilitárias
├── App.jsx            # Componente raiz
└── main.jsx           # Ponto de entrada da aplicação
```

## 🎨 Componentes

### Componentes de UI Reutilizáveis
- **Header**: Cabeçalho com navegação e autenticação
- **Footer**: Rodapé da aplicação
- **Layout**: Wrapper com Header e Footer
- **OpportunityCard**: Card para exibir oportunidades
- **Sidebar**: Menu lateral para área administrativa

### Componentes de Feedback
- **Loading**: Indicadores de carregamento
- **ErrorBoundary**: Tratamento de erros React
- **Toast**: Notificações temporárias
- **ConfirmModal**: Modal de confirmação

### Componentes de Formulário
- **FormField**: Campo de formulário padronizado
- **SearchBar**: Barra de pesquisa
- **FilterBar**: Barra de filtros

## 🔗 Rotas

### Públicas
- `/` - Home
- `/login` - Login
- `/oportunidades` - Lista de oportunidades
- `/oportunidades/:id` - Detalhes da oportunidade

### Protegidas (requer autenticação)
- `/perfil` - Perfil do usuário
- `/dashboard` - Dashboard administrativo
- `/admin/oportunidades` - Gerenciar oportunidades
- `/admin/organizacoes` - Gerenciar organizações

## 🔧 Utilitários

### Auth (`utils/auth.js`)
- `decodeToken()`: Decodifica token JWT
- `isTokenExpired()`: Verifica expiração do token
- Validações de autenticação

### Custom Hooks
- **useAsync**: Gerencia requisições assíncronas
- **useDeleteOportunidade**: Hook especializado para exclusão
- **useOportunidadesFilter**: Gerencia filtros de oportunidades

## 📦 Serviços API

Centraliza todas as chamadas à API REST:
- Autenticação
- Oportunidades (CRUD)
- Organizações (CRUD)
- Categorias
- Interesses

## 🎯 Padrões de Nomenclatura

### Componentes
- **Arquivos**: PascalCase (ex: `Header.jsx`)
- **Exports**: Default export para componente principal
- **CSS**: Mesmo nome do componente (ex: `Header.css`)

### Hooks
- **Prefixo**: Sempre começar com `use`
- **Formato**: camelCase (ex: `useAsync.js`)

### Utilitários
- **Formato**: camelCase (ex: `auth.js`)
- **Funções**: camelCase (ex: `isTokenExpired`)

## 📝 Sistema de Imports

### Barrel Exports
Use o `index.js` para imports simplificados:

```javascript
// ✅ Recomendado
import { Header, Footer, Layout } from './components';

// ❌ Evitar
import Header from './components/Header';
import Footer from './components/Footer';
import Layout from './components/Layout';
```

### Ordem de Imports
1. Dependências externas (React, bibliotecas)
2. Componentes internos
3. Hooks e utilitários
4. Estilos

```javascript
// 1. Externos
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Componentes
import { Header, Footer } from './components';

// 3. Hooks/Utils
import { useAuth } from './context/AuthContext';

// 4. Estilos
import './styles/Home.css';
```

## 🧪 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run lint     # Verifica código com ESLint
npm run preview  # Preview do build de produção
npm run clean    # Remove arquivos temporários do macOS
```

## 🔐 Contextos

### AuthContext
Gerencia autenticação do usuário:
- Estado do usuário
- Login/Logout
- Validação de token
- Proteção de rotas

### NotificationContext
Gerencia notificações globais:
- Exibir mensagens de sucesso/erro
- Toast notifications
- Feedback de ações

## 🎨 Estilos

### Estrutura
- **index.css**: Estilos globais e variáveis CSS
- **[Component].css**: Estilos específicos de cada componente
- **BEM ou padrão similar**: Para nomenclatura de classes

### Variáveis CSS
Utiliza custom properties para cores, espaçamentos e breakpoints:
```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  /* ... */
}
```

## 📊 Fluxo de Dados

```
User Action
    ↓
Component/Page
    ↓
Custom Hook (se necessário)
    ↓
Service (API call)
    ↓
Context (se estado global)
    ↓
Component Update
```

## 🚀 Boas Práticas

1. **Componentização**: Mantenha componentes pequenos e reutilizáveis
2. **Single Responsibility**: Cada componente com uma responsabilidade
3. **Composition over Inheritance**: Use composição de componentes
4. **Hooks personalizados**: Extraia lógica reutilizável
5. **Tratamento de erros**: Sempre trate erros de forma apropriada
6. **Loading states**: Forneça feedback visual durante carregamentos
7. **Acessibilidade**: Use atributos ARIA e navegação por teclado

## 📚 Recursos

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Vite](https://vitejs.dev)

---

**Última atualização**: 11/06/2026
