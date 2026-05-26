# 📝 DIA 16/05 - Implementação da Edição de Oportunidades

## 📋 Resumo
Implementada a funcionalidade completa de **edição de oportunidades** no sistema, permitindo que administradores atualizem informações de oportunidades já cadastradas.

## ✨ Funcionalidades Implementadas

### 1. Reutilização do Componente AdminOportunidades
O componente `AdminOportunidades.jsx` foi refatorado para suportar **dois modos de operação**:
- **Modo Criação**: Quando acessado via `/admin/oportunidades`
- **Modo Edição**: Quando acessado via `/admin/oportunidades/:id/editar`

### 2. Detecção Automática do Modo
```javascript
const { id } = useParams(); // Captura ID da URL
const isEditMode = Boolean(id); // Define o modo
```

### 3. Carregamento Automático de Dados
Quando em modo de edição:
- A oportunidade é carregada automaticamente pelo ID
- Todos os campos do formulário são preenchidos com os dados existentes
- Datas são formatadas corretamente para o input tipo `date`
- Valores nulos são tratados como strings vazias

### 4. Atualização Inteligente
- O botão e título mudam dinamicamente conforme o modo
- **Modo Criação**: "📋 Cadastrar Oportunidade" / "✓ Criar Oportunidade"
- **Modo Edição**: "✏️ Editar Oportunidade" / "✓ Salvar Alterações"
- Mensagens de sucesso e erro são contextualizadas

## 🛠️ Modificações Técnicas

### Arquivo: `frontend/src/pages/AdminOportunidades.jsx`

#### Imports Adicionados
```javascript
import { useParams } from 'react-router-dom';
import { updateOportunidade, getOportunidadeById } from '../services/api';
```

#### Novos Hooks e Estados
```javascript
const { id } = useParams();
const isEditMode = Boolean(id);
```

#### useEffect Expandido
```javascript
useEffect(() => {
  const fetchData = async () => {
    // ... carregar categorias e organizações
    
    // Se estiver em modo de edição, carregar dados da oportunidade
    if (isEditMode) {
      const oportunidadeResponse = await getOportunidadeById(id);
      const oportunidade = oportunidadeResponse?.data;
      
      if (oportunidade) {
        // Preencher formulário com dados existentes
        setFormData({
          titulo: oportunidade.titulo || '',
          descricao: oportunidade.descricao || '',
          // ... outros campos
          data_inicio: oportunidade.data_inicio 
            ? oportunidade.data_inicio.split('T')[0] 
            : '',
          // ...
        });
      }
    }
  };
  fetchData();
}, [id, isEditMode]);
```

#### handleSubmit Modificado
```javascript
const handleSubmit = async (e) => {
  // ... validações
  
  // Criar ou atualizar baseado no modo
  if (isEditMode) {
    await updateOportunidade(id, dataToSend);
    setSuccess('Oportunidade atualizada com sucesso!');
  } else {
    await createOportunidade(dataToSend);
    setSuccess('Oportunidade criada com sucesso!');
  }
};
```

### Arquivo: `frontend/src/App.jsx`

#### Rota Adicionada
```javascript
<Route 
  path="/admin/oportunidades/:id/editar" 
  element={
    <PrivateRoute>
      <AdminOportunidades />
    </PrivateRoute>
  } 
/>
```

## 🔗 Integração com API

### Endpoints Utilizados

#### GET /api/oportunidades/:id
Carrega dados da oportunidade para edição
```javascript
export async function getOportunidadeById(id) {
  const response = await fetch(`${API_URL}/api/oportunidades/${id}`);
  return response.json();
}
```

#### PUT /api/oportunidades/:id
Atualiza a oportunidade
```javascript
export async function updateOportunidade(id, data) {
  const token = localStorage.getItem('@api-oportunidades:token');
  const response = await fetch(`${API_URL}/api/oportunidades/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

## 📱 Como Usar

### Para Editar uma Oportunidade:

1. **Via URL Direta**:
   ```
   http://localhost:5173/admin/oportunidades/1/editar
   ```

2. **Via Link Programático** (em componentes):
   ```javascript
   import { Link } from 'react-router-dom';
   
   <Link to={`/admin/oportunidades/${oportunidade.id}/editar`}>
     ✏️ Editar
   </Link>
   ```

3. **Via Navegação Programática**:
   ```javascript
   import { useNavigate } from 'react-router-dom';
   
   const navigate = useNavigate();
   navigate(`/admin/oportunidades/${oportunidade.id}/editar`);
   ```

### Fluxo de Edição

1. Usuário acessa a URL de edição com o ID da oportunidade
2. Sistema carrega dados da oportunidade
3. Formulário é preenchido automaticamente
4. Usuário modifica os campos desejados
5. Usuário clica em "✓ Salvar Alterações"
6. Sistema valida e envia dados para API
7. Mensagem de sucesso é exibida
8. Usuário é redirecionado para `/oportunidades`

