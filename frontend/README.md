# 🌟 Sistema de Oportunidades - Frontend

<div align="center">

![React](https://img.shields.io/badge/React-19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-7.14.2-CA4245?style=for-the-badge&logo=react-router&logoColor=white)

**Plataforma web para divulgação e gerenciamento de oportunidades profissionais, acadêmicas e sociais**

[📖 Documentação](#-documentação) • [🚀 Início Rápido](#-início-rápido) • [✨ Funcionalidades](#-funcionalidades) • [📸 Screenshots](#-screenshots)

</div>

---

## 📋 Sobre o Projeto

O **Sistema de Oportunidades** é uma aplicação web moderna desenvolvida em **React** que conecta pessoas a oportunidades de crescimento profissional, acadêmico e social. O sistema oferece uma interface intuitiva para visualização, busca e gerenciamento de oportunidades publicadas por organizações e instituições.

### 🎯 Objetivo Social

Este projeto foi desenvolvido como parte de um **projeto de extensão universitária** do curso de **Análise e Desenvolvimento de Sistemas**, com foco em:

- **Inclusão social**: Facilitar o acesso a oportunidades para todos os públicos
- **Desenvolvimento profissional**: Conectar pessoas a vagas e cursos relevantes
- **Impacto comunitário**: Divulgar ações sociais e projetos voluntários
- **Transformação digital**: Modernizar processos de divulgação de oportunidades

### 👥 Cliente Potencial

- **CINE** (Centro de Integração Empresa-Escola)
- **Setores de Recursos Humanos** de empresas e instituições
- **Universidades e instituições educacionais**
- **ONGs e organizações sociais**
- **Centros de empregabilidade**

---

## 🛠️ Tecnologias Utilizadas

### Core
- **React 19.2.5** - Biblioteca JavaScript para construção de interfaces
- **Vite 8.0.10** - Build tool e dev server ultra-rápido
- **React Router DOM 7.14.2** - Roteamento e navegação

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para garantir qualidade de código
- **Vite Plugin React** - Suporte a JSX e Fast Refresh

### Integrações
- **API REST** - Comunicação com backend Node.js/Express
- **JWT Authentication** - Autenticação segura baseada em tokens
- **Local Storage** - Persistência de autenticação no cliente

---

## ✨ Funcionalidades

### 🌐 Área Pública

- **Home Page**
  - Apresentação do sistema
  - Destaques de oportunidades recentes
  - Acesso rápido às principais funcionalidades

- **Listagem de Oportunidades**
  - Visualização de todas as oportunidades disponíveis
  - Sistema de busca por palavras-chave
  - Filtros por categoria, organização e status
  - Paginação de resultados

- **Detalhes da Oportunidade**
  - Informações completas da vaga/curso
  - Dados da organização responsável
  - Requisitos e descrição detalhada
  - Botão de candidatura/interesse

### 🔐 Área Autenticada

- **Autenticação**
  - Login com email e senha
  - Validação JWT
  - Proteção de rotas privadas
  - Gerenciamento de sessão

- **Dashboard Administrativo**
  - Visão geral do sistema
  - Estatísticas de oportunidades
  - Acesso rápido às funcionalidades administrativas

- **Perfil do Usuário**
  - Visualização de dados pessoais
  - Edição de informações
  - Gerenciamento de interesses

### 🛡️ Área Administrativa

- **Gerenciamento de Oportunidades**
  - Criar novas oportunidades
  - Editar oportunidades existentes
  - Excluir oportunidades
  - Controle de status (ativa/inativa)
  - Upload de informações completas

- **Gerenciamento de Organizações**
  - Cadastro de organizações parceiras
  - Edição de dados organizacionais
  - Controle de status
  - Visualização de oportunidades por organização

### 🎨 Recursos de Interface

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Feedback Visual**: Loading states, toasts e mensagens de confirmação
- **Error Boundary**: Tratamento elegante de erros
- **Skeleton Screens**: Carregamento progressivo para melhor UX
- **Modais de Confirmação**: Prevenção de ações acidentais
- **Navegação Intuitiva**: Menu responsivo e breadcrumbs

---

## 📁 Estrutura do Projeto

```
frontend/
├── public/                  # Arquivos públicos estáticos
├── src/
│   ├── assets/             # Imagens, ícones e recursos
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Layout.jsx
│   │   ├── OpportunityCard.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ConfirmModal.jsx
│   │   ├── Toast.jsx
│   │   ├── SearchBar.jsx
│   │   ├── FilterBar.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── FormField.jsx
│   │   └── index.js        # Barrel exports
│   ├── context/            # Context API (Estado Global)
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/              # Custom Hooks
│   │   ├── useAsync.js
│   │   ├── useDeleteOportunidade.js
│   │   └── useOportunidadesFilter.js
│   ├── pages/              # Páginas da aplicação
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Oportunidades.jsx
│   │   ├── OportunidadeDetalhe.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Perfil.jsx
│   │   ├── AdminOportunidades.jsx
│   │   ├── AdminOportunidadesLista.jsx
│   │   ├── AdminOrganizacoes.jsx
│   │   └── AdminOrganizacoesLista.jsx
│   ├── routes/             # Configuração de rotas
│   │   └── PrivateRoute.jsx
│   ├── services/           # Serviços de API
│   │   └── api.js
│   ├── styles/             # Arquivos CSS
│   │   ├── index.css       # Estilos globais
│   │   └── [Component].css # Estilos por componente
│   ├── utils/              # Funções utilitárias
│   │   └── auth.js
│   ├── App.jsx            # Componente raiz
│   └── main.jsx           # Ponto de entrada
├── docs/                   # Documentação adicional
├── scripts/                # Scripts utilitários
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── STRUCTURE.md           # Documentação da estrutura
└── vite.config.js

```

📖 **Documentação detalhada**: [STRUCTURE.md](STRUCTURE.md)

---

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 18 ou superior
- **NPM** ou **Yarn**
- **Backend** da API rodando (veja [../README.md](../README.md))

### Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/Vermelhow/api-oportunidades.git
cd api-oportunidades/frontend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure a API**

Certifique-se de que o backend está rodando em `http://localhost:3000`

Se necessário, ajuste a URL da API em `src/services/api.js`

4. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

5. **Acesse a aplicação**

Abra seu navegador em: `http://localhost:5173`

---

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Verificar código com ESLint
npm run lint

# Limpar arquivos temporários do macOS
npm run clean
```

---

## 🔗 Integração com Backend

### Endpoints Utilizados

O frontend consome os seguintes endpoints da API:

#### Autenticação
- `POST /api/pessoas/login` - Login de usuário
- `GET /api/pessoas/perfil` - Dados do usuário autenticado

#### Oportunidades
- `GET /api/oportunidades` - Listar oportunidades
- `GET /api/oportunidades/:id` - Detalhes de oportunidade
- `POST /api/oportunidades` - Criar oportunidade (admin)
- `PUT /api/oportunidades/:id` - Atualizar oportunidade (admin)
- `DELETE /api/oportunidades/:id` - Excluir oportunidade (admin)

#### Organizações
- `GET /api/organizacoes` - Listar organizações
- `GET /api/organizacoes/:id` - Detalhes de organização
- `POST /api/organizacoes` - Criar organização (admin)
- `PUT /api/organizacoes/:id` - Atualizar organização (admin)
- `DELETE /api/organizacoes/:id` - Excluir organização (admin)

#### Outros
- `GET /api/categorias` - Listar categorias
- `GET /api/interesses` - Listar interesses

### Autenticação

O sistema utiliza **JWT (JSON Web Token)** para autenticação:

1. Usuário faz login com email e senha
2. Backend retorna token JWT válido por 7 dias
3. Token é armazenado no localStorage
4. Todas as requisições protegidas incluem o token no header `Authorization: Bearer {token}`
5. Token é validado automaticamente nas rotas protegidas

---

## 📸 Screenshots

### Home Page
> Interface de boas-vindas com acesso rápido às oportunidades

### Listagem de Oportunidades
> Sistema de busca e filtros para encontrar oportunidades

### Detalhes da Oportunidade
> Visualização completa com informações da vaga e organização

### Dashboard Administrativo
> Painel de controle com estatísticas e acesso às funcionalidades

### Gerenciamento de Oportunidades
> CRUD completo com formulários validados

---

## 🧪 Testes

```bash
# Executar testes unitários (a implementar)
npm run test

# Executar testes com coverage (a implementar)
npm run test:coverage
```

---

## 🔐 Segurança

- ✅ Validação de formulários no frontend
- ✅ Sanitização de dados antes do envio
- ✅ Proteção de rotas administrativas
- ✅ Validação de token JWT em cada requisição
- ✅ Logout automático em caso de token expirado
- ✅ Tratamento seguro de erros (sem exposição de dados sensíveis)

---

## 📖 Documentação

- **[STRUCTURE.md](STRUCTURE.md)** - Estrutura detalhada do projeto
- **[docs/ROTAS-PROTEGIDAS.md](docs/ROTAS-PROTEGIDAS.md)** - Sistema de rotas protegidas
- **[docs/DIA-*.md](docs/)** - Diários de desenvolvimento

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é um trabalho acadêmico desenvolvido para fins educacionais e de extensão universitária.

---

## 👨‍💻 Autor

**Leandro Mota Leal**

- 🎓 Análise e Desenvolvimento de Sistemas
- 📧 Email: [leandromotaleal@gmail.com](mailto:leandromotaleal@gmail.com)
- 💼 GitHub: [@Vermelhow](https://github.com/Vermelhow)
- 🔗 LinkedIn: [Leandro Mota Leal](https://linkedin.com/in/leandro-mota-leal)

---

## 🙏 Agradecimentos

- Professores e orientadores do curso de ADS
- Colegas que contribuíram com feedback
- Comunidade React e open source
- Instituições parceiras do projeto de extensão

---

## 📞 Contato e Suporte

Para dúvidas, sugestões ou suporte:

- 📧 **Email**: leandromotaleal@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Vermelhow/api-oportunidades/issues)
- 📖 **Documentação completa**: [docs/](docs/)

---

<div align="center">

**Desenvolvido com ❤️ como projeto de extensão universitária**

[⬆ Voltar ao topo](#-sistema-de-oportunidades---frontend)

</div>

### `/styles`
Arquivos CSS organizados para estilização da aplicação.

## 🚀 Comandos

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 🎯 Convenções

- Use PascalCase para nomes de componentes (`MyComponent.jsx`)
- Use camelCase para funções e variáveis (`myFunction`)
- Mantenha componentes pequenos e com responsabilidade única
- Utilize a estrutura de pastas para organizar seu código

---

## React + Vite

Este projeto utiliza React com Vite para desenvolvimento rápido com HMR (Hot Module Replacement).

Plugin utilizado: [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react)

