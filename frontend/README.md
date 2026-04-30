# Frontend - API de Oportunidades

## 📁 Estrutura de Pastas

```
src/
├── assets/          # Imagens, ícones e arquivos estáticos
├── components/      # Componentes reutilizáveis da UI
├── context/         # Context API para gerenciamento de estado global
├── pages/           # Páginas/Views da aplicação
├── routes/          # Configuração de rotas (React Router)
├── services/        # Serviços de API e integrações externas
└── styles/          # Arquivos de estilo (CSS)
```

## 📂 Descrição das Pastas

### `/assets`
Armazena recursos estáticos como imagens, ícones, fontes e outros arquivos que são importados diretamente nos componentes.

### `/components`
Componentes React reutilizáveis que podem ser usados em múltiplas páginas. Exemplos: botões, cards, modais, formulários, etc.

### `/context`
Implementação do Context API do React para gerenciamento de estado global, evitando prop drilling.

### `/pages`
Componentes que representam páginas completas da aplicação. Cada arquivo aqui geralmente corresponde a uma rota.

### `/routes`
Configuração centralizada das rotas da aplicação usando React Router.

### `/services`
Funções e configurações para comunicação com APIs externas, incluindo a API backend de oportunidades.

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

