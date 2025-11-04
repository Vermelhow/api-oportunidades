import { getAll, getOne, runQuery } from '../database/db.js';

class InteressesController {
    async listar(req, res) {
        try {
            const interesses = await getAll(`
                SELECT 
                    i.*,
                    p.nome as pessoa_nome,
                    p.email as pessoa_email,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN pessoas p ON i.pessoa_id = p.id
                JOIN oportunidades o ON i.oportunidade_id = o.id
            `);
            
            return res.json(interesses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar interesses' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const interesse = await getOne(`
                SELECT 
                    i.*,
                    p.nome as pessoa_nome,
                    p.email as pessoa_email,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN pessoas p ON i.pessoa_id = p.id
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.id = ?
            `, [id]);

            if (!interesse) {
                return res.status(404).json({ erro: 'Interesse não encontrado' });
            }

            return res.json(interesse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao buscar interesse' });
        }
    }

    async criar(req, res) {
        try {
            const { pessoa_id, oportunidade_id, mensagem } = req.body;

            if (!pessoa_id || !oportunidade_id) {
                return res.status(400).json({ erro: 'pessoa_id e oportunidade_id são obrigatórios' });
            }

            // Verificar se a pessoa existe
            const pessoa = await getOne('SELECT id FROM pessoas WHERE id = ?', [pessoa_id]);
            if (!pessoa) {
                return res.status(404).json({ erro: 'Pessoa não encontrada' });
            }

            // Verificar se a oportunidade existe
            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [oportunidade_id]);
            if (!oportunidade) {
                return res.status(404).json({ erro: 'Oportunidade não encontrada' });
            }

            // Verificar se já existe um interesse para esta pessoa e oportunidade
            const interesseExistente = await getOne(
                'SELECT id FROM interesses WHERE pessoa_id = ? AND oportunidade_id = ?',
                [pessoa_id, oportunidade_id]
            );
                
            if (interesseExistente) {
                return res.status(400).json({ erro: 'Já existe um interesse registrado para esta pessoa nesta oportunidade' });
            }

            const result = await runQuery(
                `INSERT INTO interesses (pessoa_id, oportunidade_id, mensagem, status)
                VALUES (?, ?, ?, 'pendente')`,
                [pessoa_id, oportunidade_id, mensagem]
            );

            const interesse = await getOne(`
                SELECT 
                    i.*,
                    p.nome as pessoa_nome,
                    p.email as pessoa_email,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN pessoas p ON i.pessoa_id = p.id
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.id = ?
            `, [result.lastID]);

            return res.status(201).json(interesse);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar interesse' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { status, mensagem } = req.body;

            const interesse = await getOne('SELECT * FROM interesses WHERE id = ?', [id]);
            if (!interesse) {
                return res.status(404).json({ erro: 'Interesse não encontrado' });
            }

            if (status && !['pendente', 'aceito', 'recusado'].includes(status)) {
                return res.status(400).json({ erro: 'Status inválido' });
            }

            await runQuery(
                `UPDATE interesses 
                SET status = ?, mensagem = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    status || interesse.status,
                    mensagem === undefined ? interesse.mensagem : mensagem,
                    id
                ]
            );

            const interesseAtualizado = await getOne(`
                SELECT 
                    i.*,
                    p.nome as pessoa_nome,
                    p.email as pessoa_email,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN pessoas p ON i.pessoa_id = p.id
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.id = ?
            `, [id]);

            return res.json(interesseAtualizado);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar interesse' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const interesse = await getOne('SELECT id FROM interesses WHERE id = ?', [id]);
            if (!interesse) {
                return res.status(404).json({ erro: 'Interesse não encontrado' });
            }

            await runQuery('DELETE FROM interesses WHERE id = ?', [id]);

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir interesse' });
        }
    }

    async listarPorPessoa(req, res) {
        try {
            const { pessoa_id } = req.params;

            const pessoa = await getOne('SELECT id FROM pessoas WHERE id = ?', [pessoa_id]);
            if (!pessoa) {
                return res.status(404).json({ erro: 'Pessoa não encontrada' });
            }

            const interesses = await getAll(`
                SELECT 
                    i.*,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.pessoa_id = ?
            `, [pessoa_id]);

            return res.json(interesses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar interesses da pessoa' });
        }
    }

    async listarPorOportunidade(req, res) {
        try {
            const { oportunidade_id } = req.params;

            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [oportunidade_id]);
            if (!oportunidade) {
                return res.status(404).json({ erro: 'Oportunidade não encontrada' });
            }

            const interesses = await getAll(`
                SELECT 
                    i.*,
                    p.nome as pessoa_nome,
                    p.email as pessoa_email
                FROM interesses i
                JOIN pessoas p ON i.pessoa_id = p.id
                WHERE i.oportunidade_id = ?
            `, [oportunidade_id]);

            return res.json(interesses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar interesses na oportunidade' });
        }
    }
}

export default new InteressesController();