import { getAll, getOne, runQuery } from '../database/db.js';

class OrganizacoesController {
    async listar(req, res) {
        try {
            const organizacoes = await getAll(`
                SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at
                FROM organizacoes
                ORDER BY nome
            `);
            
            return res.json(organizacoes);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar organizações' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const organizacao = await getOne(`
                SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at
                FROM organizacoes
                WHERE id = ?
            `, [id]);

            if (!organizacao) {
                return res.status(404).json({ erro: 'Organização não encontrada' });
            }

            return res.json(organizacao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao buscar organização' });
        }
    }

    async criar(req, res) {
        try {
            const {
                nome,
                descricao,
                email,
                telefone,
                website,
                endereco
            } = req.body;

            // Validações básicas
            if (!nome || !email) {
                return res.status(400).json({ erro: 'Nome e email são obrigatórios' });
            }

            // Verifica se já existe uma organização com este email
            const organizacaoExistente = await getOne(
                'SELECT id FROM organizacoes WHERE email = ?',
                [email]
            );

            if (organizacaoExistente) {
                return res.status(400).json({ erro: 'Já existe uma organização com este email' });
            }

            // Insere a organização
            const result = await runQuery(
                `INSERT INTO organizacoes (nome, descricao, email, telefone, website, endereco)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [nome, descricao, email, telefone, website, endereco]
            );

            const organizacao = await getOne(
                'SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at FROM organizacoes WHERE id = ?',
                [result.lastID]
            );

            return res.status(201).json(organizacao);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar organização' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const {
                nome,
                descricao,
                email,
                telefone,
                website,
                endereco
            } = req.body;

            // Verifica se a organização existe
            const organizacao = await getOne('SELECT * FROM organizacoes WHERE id = ?', [id]);
            if (!organizacao) {
                return res.status(404).json({ erro: 'Organização não encontrada' });
            }

            // Se o email foi alterado, verifica se já existe
            if (email && email !== organizacao.email) {
                const organizacaoExistente = await getOne(
                    'SELECT id FROM organizacoes WHERE email = ? AND id != ?',
                    [email, id]
                );

                if (organizacaoExistente) {
                    return res.status(400).json({ erro: 'Já existe uma organização com este email' });
                }
            }

            // Atualiza a organização mantendo os valores existentes se não fornecidos
            await runQuery(
                `UPDATE organizacoes 
                SET nome = ?,
                    descricao = ?,
                    email = ?,
                    telefone = ?,
                    website = ?,
                    endereco = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    nome || organizacao.nome,
                    descricao === undefined ? organizacao.descricao : descricao,
                    email || organizacao.email,
                    telefone === undefined ? organizacao.telefone : telefone,
                    website === undefined ? organizacao.website : website,
                    endereco === undefined ? organizacao.endereco : endereco,
                    id
                ]
            );

            const organizacaoAtualizada = await getOne(
                'SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at FROM organizacoes WHERE id = ?',
                [id]
            );

            return res.json(organizacaoAtualizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar organização' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [id]);
            if (!organizacao) {
                return res.status(404).json({ erro: 'Organização não encontrada' });
            }

            await runQuery('DELETE FROM organizacoes WHERE id = ?', [id]);

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir organização' });
        }
    }
}

export default new OrganizacoesController();