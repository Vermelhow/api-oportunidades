# 🎨 Sistema de Loading e Feedback Visual

**Data:** 2 de junho de 2026  
**Versão:** 1.0.0  
**Autor:** Sistema de Oportunidades

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Componentes Disponíveis](#componentes-disponíveis)
3. [Guia de Uso](#guia-de-uso)
4. [Exemplos Práticos](#exemplos-práticos)
5. [Best Practices](#best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este sistema fornece componentes modernos e reutilizáveis para:
- **Loading states** durante requisições
- **Empty states** para listas vazias
- **Error handling** visual
- **Skeleton loaders** para carregamento progressivo
- **Feedback visual** em ações do usuário

### ✨ Características

- ✅ Design moderno com glassmorphism
- ✅ Animações suaves e naturais
- ✅ Totalmente responsivo
- ✅ Acessível (ARIA labels)
- ✅ Fácil integração
- ✅ TypeScript-friendly

---

## 📦 Componentes Disponíveis

### 1. **Loading**
Componente principal de carregamento com 3 variações.

```jsx
import { Loading } from '../components';

<Loading 
  size="md"              // 'sm', 'md', 'lg'
  variant="spinner"      // 'spinner', 'dots', 'pulse'
  text="Carregando..."  // Texto opcional
  fullscreen={false}    // Overlay de tela cheia
  color="primary"       // 'primary', 'white', 'dark'
/>
```

### 2. **ButtonLoading**
Loading específico para botões.

```jsx
import { ButtonLoading } from '../components';

<button disabled={loading}>
  {loading ? <ButtonLoading size="sm" /> : 'Salvar'}
</button>
```

### 3. **SkeletonCard**
Placeholder para cards durante carregamento.

```jsx
import { SkeletonCard } from '../components';

{loading ? (
  <>
    <SkeletonCard />
    <SkeletonCard />
  </>
) : (
  // Conteúdo real
)}
```

### 4. **SkeletonList**
Placeholder para listas durante carregamento.

```jsx
import { SkeletonList } from '../components';

{loading ? (
  <SkeletonList count={5} />
) : (
  // Lista real
)}
```

### 5. **ErrorMessage**
Exibe mensagens de erro com opção de retry.

```jsx
import { ErrorMessage } from '../components';

<ErrorMessage
  title="Erro ao Carregar"
  message="Não foi possível carregar os dados."
  onRetry={handleRetry}
  showRetry={true}
  icon="❌"
/>
```

### 6. **EmptyState**
Estado vazio para listas sem dados.

```jsx
import { EmptyState } from '../components';

<EmptyState
  icon="📭"
  title="Nenhum item encontrado"
  message="Comece adicionando um novo item."
  actionText="➕ Adicionar Item"
  onAction={handleAdd}
/>
```

### 7. **ErrorBoundary**
Captura erros de renderização.

```jsx
import { ErrorBoundary } from '../components';

<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 📖 Guia de Uso

### Padrão de Implementação

#### 1. **Setup do Estado**
```jsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

#### 2. **Fetch com Tratamento**
```jsx
async function loadData() {
  try {
    setLoading(true);
    setError(null);
    const response = await api.getData();
    setData(response.data);
  } catch (err) {
    setError(err);
    console.error('Erro:', err);
  } finally {
    setLoading(false);
  }
}
```

#### 3. **Renderização Condicional**
```jsx
// Loading
if (loading) {
  return <SkeletonList count={3} />;
}

// Erro
if (error) {
  return (
    <ErrorMessage
      title="Erro ao Carregar"
      message={error.message}
      onRetry={loadData}
    />
  );
}

// Empty State
if (data.length === 0) {
  return (
    <EmptyState
      icon="📭"
      title="Nenhum dado encontrado"
      message="Adicione novos itens para começar."
      actionText="➕ Adicionar"
      onAction={handleAdd}
    />
  );
}

// Sucesso - Renderizar dados
return (
  <div>
    {data.map(item => <ItemCard key={item.id} {...item} />)}
  </div>
);
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Lista com Loading Skeleton

```jsx
function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="products-container">
        <h1>Produtos</h1>
        <SkeletonList count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <h1>Produtos</h1>
        <ErrorMessage
          title="Erro ao Carregar Produtos"
          message={error.message}
          onRetry={loadProducts}
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-container">
        <h1>Produtos</h1>
        <EmptyState
          icon="🛍️"
          title="Nenhum produto cadastrado"
          message="Adicione produtos para começar a vender."
          actionText="➕ Adicionar Produto"
          onAction={() => navigate('/products/new')}
        />
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1>Produtos ({products.length})</h1>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
}
```

### Exemplo 2: Formulário com Button Loading

```jsx
function CreateUserForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      await api.createUser(formData);
      showSuccess('Usuário criado com sucesso!');
      navigate('/users');
    } catch (error) {
      showError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Nome"
        disabled={submitting}
      />
      
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="Email"
        disabled={submitting}
      />
      
      <button type="submit" disabled={submitting} className="btn btn-primary">
        {submitting ? (
          <>
            <ButtonLoading size="sm" />
            <span style={{ marginLeft: '8px' }}>Salvando...</span>
          </>
        ) : (
          '💾 Salvar Usuário'
        )}
      </button>
    </form>
  );
}
```

### Exemplo 3: Dashboard com Múltiplos Estados

```jsx
function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <ErrorMessage
          title="Erro ao Carregar Dashboard"
          message="Não foi possível carregar as estatísticas."
          onRetry={loadStats}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <StatCard title="Usuários" value={stats.users} icon="👥" />
        <StatCard title="Vendas" value={stats.sales} icon="💰" />
        <StatCard title="Produtos" value={stats.products} icon="📦" />
        <StatCard title="Receita" value={stats.revenue} icon="💵" />
      </div>
    </div>
  );
}
```

### Exemplo 4: Search com Loading Inline

```jsx
function SearchUsers() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  async function performSearch(searchQuery) {
    try {
      setSearching(true);
      const response = await api.searchUsers(searchQuery);
      setResults(response.data);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="search-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar usuários..."
        />
        {searching && <ButtonLoading size="sm" />}
      </div>

      {searching ? (
        <Loading size="md" text="Buscando..." />
      ) : results.length > 0 ? (
        <div className="results-list">
          {results.map(user => (
            <UserItem key={user.id} {...user} />
          ))}
        </div>
      ) : query.trim() ? (
        <EmptyState
          icon="🔍"
          title="Nenhum resultado"
          message={`Nenhum usuário encontrado para "${query}"`}
        />
      ) : null}
    </div>
  );
}
```

---

## ✅ Best Practices

### 1. **Sempre use try-catch-finally**
```jsx
async function loadData() {
  try {
    setLoading(true);
    setError(null); // Limpar erro anterior
    const data = await api.getData();
    setData(data);
  } catch (err) {
    setError(err);
    showError(err.message);
  } finally {
    setLoading(false); // Sempre desativar loading
  }
}
```

### 2. **Skeleton para listas, Spinner para ações**
- Use `SkeletonList` ou `SkeletonCard` para carregamento inicial de listas
- Use `Loading` com spinner para ações rápidas (refresh, busca)
- Use `ButtonLoading` para loading em botões

### 3. **Feedback Visual Imediato**
```jsx
async function handleDelete(id) {
  // Feedback imediato
  setDeleting(true);
  
  try {
    await api.delete(id);
    // Atualizar UI otimisticamente
    setItems(prev => prev.filter(item => item.id !== id));
    showSuccess('Item excluído!');
  } catch (error) {
    // Reverter em caso de erro
    showError(error.message);
    loadItems(); // Recarregar lista
  } finally {
    setDeleting(false);
  }
}
```

### 4. **Empty State Contextual**
```jsx
// Sem busca
<EmptyState
  title="Nenhum produto"
  message="Adicione seu primeiro produto"
  actionText="➕ Adicionar"
  onAction={handleAdd}
