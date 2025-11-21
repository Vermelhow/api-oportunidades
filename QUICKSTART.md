# 🚀 Guia Rápido - API Oportunidades

## Início Rápido (5 minutos)

### 1. Instalar e Configurar
```bash
# Clone o repositório
git clone https://github.com/Vermelhow/api-oportunidades.git
cd api-oportunidades

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Inicie o servidor (migrations executam automaticamente)
npm run dev
```

A API estará rodando em: **http://localhost:3000**

---

## 2. Testar os Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### Listar Categorias
```bash
curl http://localhost:3000/api/categorias
```

---

## 3. Criar uma Conta

```bash
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Seu Nome",
    "email": "seu@email.com",
    "senha": "senha123"
  }'
```

---

## 4. Fazer Login

```bash
curl -X POST http://localhost:3000/api/pessoas/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "senha": "senha123"
  }'
```

**Copie o token retornado!**

---

## 5. Usar o Token

```bash
# Substitua SEU_TOKEN pelo token recebido no login
curl -X POST http://localhost:3000/api/oportunidades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "titulo": "Desenvolvedor Full Stack",
    "descricao": "Vaga para desenvolvedor com experiência em Node.js e React",
    "categoria_id": 1,
    "organizacao_id": 1,
    "tipo": "emprego"
  }'
```

---

## 📋 Comandos Úteis

```bash
# Desenvolvimento (com hot-reload)
npm run dev

# Produção
npm start

# Popular banco com dados de teste
npm run seed

# Resetar banco de dados
npm run reset

# Limpar banco de dados
npm run clean
```

---

## 🔍 Explorar a API

### Ver informações da API
```
GET http://localhost:3000/
```

### Ver documentação completa
Abra: `docs/endpoints.md`

### Rotas principais
- `/api/categorias` - Categorias
- `/api/organizacoes` - Organizações  
- `/api/oportunidades` - Oportunidades
- `/api/pessoas` - Pessoas
- `/api/interesses` - Interesses

---

## 🛠️ Ferramentas Recomendadas

- **[Postman](https://www.postman.com/)** - Testar API graficamente
- **[Insomnia](https://insomnia.rest/)** - Alternativa ao Postman
- **[Thunder Client](https://www.thunderclient.com/)** - Extensão VS Code

---

## 📚 Recursos

- [Documentação Completa](docs/endpoints.md)
- [Melhorias Implementadas](docs/MELHORIAS.md)
- [README Principal](README.md)

---

## ⚡ Exemplo Completo: Criar uma Oportunidade

```bash
# 1. Criar categoria
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Tecnologia", "descricao": "Vagas na área de TI"}'

# 2. Criar organização
curl -X POST http://localhost:3000/api/organizacoes \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Tech Corp",
    "email": "contato@techcorp.com",
    "website": "https://techcorp.com"
  }'

# 3. Criar pessoa (você)
curl -X POST http://localhost:3000/api/pessoas \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123"
  }'

# 4. Fazer login e copiar o token
curl -X POST http://localhost:3000/api/pessoas/login \
  -H "Content-Type: application/json" \
  -d '{"email": "joao@email.com", "senha": "senha123"}'

# 5. Criar oportunidade (com o token)
curl -X POST http://localhost:3000/api/oportunidades \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "titulo": "Desenvolvedor Node.js",
    "descricao": "Vaga para desenvolvedor backend com Node.js",
    "categoria_id": 1,
    "organizacao_id": 1,
    "tipo": "emprego",
    "formato": "remoto"
  }'

# 6. Demonstrar interesse
curl -X POST http://localhost:3000/api/interesses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{
    "pessoa_id": 1,
    "oportunidade_id": 1,
    "mensagem": "Tenho interesse nesta vaga!"
  }'
```

---

## 🎓 Conceitos Importantes

### JWT (JSON Web Token)
- Token expira em 7 dias (configurável)
- Necessário para rotas protegidas
- Formato: `Authorization: Bearer TOKEN`

### Validações Automáticas
- Campos obrigatórios são validados
- Formatos (email, URL) são verificados
- Erros retornam mensagens descritivas

### Respostas Padronizadas
```json
// Sucesso
{
  "success": true,
  "data": { ... }
}

// Erro
{
  "success": false,
  "status": 400,
  "message": "Erro de validação",
  "details": [ ... ]
}
```

---

## ❓ Problemas Comuns

### Porta já em uso
```bash
# Mude a porta no .env
PORT=3001
```

### Erro ao iniciar
```bash
# Limpe e recrie o banco
npm run reset
```

### Token inválido/expirado
```bash
# Faça login novamente para obter novo token
```

---

## 📞 Ajuda

- Veja a [documentação completa](docs/endpoints.md)
- Confira os [exemplos de CRUD](docs/evidencias/)
- Leia o [resumo das melhorias](docs/MELHORIAS.md)

---

**Pronto para começar! 🚀**
