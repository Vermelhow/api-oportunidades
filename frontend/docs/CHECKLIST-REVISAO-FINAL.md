# ✅ Checklist Final de Revisão - Entrega do Projeto

## 📋 Informações do Checklist

**Projeto**: Sistema de Oportunidades - Frontend  
**Tipo**: Projeto de extensão universitária  
**Data de Revisão**: 14/06/2026  
**Objetivo**: Garantir qualidade e completude antes da entrega final

---

## 📦 Estrutura do Checklist

- [1. GitHub e Repositório](#1-github-e-repositório)
- [2. README e Documentação](#2-readme-e-documentação)
- [3. Sistema Funcionando](#3-sistema-funcionando)
- [4. Autenticação e Login](#4-autenticação-e-login)
- [5. CRUD de Oportunidades](#5-crud-de-oportunidades)
- [6. Dashboard Administrativo](#6-dashboard-administrativo)
- [7. Vídeo de Apresentação](#7-vídeo-de-apresentação)
- [8. Relatório Técnico](#8-relatório-técnico)
- [9. Links de Entrega](#9-links-de-entrega)
- [10. Itens Complementares](#10-itens-complementares)

---

## 1. GitHub e Repositório

### 1.1 Estrutura do Repositório

- [ ] **Repositório público** (ou conforme orientação do professor)
- [ ] **Nome do repositório** descritivo e profissional
- [ ] **Descrição** clara no GitHub (About)
- [ ] **Topics/Tags** relevantes adicionadas (react, nodejs, api, etc.)
- [ ] **Licença** definida (se aplicável)
- [ ] **Arquivo .gitignore** configurado corretamente
- [ ] **Sem arquivos temporários** commitados (._*, .DS_Store, node_modules)

### 1.2 Commits e Histórico

- [ ] **Mensagens de commit** claras e descritivas
- [ ] **Histórico organizado** e lógico
- [ ] **Commits com datas** adequadas (se personalizadas)
- [ ] **Sem commits com informações sensíveis** (senhas, tokens)
- [ ] **Branch main** atualizada e funcional

### 1.3 README Principal

- [ ] **README.md existe** na raiz do projeto
- [ ] **Instruções de instalação** claras (backend e frontend)
- [ ] **Como executar** o projeto completo
- [ ] **Pré-requisitos** listados
- [ ] **Estrutura do projeto** explicada
- [ ] **Tecnologias** documentadas com versões

### 1.4 Arquivos de Configuração

- [ ] **package.json** com informações corretas
- [ ] **Dependências atualizadas** e sem vulnerabilidades críticas
- [ ] **.env.example** com variáveis necessárias documentadas
- [ ] **Scripts npm** funcionando corretamente

### 1.5 Organização

- [ ] **Pastas organizadas** logicamente
- [ ] **Código limpo** sem arquivos não utilizados
- [ ] **Documentação em /docs** organizada
- [ ] **Assets** organizados em pastas apropriadas

---

## 2. README e Documentação

### 2.1 README do Frontend

- [ ] **Título e descrição** atraentes
- [ ] **Badges** de tecnologias (shields.io)
- [ ] **Objetivo social** claramente definido
- [ ] **Cliente potencial** identificado (CINE, RH)
- [ ] **Tecnologias utilizadas** com versões
- [ ] **Funcionalidades** listadas e explicadas
- [ ] **Screenshots** incluídos (se possível)
- [ ] **Como instalar** passo a passo
- [ ] **Como executar** detalhado
- [ ] **Integração com backend** explicada
- [ ] **Endpoints da API** documentados
- [ ] **Estrutura do projeto** descrita
- [ ] **Scripts disponíveis** explicados
- [ ] **Informações do autor** completas
- [ ] **Contato e suporte** disponível
- [ ] **Links funcionando** corretamente

### 2.2 Documentação Técnica

- [ ] **STRUCTURE.md** criado e atualizado
- [ ] **Diários de desenvolvimento** (DIA-*.md) presentes
- [ ] **ROTEIRO-VIDEO-APRESENTACAO.md** disponível
- [ ] **Documentação de rotas** atualizada
- [ ] **Comentários no código** onde necessário
- [ ] **JSDoc em funções** complexas

### 2.3 Documentação do Backend

- [ ] **README da API** completo
- [ ] **Endpoints documentados** em docs/endpoints.md
- [ ] **Como configurar** banco de dados
- [ ] **Variáveis de ambiente** explicadas
- [ ] **Autenticação JWT** documentada

---

## 3. Sistema Funcionando

### 3.1 Instalação e Execução

- [ ] **npm install funciona** sem erros (backend e frontend)
- [ ] **Backend inicia** sem erros (`npm start` ou `npm run dev`)
- [ ] **Frontend inicia** sem erros (`npm run dev`)
- [ ] **Portas corretas** (backend: 3000, frontend: 5173 ou conforme configurado)
- [ ] **Banco de dados** criado e populado
- [ ] **Migrations rodando** automaticamente
- [ ] **Seed de dados** funcional

### 3.2 Navegação e Interface

- [ ] **Home page** carrega corretamente
- [ ] **Navegação entre páginas** funciona
- [ ] **Links do menu** todos funcionais
- [ ] **Footer** presente e funcional (se houver)
- [ ] **Sem erros no console** do navegador
- [ ] **Sem warnings críticos** no terminal

### 3.3 Responsividade

- [ ] **Desktop** (1920x1080) funciona bem
- [ ] **Laptop** (1366x768) funciona bem
- [ ] **Tablet** (768px) adaptado corretamente
- [ ] **Mobile** (375px) funcional e usável
- [ ] **Menu hambúrguer** funciona em mobile
- [ ] **Imagens** responsivas
- [ ] **Textos legíveis** em todos os tamanhos

### 3.4 Performance

- [ ] **Páginas carregam rapidamente** (< 3 segundos)
- [ ] **Sem travamentos** ao navegar
- [ ] **Loading states** implementados
- [ ] **Imagens otimizadas**
- [ ] **Sem memory leaks** aparentes

---

## 4. Autenticação e Login

### 4.1 Funcionalidade

- [ ] **Página de login** acessível
- [ ] **Formulário de login** funcional
- [ ] **Validação de campos** funcionando
- [ ] **Login com credenciais corretas** funciona
- [ ] **Login com credenciais incorretas** mostra erro apropriado
- [ ] **Token JWT** é armazenado corretamente
- [ ] **Redirecionamento após login** funciona
- [ ] **Logout** funciona corretamente
- [ ] **Token expira** após tempo configurado
- [ ] **Redirecionamento ao expirar** token funciona

### 4.2 Segurança

- [ ] **Senhas não visíveis** no formulário
- [ ] **Token não exposto** no console
- [ ] **Rotas protegidas** funcionando
- [ ] **Redirecionamento** para login se não autenticado
- [ ] **Validação de token** no backend

### 4.3 UX

- [ ] **Mensagens de erro** claras e úteis
- [ ] **Feedback visual** durante login (loading)
- [ ] **Mensagem de sucesso** após login
- [ ] **Tratamento de erros** de rede
- [ ] **Recuperação de senha** (se implementado)

### 4.4 Testes

- [ ] **Login com usuário válido** testado
- [ ] **Login com usuário inválido** testado
- [ ] **Login com campos vazios** testado
- [ ] **Logout** testado
- [ ] **Acesso a rota protegida sem login** testado

---

## 5. CRUD de Oportunidades

### 5.1 Listagem (Read)

- [ ] **Página de listagem** carrega
- [ ] **Oportunidades são exibidas** corretamente
- [ ] **Cards** bem formatados
- [ ] **Informações visíveis**: título, organização, categoria
- [ ] **Paginação** funciona (se implementada)
- [ ] **Filtros** funcionam corretamente
- [ ] **Busca** retorna resultados esperados
- [ ] **Loading state** ao carregar lista
- [ ] **Mensagem de lista vazia** quando não há dados

### 5.2 Detalhes (Read Single)

- [ ] **Clicar em oportunidade** abre detalhes
- [ ] **Todas as informações** são exibidas
- [ ] **Formatação** está correta
- [ ] **Dados da organização** aparecem
- [ ] **Botão voltar** funciona
- [ ] **Loading state** ao carregar detalhes
- [ ] **Tratamento de ID inválido** funciona

### 5.3 Cadastro (Create)

- [ ] **Botão "Nova Oportunidade"** acessível
- [ ] **Formulário de cadastro** carrega
- [ ] **Todos os campos** estão presentes
- [ ] **Dropdowns** carregam opções
- [ ] **Validação de campos** obrigatórios funciona
- [ ] **Cadastro com dados válidos** funciona
- [ ] **Mensagem de sucesso** é exibida
- [ ] **Redirecionamento** após cadastro funciona
- [ ] **Dados aparecem** na listagem
- [ ] **Loading state** durante cadastro

### 5.4 Edição (Update)

- [ ] **Botão "Editar"** presente na lista admin
- [ ] **Formulário de edição** carrega com dados
- [ ] **Todos os campos** preenchidos corretamente
- [ ] **Modificação de campos** possível
- [ ] **Salvar alterações** funciona
- [ ] **Mensagem de sucesso** é exibida
- [ ] **Alterações refletidas** na listagem
- [ ] **Validação** funciona na edição
- [ ] **Loading state** durante atualização

### 5.5 Exclusão (Delete)

- [ ] **Botão "Excluir"** presente
- [ ] **Modal de confirmação** aparece
- [ ] **Cancelar exclusão** funciona
- [ ] **Confirmar exclusão** funciona
- [ ] **Mensagem de sucesso** é exibida
- [ ] **Oportunidade removida** da lista
- [ ] **Não é possível acessar** oportunidade excluída
- [ ] **Loading state** durante exclusão

### 5.6 Tratamento de Erros

- [ ] **Erro de rede** tratado adequadamente
- [ ] **Erro 404** tratado (oportunidade não encontrada)
- [ ] **Erro 401** tratado (não autenticado)
- [ ] **Erro 500** tratado (erro do servidor)
- [ ] **Mensagens de erro** claras para o usuário
- [ ] **Não trava** a aplicação em caso de erro

---

## 6. Dashboard Administrativo

### 6.1 Acesso

- [ ] **Apenas usuários autenticados** acessam
- [ ] **Redirecionamento** se não autenticado
- [ ] **Menu de acesso** visível após login

### 6.2 Conteúdo

- [ ] **Dashboard carrega** corretamente
- [ ] **Estatísticas** exibidas (se implementadas)
- [ ] **Navegação para CRUD** funciona
- [ ] **Links rápidos** funcionais
- [ ] **Menu lateral** (se houver) funciona
- [ ] **Layout organizado** e intuitivo

### 6.3 Funcionalidades

- [ ] **Acesso ao CRUD de oportunidades** funciona
- [ ] **Acesso ao CRUD de organizações** funciona (se implementado)
- [ ] **Perfil do usuário** acessível
- [ ] **Logout** funciona do dashboard

### 6.4 UX

- [ ] **Interface clara** e profissional
- [ ] **Responsivo** em todos os dispositivos
- [ ] **Feedback visual** adequado
- [ ] **Breadcrumbs** ou indicação de localização

---

## 7. Vídeo de Apresentação

### 7.1 Conteúdo

- [ ] **Vídeo gravado** e finalizado
- [ ] **Duração adequada** (5-8 minutos)
- [ ] **Introdução** clara
- [ ] **Demonstração do login** incluída
- [ ] **Listagem de oportunidades** mostrada
- [ ] **Detalhes** demonstrados
- [ ] **CRUD completo** apresentado
- [ ] **Dashboard** mostrado
- [ ] **Responsividade** demonstrada
- [ ] **Tecnologias** mencionadas
- [ ] **Encerramento** com contato

### 7.2 Qualidade Técnica

- [ ] **Áudio claro** e sem ruídos
- [ ] **Vídeo em HD** (1080p)
- [ ] **Sem erros visíveis** na tela
- [ ] **Transições suaves** entre telas
- [ ] **Textos legíveis** na gravação
- [ ] **Cursor visível** mas não excessivo
- [ ] **Zoom adequado** quando necessário

### 7.3 Edição

- [ ] **Cortes** bem feitos
- [ ] **Sem silêncios longos** desnecessários
- [ ] **Intro** com título/nome
- [ ] **Outro** com contato
- [ ] **Legendas** (opcional mas recomendado)
- [ ] **Música de fundo** (opcional, baixo volume)

### 7.4 Publicação

- [ ] **Vídeo enviado** para YouTube/plataforma
- [ ] **Link público** ou não listado
- [ ] **Título descritivo**
- [ ] **Descrição** com informações do projeto
- [ ] **Link do GitHub** na descrição
- [ ] **Thumbnail** atraente (se possível)

---

## 8. Relatório Técnico

### 8.1 Estrutura

- [ ] **Capa** com título e autor
- [ ] **Sumário** com páginas
- [ ] **Introdução** ao projeto
- [ ] **Objetivos** claros
- [ ] **Justificativa** do projeto
- [ ] **Metodologia** utilizada
- [ ] **Tecnologias** descritas
- [ ] **Desenvolvimento** detalhado
- [ ] **Resultados** obtidos
- [ ] **Conclusão**
- [ ] **Referências bibliográficas**
- [ ] **Anexos** (se necessário)

### 8.2 Conteúdo

- [ ] **Contextualização** do problema
- [ ] **Solução proposta** explicada
- [ ] **Arquitetura** do sistema
- [ ] **Diagramas** incluídos (se solicitado)
- [ ] **Screenshots** das funcionalidades
- [ ] **Código** relevante (trechos)
- [ ] **Testes** realizados
- [ ] **Desafios** enfrentados
- [ ] **Aprendizados** obtidos
- [ ] **Trabalhos futuros**

### 8.3 Formatação

- [ ] **Fonte** padrão acadêmica (Arial, Times)
- [ ] **Tamanho** 12 no texto, 14 em títulos
- [ ] **Espaçamento** 1.5 linhas
- [ ] **Margens** adequadas (2.5cm)
- [ ] **Páginas numeradas**
- [ ] **Figuras e tabelas** numeradas e referenciadas
- [ ] **Citações** no padrão ABNT (ou conforme orientação)
- [ ] **Revisão ortográfica** feita
- [ ] **Sem erros gramaticais**

### 8.4 Entrega

- [ ] **PDF gerado** e funcional
- [ ] **Nome do arquivo** adequado
- [ ] **Tamanho do arquivo** aceitável
- [ ] **Todas as páginas** presentes
- [ ] **Links funcionais** (se houver)

---

## 9. Links de Entrega

### 9.1 GitHub

- [ ] **Link do repositório** copiado
- [ ] **Link testado** em navegador anônimo
- [ ] **Repositório público** (ou acesso configurado)
- [ ] **README visível** ao abrir o link

### 9.2 Vídeo

- [ ] **Link do YouTube** copiado
- [ ] **Link testado** em navegador anônimo
- [ ] **Vídeo acessível** sem restrições
- [ ] **Vídeo reproduz** corretamente

### 9.3 Aplicação Deployada (Opcional)

- [ ] **Frontend deployado** (Vercel, Netlify, etc.)
- [ ] **Backend deployado** (Render, Railway, etc.)
- [ ] **Links funcionais** e testados
- [ ] **Sistema funcional** online
- [ ] **Banco de dados** configurado (se necessário)

### 9.4 Documento de Entrega

- [ ] **PDF do relatório** anexado
- [ ] **Todos os links** listados em um documento
- [ ] **Informações de contato** incluídas
- [ ] **Data de entrega** respeitada

---

## 10. Itens Complementares

### 10.1 Código

- [ ] **Código formatado** consistentemente
- [ ] **Indentação** correta
- [ ] **Sem código comentado** desnecessário
- [ ] **Sem console.logs** de debug
- [ ] **Variáveis bem nomeadas**
- [ ] **Funções com nomes descritivos**
- [ ] **Componentes organizados** logicamente

### 10.2 Segurança

- [ ] **Sem senhas** no código
- [ ] **Sem tokens** commitados
- [ ] **.env** no .gitignore
- [ ] **Validações** no frontend e backend
- [ ] **Sanitização** de inputs

### 10.3 Acessibilidade

- [ ] **Contraste** adequado de cores
- [ ] **Textos legíveis**
- [ ] **Botões** com labels claros
- [ ] **Formulários** com labels
- [ ] **Navegação por teclado** funcional (básica)

### 10.4 Browser Compatibility

- [ ] **Testado no Chrome**
- [ ] **Testado no Firefox**
- [ ] **Testado no Safari** (se Mac)
- [ ] **Funciona em Edge**

### 10.5 Extras

- [ ] **Favicon** configurado
- [ ] **Title das páginas** adequado
- [ ] **Meta tags** básicas
- [ ] **404 page** (se implementado)
- [ ] **Error boundary** funcional

---

## 🔍 Guia de Identificação de Problemas

### Como Testar Antes da Entrega

#### 1. Teste de Instalação Limpa

```bash
# Clone em nova pasta
git clone [seu-repo]
cd [projeto]

# Backend
npm install
npm run seed
npm start

# Frontend (em novo terminal)
cd frontend
npm install
npm run dev
```

**O que observar:**
- ❌ Erros de instalação de pacotes
- ❌ Avisos de vulnerabilidades críticas
- ❌ Falha ao iniciar servidores
- ❌ Erros de porta já em uso

#### 2. Teste de Navegação Completa

**Fluxo:**
1. Acesse home → Teste links
2. Vá para listagem → Teste filtros
3. Abra detalhes → Teste informações
4. Faça login → Teste autenticação
5. Acesse dashboard → Teste navegação
6. Crie oportunidade → Teste formulário
7. Edite oportunidade → Teste atualização
8. Exclua oportunidade → Teste confirmação
9. Faça logout → Teste redirecionamento

**O que observar:**
- ❌ Erros no console do navegador
- ❌ Páginas em branco
- ❌ Botões que não funcionam
- ❌ Formulários que não submetem
- ❌ Redirecionamentos incorretos

#### 3. Teste de Erros Propositais

**Testes a fazer:**
- Login com credenciais erradas
- Acessar rota protegida sem login
- Submeter formulário com campos vazios
- Submeter formulário com dados inválidos
- Acessar ID de oportunidade inexistente
- Desligar backend e tentar usar frontend
- Token expirado (esperar ou manipular)

**O que observar:**
- ❌ Aplicação trava
- ❌ Mensagens de erro não claras
- ❌ Redirecionamentos inadequados
- ❌ Informações técnicas expostas ao usuário

#### 4. Teste de Responsividade

**Use DevTools:**
1. Abra DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Teste resoluções:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080

**O que observar:**
- ❌ Elementos sobrepostos
- ❌ Textos cortados
- ❌ Botões inacessíveis
- ❌ Menu não funcional em mobile
- ❌ Scroll horizontal desnecessário

#### 5. Teste de Performance

**Observar:**
- Tempo de carregamento inicial
- Tempo de resposta da API
- Renderização de listas grandes
- Navegação entre páginas

**Ferramentas:**
- Lighthouse (DevTools)
- Network tab
- Performance tab

**O que observar:**
- ❌ Carregamento > 5 segundos
- ❌ Travamentos ao scrollar
- ❌ Memória crescendo indefinidamente

#### 6. Teste de Documentação

**Verificar:**
- Siga o README passo a passo
- Tente instalar em outra máquina (ou peça a alguém)
- Verifique se todos os links funcionam
- Confira se as screenshots estão visíveis

**O que observar:**
- ❌ Passos faltando
- ❌ Instruções não claras
- ❌ Links quebrados
- ❌ Imagens não carregam

---

## ⚠️ Checklist de Problemas Comuns

### Evite Estes Erros:

- [ ] ❌ node_modules commitado
- [ ] ❌ .env com dados sensíveis commitado
- [ ] ❌ Banco de dados (.db) commitado
- [ ] ❌ Arquivos de build commitados
- [ ] ❌ Links quebrados no README
- [ ] ❌ Instruções de instalação incompletas
- [ ] ❌ Porta hardcoded sem documentação
- [ ] ❌ Senhas ou tokens no código
- [ ] ❌ console.logs de debug no código final
- [ ] ❌ Código comentado em excesso
- [ ] ❌ Variáveis mal nomeadas (a, b, x, temp)
- [ ] ❌ Funções gigantes sem organização
- [ ] ❌ Erros não tratados
- [ ] ❌ Formulários sem validação
- [ ] ❌ Sem feedback ao usuário (loading, sucesso, erro)
- [ ] ❌ Responsividade quebrada
- [ ] ❌ Vídeo com áudio ruim
- [ ] ❌ Vídeo muito longo ou muito curto
- [ ] ❌ Relatório com erros ortográficos
- [ ] ❌ Formatação inconsistente

---

## 📅 Timeline Sugerida de Revisão

### 3 Dias Antes da Entrega

**Dia 1: Revisão Técnica**
- [ ] Executar checklist de GitHub
- [ ] Executar checklist de Sistema Funcionando
- [ ] Executar checklist de CRUD
- [ ] Corrigir bugs encontrados

**Dia 2: Revisão de Conteúdo**
- [ ] Executar checklist de README
- [ ] Executar checklist de Documentação
- [ ] Revisar vídeo
- [ ] Revisar relatório

**Dia 3: Testes Finais**
- [ ] Teste de instalação limpa
- [ ] Teste completo de navegação
- [ ] Teste de erros propositais
- [ ] Verificar todos os links
- [ ] Submeter entrega

### No Dia da Entrega

- [ ] **Verificação final** de todos os links
- [ ] **Teste rápido** do sistema
- [ ] **Confirmação** de que tudo está acessível
- [ ] **Submissão** na plataforma/email correto
- [ ] **Confirmação** de recebimento (se possível)

---

## 📊 Métrica de Qualidade

### Sistema de Pontuação

**Obrigatório (Elimina se não tiver):**
- Sistema funciona localmente ✅
- Login funciona ✅
- CRUD básico funciona ✅
- Vídeo de apresentação ✅
- GitHub acessível ✅

**Alta Prioridade (80-90%):**
- README completo
- Documentação organizada
- Tratamento de erros
- Responsividade
- Código limpo

**Média Prioridade (60-70%):**
- Validações completas
- Feedback visual
- Performance adequada
- Testes realizados
- Relatório bem formatado

**Baixa Prioridade (Diferencial):**
- Deploy online
- Testes automatizados
- Acessibilidade avançada
- Documentação extra
- Features extras

### Score Final

**Calcule seu score:**
- Obrigatório: 5 itens ÷ 5 = 100% necessário
- Alta: X itens completos ÷ total = Y%
- Média: X itens completos ÷ total = Y%
- Baixa: X itens completos ÷ total = Y%

**Meta mínima para boa entrega:**
- Obrigatório: 100%
- Alta: > 80%
- Média: > 60%
- Baixa: > 20%

---

## ✅ Checklist Final Resumido

### Antes de Entregar - ESSENCIAL

1. [ ] **Clone fresh** do GitHub e teste instalação
2. [ ] **Teste login** com usuário válido e inválido
3. [ ] **Teste CRUD completo** (criar, ler, editar, excluir)
4. [ ] **Teste responsividade** em 3 tamanhos
5. [ ] **Verifique README** seguindo passo a passo
6. [ ] **Teste vídeo** em navegador anônimo
7. [ ] **Revise relatório** (ortografia e formatação)
8. [ ] **Verifique todos os links** de entrega
9. [ ] **Console sem erros** críticos
10. [ ] **Sistema funciona** de ponta a ponta

---

## 🎯 Dicas Finais

### Para Não Esquecer

1. **Peça para alguém testar** - Outro desenvolvedor ou amigo
2. **Teste em outro computador** - Se possível
3. **Grave vídeo com antecedência** - Tempo para regravas
4. **Leia o README como se não conhecesse** o projeto
5. **Faça backup** de tudo antes de mudanças finais
6. **Não faça alterações** de última hora sem testar
7. **Tenha um plano B** se algo der errado
8. **Respire e revise com calma** - Pressa gera erros

### Sinais de Que Está Pronto

✅ Você consegue clonar e rodar sem problemas  
✅ Outra pessoa consegue seguir o README  
✅ Todos os itens obrigatórios estão completos  
✅ Sistema funciona sem erros críticos  
✅ Documentação está clara e completa  
✅ Vídeo demonstra todas as funcionalidades  
✅ Você está confiante na entrega  

---

## 📞 Suporte de Última Hora

### Se Algo Der Errado

1. **Não entre em pânico**
2. **Leia a mensagem de erro** com atenção
3. **Busque no Google** o erro específico
4. **Consulte a documentação** da tecnologia
5. **Peça ajuda** a colegas ou professor
6. **Tenha o backup** pronto para restaurar

### Contatos Úteis

- Professor/Orientador: _______
- Colegas de turma: _______
- Fóruns: Stack Overflow, GitHub Issues
- Documentação: React, Node.js, Express

---

**Criado em**: 14/06/2026  
**Versão**: 1.0  
**Autor**: Leandro Mota Leal  
**Projeto**: Sistema de Oportunidades

---

<div align="center">

**Boa sorte na entrega! 🚀**

*"A preparação adequada previne a performance inadequada."*

</div>
