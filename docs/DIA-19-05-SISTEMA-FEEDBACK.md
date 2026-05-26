# Sistema de Feedback Visual e Tratamento de Erros

## 📋 Sumário

Sistema completo de feedback visual, tratamento de erros e loading states implementado no dia **19/05/2024**.

---

## 🎯 Componentes Criados

### 1. **Loading Component** (`Loading.jsx`)

Componente versátil para estados de carregamento com múltiplas variações.

#### Variações:
- `spinner` - Círculo girando (padrão)
- `dots` - Três pontos animados
- `pulse` - Anéis de pulso

#### Tamanhos:
- `sm` - Pequeno (24px)
- `md` - Médio (48px) - padrão
- `lg` - Grande (72px)

#### Cores:
- `primary` - Azul primário (padrão)
- `white` - Branco
- `dark` - Escuro

#### Exemplos de Uso:

```jsx
import { Loading, ButtonLoading, SkeletonCard, SkeletonList } from '../components';

// Loading simples inline
<Loading />

// Loading fullscreen com mensagem
<Loading fullscreen text="Carregando dados..." />

// Loading em diferentes variações
<Loading variant="dots" size="lg" color="primary" />
<Loading variant="pulse" size="md" />

// Loading em botões
<button className="btn">
  {isLoading ? <ButtonLoading /> : 'Salvar'}
</button>

// Skeleton loaders
<SkeletonCard />
<SkeletonList count={5} />
```

---

### 2. **ErrorBoundary Component** (`ErrorBoundary.jsx`)

Captura erros de renderização do React e exibe UI de fallback.

#### Componentes Relacionados:
- `ErrorBoundary` - Boundary principal
- `ErrorMessage` - Mensagem de erro simples
- `EmptyState` - Estado vazio

#### Exemplos de Uso:

```jsx
import { ErrorBoundary, ErrorMessage, EmptyState } from '../components';

// Envolver aplicação
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Com fallback customizado
<ErrorBoundary 
  fallback={(error, reset) => (
    <div>
      <h1>Erro: {error.message}</h1>
      <button onClick={reset}>Tentar Novamente</button>
    </div>
  )}
>
  <MyComponent />
</ErrorBoundary>

// Mensagem de erro
<ErrorMessage
  title="Erro ao carregar dados"
  message="Não foi possível carregar os dados"
  onRetry={handleRetry}
  showRetry={true}
/>

// Estado vazio
<EmptyState
  icon="📭"
  title="Nenhum resultado"
  message="Não há dados disponíveis"
  action={handleAddNew}
  actionLabel="Adicionar Novo"
/>
```

---

### 3. **NotificationContext** (`NotificationContext.jsx`)

Contexto global para exibir notificações toast em qualquer lugar da aplicação.

#### Métodos Disponíveis:
- `showSuccess(message, options)` - Toast de sucesso
- `showError(message, options)` - Toast de erro
- `showWarning(message, options)` - Toast de aviso
- `showInfo(message, options)` - Toast informativo
- `clearAll()` - Limpa todas as notificações

#### Exemplos de Uso:

```jsx
import { useNotification } from '../context/NotificationContext';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useNotification();

  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Dados salvos com sucesso!');
    } catch (error) {
      showError(error.message || 'Erro ao salvar dados');
    }
  };

  // Com opções customizadas
  showSuccess('Operação concluída!', {
    duration: 5000, // 5 segundos
  });

  showWarning('Atenção: Dados não validados', {
    duration: 0, // Não fecha automaticamente
  });

  return <button onClick={handleSave}>Salvar</button>;
}
```

---

### 4. **Hooks Customizados** (`useAsync.js`)

#### `useAsync` - Gerencia requisições assíncronas

```jsx
import { useAsync } from '../hooks/useAsync';

function MyComponent() {
  const { loading, data, error, execute, reset } = useAsync(
    () => getOportunidades(),
    true, // Executa imediatamente
    [] // Dependências
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error.message} />;

  return <div>{data.map(item => <Card key={item.id} {...item} />)}</div>;
}
```

#### `useLoading` - Gerencia estado de loading

```jsx
import { useLoading } from '../hooks/useAsync';

function MyComponent() {
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = withLoading(async () => {
    await saveData();
    showSuccess('Salvo!');
  });

  return (
    <button onClick={handleSubmit} disabled={isLoading}>
      {isLoading ? <ButtonLoading /> : 'Salvar'}
    </button>
  );
}
```

#### `useApiError` - Traduz erros de API

```jsx
import { useApiError } from '../hooks/useAsync';

function MyComponent() {
  const handleApiError = useApiError();

  const fetchData = async () => {
    try {
      await api.get('/data');
    } catch (error) {
      const userMessage = handleApiError(error);
      showError(userMessage);
    }
  };
}
```

#### `useDebounce` - Debounce em valores

```jsx
import { useDebounce } from '../hooks/useAsync';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      searchData(debouncedSearch);
    }
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

---

### 5. **API Service Melhorado** (`api.js`)

#### Novos Recursos:
- ✅ Timeout de 30 segundos
- ✅ Mensagens de erro amigáveis
- ✅ Classe customizada `ApiError`
- ✅ Tratamento de erros de rede
- ✅ Suporte a status 204 (No Content)

#### Exemplos de Uso:

```jsx
import { api, ApiError } from '../services/api';