## 🎨 Interface do Usuário

### Estados Visuais

#### Modo Criação
- **Título**: 📋 Cadastrar Oportunidade
- **Subtítulo**: Preencha os campos abaixo para criar uma nova oportunidade
- **Botão**: ✓ Criar Oportunidade / ⏳ Criando...

#### Modo Edição
- **Título**: ✏️ Editar Oportunidade
- **Subtítulo**: Atualize as informações da oportunidade
- **Botão**: ✓ Salvar Alterações / ⏳ Atualizando...

### Mensagens de Feedback

#### Sucesso
```
✓ Oportunidade atualizada com sucesso! Redirecionando...
```

#### Erro
```
⚠️ Erro ao atualizar oportunidade. Tente novamente.
```

## 🔒 Segurança

- ✅ Rota protegida por autenticação JWT
- ✅ Token enviado no header Authorization
- ✅ Validação de dados no frontend e backend
- ✅ Tratamento de erros de autorização

## 🧪 Validações

Todas as validações do formulário de criação também se aplicam à edição:

- ✅ Campos obrigatórios: título, descrição, categoria, organização, localização, datas
- ✅ Data de término deve ser posterior à data de início
- ✅ Salário máximo deve ser maior que o mínimo
- ✅ URLs devem ter formato válido
- ✅ Números devem ser positivos

## 📊 Campos Editáveis

Todos os campos da oportunidade podem ser editados:

### Informações Básicas
- Título
- Descrição
- Requisitos
- Benefícios
- Categoria
- Organização

### Detalhes
- Tipo (emprego, estágio, curso, evento, projeto, voluntariado)
- Formato (presencial, remoto, híbrido)
- Status (ativa, pausada, encerrada)
- Localização
- Data de início
- Data de término

### Remuneração
- Salário mínimo
- Salário máximo

### Inscrição
- Link de inscrição

## 🚀 Próximas Melhorias Sugeridas

### 1. Adicionar Botões de Edição nas Listagens
Adicionar botões "Editar" em:
- Dashboard (lista de oportunidades)
- Página de detalhes da oportunidade
- Cards de oportunidades

```javascript
// Exemplo de botão em card
<Link 
  to={`/admin/oportunidades/${oportunidade.id}/editar`}
  className="btn btn-small btn-outline"
>
  ✏️ Editar
</Link>
```

### 2. Confirmação Antes de Sair
Avisar usuário se houver alterações não salvas:
```javascript
useEffect(() => {
  const handleBeforeUnload = (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
    }
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

### 3. Histórico de Alterações
Registrar quem editou e quando:
- Campo `updated_by` no banco
- Campo `updated_at` (já existe)
- Log de alterações

### 4. Preview das Alterações
Mostrar lado a lado:
- Dados antigos
- Dados novos
- Diferenças destacadas

### 5. Botão "Duplicar Oportunidade"
Criar nova oportunidade baseada em uma existente

## 📝 Exemplo de Uso Completo

```javascript
// Em um componente de listagem
import { Link } from 'react-router-dom';

function OportunidadesList() {
  const [oportunidades, setOportunidades] = useState([]);
  
  useEffect(() => {
    // Carregar oportunidades
  }, []);
  
  return (
    <div>
      {oportunidades.map(op => (
        <div key={op.id} className="card">
          <h3>{op.titulo}</h3>
          <p>{op.descricao}</p>
          
          <div className="actions">
            <Link to={`/oportunidades/${op.id}`}>
              👁️ Ver Detalhes
            </Link>
            
            <Link to={`/admin/oportunidades/${op.id}/editar`}>
              ✏️ Editar
            </Link>
            
            <button onClick={() => handleDelete(op.id)}>
              🗑️ Excluir
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

## ✅ Checklist de Implementação

- [x] Adicionar `useParams` para capturar ID da URL
- [x] Importar `getOportunidadeById` e `updateOportunidade`
- [x] Criar estado `isEditMode` baseado no ID
- [x] Modificar `useEffect` para carregar dados em modo de edição
- [x] Adaptar `handleSubmit` para criar ou atualizar
- [x] Atualizar título e subtítulo dinamicamente
- [x] Modificar texto do botão conforme o modo
- [x] Contextualizar mensagens de erro e sucesso
- [x] Adicionar rota `/admin/oportunidades/:id/editar` no `App.jsx`
- [x] Testar criação de oportunidade
- [x] Testar edição de oportunidade
- [x] Verificar validações
- [x] Testar tratamento de erros

## 🎯 Resultado

✅ **Funcionalidade de edição implementada com sucesso!**

O sistema agora permite:
- Criar novas oportunidades
- Editar oportunidades existentes
- Validar dados em ambos os modos
- Fornecer feedback apropriado ao usuário
- Manter a consistência da interface

---

**Data de implementação**: 16 de maio de 2026  
**Status**: ✅ Concluído  
**Próximo passo**: Adicionar botões de edição nas páginas de listagem
