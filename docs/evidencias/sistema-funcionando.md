# Evidência de Funcionamento do Sistema

Data: 03/11/2025

## Estrutura do Banco de Dados

O sistema possui as seguintes tabelas corretamente configuradas e relacionadas:

1. `categorias`
   - Campos: id, nome, created_at, updated_at
   - Relacionamentos: Categorias -> Oportunidades (1:N)

2. `organizacoes`
   - Campos: id, nome, descricao, email, telefone, website, endereco, created_at, updated_at
   - Relacionamentos: Organizações -> Oportunidades (1:N)

3. `oportunidades`
   - Campos: id, titulo, descricao, categoria_id, organizacao_id, tipo, status, data_inicio, data_fim, requisitos, beneficios, salario_min, salario_max, formato, localizacao, link_inscricao, created_at, updated_at
   - Relacionamentos:
     - Oportunidades -> Categorias (N:1)
     - Oportunidades -> Organizações (N:1)
     - Oportunidades -> Interesses (1:N)

4. `pessoas`
   - Campos: id, nome, email, senha, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
   - Relacionamentos: Pessoas -> Interesses (1:N)

5. `interesses`
   - Campos: id, pessoa_id, oportunidade_id, status, mensagem, data_interesse, created_at, updated_at
   - Relacionamentos:
     - Interesses -> Pessoas (N:1)
     - Interesses -> Oportunidades (N:1)
   - Índices:
     - idx_interesses_pessoa
     - idx_interesses_oportunidade
     - idx_interesses_status

## Dados de Teste

O sistema possui dados de teste inseridos através dos seguintes scripts:

1. `scripts/seed.js`: Insere dados básicos
   - 8 categorias diferentes
   - 5 organizações
   - 6 oportunidades variadas

2. `scripts/seed-pessoas-interesses.js`: Insere dados de usuários e interações
   - 5 pessoas com perfis diversos
   - 5 interesses em diferentes oportunidades
   - Senhas criptografadas com bcrypt

## Scripts de Migração

Todos os scripts de migração estão funcionando corretamente:
- 001_criar_tabela_categorias.js
- 002_criar_tabela_organizacoes.js
- 003_criar_tabela_oportunidades.js
- 004_criar_tabela_pessoas.js
- 005_criar_tabela_interesses.js

## Dependências

O sistema utiliza as seguintes dependências principais:
- SQLite3 para banco de dados
- bcrypt para criptografia de senhas
- Express para a API REST

## Procedimento de Restauração

Para restaurar o sistema em um novo ambiente:

1. Clonar o repositório
2. Instalar dependências:
   ```bash
   npm install
   ```

3. Criar o banco e executar migrações:
   ```bash
   node src/database/migrations.js
   ```

4. Inserir dados de teste:
   ```bash
   node scripts/seed.js
   node scripts/seed-pessoas-interesses.js
   ```

5. Iniciar o servidor:
   ```bash
   node server.js
   ```

## Verificação de Integridade

Para verificar se o sistema está funcionando corretamente após a restauração:

1. Verificar se o servidor inicia sem erros
2. Confirmar que todas as tabelas foram criadas
3. Validar que os dados de teste foram inseridos
4. Testar as principais rotas da API

## Notas Importantes

- A tabela de interesses foi configurada com restrições de chave estrangeira
- As senhas são armazenadas com hash bcrypt
- Os índices foram criados para otimizar as consultas
- Todas as tabelas possuem timestamps de criação e atualização