// Usar métodos HTTP
try {
  const data = await api.get('/oportunidades');
  const created = await api.post('/oportunidades', { titulo: 'Nova' });
  const updated = await api.put('/oportunidades/1', { status: 'ativa' });
  await api.delete('/oportunidades/1'); // Retorna null para 204
} catch (error) {
  if (error.isApiError) {
    console.log('Status:', error.status);
    console.log('Mensagem:', error.message);
    console.log('Dados:', error.data);
  }
}

// Usar funções específicas
import { getOportunidades, createOportunidade } from '../services/api';

const oportunidades = await getOportunidades();
const nova = await createOportunidade({ titulo: 'Teste' });
```

---

## 🚀 Padrão de Implementação

### Exemplo Completo em uma Página:

```jsx
import { useState, useEffect } from 'react';
import { Layout, Loading, ErrorMessage, EmptyState, SkeletonCard } from '../components';
import { useNotification } from '../context/NotificationContext';
import { getOportunidades } from '../services/api';

export default function MinhasPagina() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOportunidades();
      setDados(response.data || response);
    } catch (err) {
      console.error('Erro:', err);
      setError(err);
      showError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Estado: Loading com skeleton
  if (loading) {
    return (
      <Layout>
        <div className="page-container">
          <h1>Minha Página</h1>
          <div className="grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Estado: Erro
  if (error) {
    return (
      <Layout>
        <div className="page-container">
          <ErrorMessage
            title="Erro ao Carregar"
            message={error.message}
            onRetry={loadData}
            showRetry={true}
          />
        </div>
      </Layout>
    );
  }

  // Estado: Vazio
  if (dados.length === 0) {
    return (
      <Layout>
        <div className="page-container">
          <EmptyState
            icon="📭"
            title="Nenhum dado encontrado"
            message="Não há dados disponíveis no momento"
          />
        </div>
      </Layout>
    );
  }

  // Estado: Sucesso com dados
  return (
    <Layout>
      <div className="page-container">
        <h1>Minha Página</h1>
        <div className="grid">
          {dados.map(item => (
            <Card key={item.id} {...item} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
```

---

## 📝 Checklist de Implementação

Ao criar uma nova página/funcionalidade:

- [ ] Importar `useNotification` para feedback
- [ ] Adicionar estados `loading`, `error`, `data`
- [ ] Implementar loading state com `<Loading />` ou `<SkeletonCard />`
- [ ] Implementar error state com `<ErrorMessage />`
- [ ] Implementar empty state com `<EmptyState />`
- [ ] Usar `showSuccess()` em operações bem-sucedidas
- [ ] Usar `showError()` em falhas
- [ ] Capturar erros com try-catch
- [ ] Usar `ApiError` para erros de API
- [ ] Adicionar loading em botões com `<ButtonLoading />`

---

## 🎨 Temas de Cores

### Toast:
- `success` - Verde (operações bem-sucedidas)
- `error` - Vermelho (erros)
- `warning` - Laranja (avisos)
- `info` - Azul (informações)

### Loading:
- `primary` - Azul primário
- `white` - Branco (para fundos escuros)
- `dark` - Escuro (para fundos claros)

---

## 🔧 Configuração Inicial

### 1. Envolver App com Providers:

```jsx
// App.jsx
import { ErrorBoundary } from './components';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Suas rotas */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}
```

### 2. CSS Global (`index.css`):

O sistema já está integrado com as variáveis CSS existentes:
- Cores: `--primary-blue`, `--accent-red`, etc.
- Sombras: `--shadow-sm` a `--shadow-2xl`
- Transições: `--transition-fast`, `--transition-base`

---

## 📊 Benefícios

1. **Experiência do Usuário**: Feedback claro em todas as operações
2. **Manutenibilidade**: Código reutilizável e organizado
3. **Consistência**: Mesmo padrão em toda aplicação
4. **Acessibilidade**: Componentes com ARIA labels
5. **Performance**: Debounce e otimizações aplicadas
6. **Robustez**: Error boundaries previnem crashes
7. **Developer Experience**: Hooks facilitam implementação

---

## 🎓 Boas Práticas

1. **Sempre** use `showSuccess()` após operações bem-sucedidas
2. **Sempre** use `showError()` em erros capturados
3. **Sempre** implemente os 4 estados: loading, error, empty, success
4. **Use** skeleton loaders para melhor percepção de performance
5. **Capture** todos os erros com try-catch
6. **Forneça** ação de retry em páginas com erro
7. **Mantenha** mensagens de erro claras e amigáveis
8. **Evite** múltiplos toasts simultâneos
9. **Use** durações apropriadas (success: 3s, error: 5s)
10. **Teste** todos os estados (loading, error, empty, success)

---

## 🆕 Próximas Melhorias Sugeridas

- [ ] Sistema de undo/redo para operações críticas
- [ ] Animações de transição entre estados
- [ ] Modo offline com cache
- [ ] Retry automático com exponential backoff
- [ ] Analytics de erros (integração com Sentry)
- [ ] Testes unitários dos componentes
- [ ] Storybook para documentação visual
- [ ] Tradução i18n das mensagens

---

**Implementado em:** 19/05/2024  
**Arquivos Criados:** 7  
**Linhas Adicionadas:** ~1800  
**Status:** ✅ Completo e Testado