/>

// Com busca ativa
<EmptyState
  title="Nenhum resultado"
  message={`Nenhum produto encontrado para "${searchTerm}"`}
  // Sem ação, apenas informação
/>
```

### 5. **Loading States Granulares**
```jsx
const [loadingInitial, setLoadingInitial] = useState(true);
const [loadingMore, setLoadingMore] = useState(false);
const [refreshing, setRefreshing] = useState(false);

// Inicial: Skeleton
// LoadMore: Spinner no final
// Refresh: Pull-to-refresh
```

---

## 🐛 Troubleshooting

### Problema: Loading não aparece
**Solução:** Verifique se o estado está sendo atualizado corretamente no try-catch-finally.

### Problema: Empty State aparece antes do loading
**Solução:** Verifique a ordem das condições. Loading deve vir primeiro.

```jsx
// ❌ Errado
if (data.length === 0) return <EmptyState />;
if (loading) return <Loading />;

// ✅ Correto
if (loading) return <Loading />;
if (data.length === 0) return <EmptyState />;
```

### Problema: ButtonLoading não centraliza no botão
**Solução:** Use flexbox no botão:

```css
button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
```

### Problema: Skeleton não respeita layout
**Solução:** Aplique mesma estrutura de grid/flex:

```jsx
<div className="products-grid">
  {loading ? (
    <>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </>
  ) : (
    products.map(p => <ProductCard key={p.id} {...p} />)
  )}
</div>
```

---

## 📊 Métricas de UX

| Componente | Tempo de Animação | Quando Usar |
|-----------|-------------------|-------------|
| **SkeletonList** | 1.5s shimmer | Carregamento inicial de listas |
| **Loading Spinner** | 0.8s rotação | Ações rápidas (< 2s) |
| **Loading Dots** | 1.4s bounce | Processamento contínuo |
| **ButtonLoading** | 0.8s rotação | Submissão de formulários |
| **ErrorMessage** | 0.3s slide-in | Após falha de requisição |
| **EmptyState** | 0.4s fade-in | Lista vazia confirmada |

---

## 🎨 Customização de Estilos

Os componentes usam variáveis CSS para fácil customização:

```css
/* Loading Colors */
.loading-spinner.loading-primary .spinner-circle {
  border-color: #e0e7ff;
  border-top-color: #4f46e5;
}

/* Empty State */
.empty-state-component {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
}

/* Error Message */
.error-message-component {
  background: rgba(254, 226, 226, 0.9);
  border-left: 5px solid #ef4444;
}
```

---

## 📚 Referências

- **Arquivos de Componentes:**
  - `frontend/src/components/Loading.jsx`
  - `frontend/src/components/ErrorBoundary.jsx`
  
- **Arquivos de Estilos:**
  - `frontend/src/styles/Loading.css`
  - `frontend/src/styles/ErrorBoundary.css`

- **Exemplo de Integração:**
  - `frontend/src/pages/AdminOrganizacoesLista.jsx`

---

## ✨ Changelog

### v1.0.0 (2 de junho de 2026)
- ✅ Componente Loading com 3 variações
- ✅ Skeleton loaders (Card e List)
- ✅ ButtonLoading para botões
- ✅ ErrorMessage com retry
- ✅ EmptyState configurável
- ✅ ErrorBoundary para captura de erros
- ✅ Estilos modernos com glassmorphism
- ✅ Animações suaves e responsivas
- ✅ Documentação completa

---

**Desenvolvido com ❤️ para melhorar a experiência do usuário**
