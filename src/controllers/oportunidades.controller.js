import { getAll, getOne, runQuery } from '../database/db.js';

class OportunidadesController {
    async listar(req, res) {
        try {
            const oportunidades = await getAll(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                ORDER BY o.created_at DESC
            `);
            
            return res.json(oportunidades);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar oportunidades' });
        }
    }

    async buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const oportunidade = await getOne(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.id = ?
            `, [id]);

            if (!oportunidade) {
                return res.status(404).json({ erro: 'Oportunidade não encontrada' });
            }

            return res.json(oportunidade);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao buscar oportunidade' });
        }
    }

    async criar(req, res) {
        try {
            const {
                titulo, descricao, categoria_id, organizacao_id, tipo,
                status = 'ativa',
                data_inicio, data_fim, requisitos, beneficios,
                salario_min, salario_max, formato, localizacao, link_inscricao
            } = req.body;

            // Validações básicas
            if (!titulo || !descricao || !categoria_id || !organizacao_id || !tipo) {
                return res.status(400).json({ 
                    erro: 'Campos obrigatórios: titulo, descricao, categoria_id, organizacao_id, tipo' 
                });
            }

            // Verifica se a categoria existe
            const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
            if (!categoria) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }

            // Verifica se a organização existe
            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
            if (!organizacao) {
                return res.status(404).json({ erro: 'Organização não encontrada' });
            }

            // Insere a oportunidade
            const result = await runQuery(
                `INSERT INTO oportunidades (
                    titulo, descricao, categoria_id, organizacao_id, tipo,
                    status, data_inicio, data_fim, requisitos, beneficios,
                    salario_min, salario_max, formato, localizacao, link_inscricao
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    titulo, descricao, categoria_id, organizacao_id, tipo,
                    status, data_inicio, data_fim, requisitos, beneficios,
                    salario_min, salario_max, formato, localizacao, link_inscricao
                ]
            );

            const oportunidade = await getOne(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.id = ?
            `, [result.lastID]);

            return res.status(201).json(oportunidade);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar oportunidade' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const {
                titulo, descricao, categoria_id, organizacao_id, tipo,
                status, data_inicio, data_fim, requisitos, beneficios,
                salario_min, salario_max, formato, localizacao, link_inscricao
            } = req.body;

            // Verifica se a oportunidade existe
            const oportunidade = await getOne('SELECT * FROM oportunidades WHERE id = ?', [id]);
            if (!oportunidade) {
                return res.status(404).json({ erro: 'Oportunidade não encontrada' });
            }

            // Se informou categoria_id, verifica se existe
            if (categoria_id) {
                const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
                if (!categoria) {
                    return res.status(404).json({ erro: 'Categoria não encontrada' });
                }
            }

            // Se informou organizacao_id, verifica se existe
            if (organizacao_id) {
                const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
                if (!organizacao) {
                    return res.status(404).json({ erro: 'Organização não encontrada' });
                }
            }

            // Atualiza a oportunidade mantendo os valores existentes se não fornecidos
            await runQuery(
                `UPDATE oportunidades 
                SET titulo = ?,
                    descricao = ?,
                    categoria_id = ?,
                    organizacao_id = ?,
                    tipo = ?,
                    status = ?,
                    data_inicio = ?,
                    data_fim = ?,
                    requisitos = ?,
                    beneficios = ?,
                    salario_min = ?,
                    salario_max = ?,
                    formato = ?,
                    localizacao = ?,
                    link_inscricao = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    titulo || oportunidade.titulo,
                    descricao || oportunidade.descricao,
                    categoria_id || oportunidade.categoria_id,
                    organizacao_id || oportunidade.organizacao_id,
                    tipo || oportunidade.tipo,
                    status || oportunidade.status,
                    data_inicio === undefined ? oportunidade.data_inicio : data_inicio,
                    data_fim === undefined ? oportunidade.data_fim : data_fim,
                    requisitos === undefined ? oportunidade.requisitos : requisitos,
                    beneficios === undefined ? oportunidade.beneficios : beneficios,
                    salario_min === undefined ? oportunidade.salario_min : salario_min,
                    salario_max === undefined ? oportunidade.salario_max : salario_max,
                    formato === undefined ? oportunidade.formato : formato,
                    localizacao === undefined ? oportunidade.localizacao : localizacao,
                    link_inscricao === undefined ? oportunidade.link_inscricao : link_inscricao,
                    id
                ]
            );

            const oportunidadeAtualizada = await getOne(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.id = ?
            `, [id]);

            return res.json(oportunidadeAtualizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar oportunidade' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [id]);
            if (!oportunidade) {
                return res.status(404).json({ erro: 'Oportunidade não encontrada' });
            }

            await runQuery('DELETE FROM oportunidades WHERE id = ?', [id]);

            return res.status(204).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir oportunidade' });
        }
    }

    async listarPorCategoria(req, res) {
        try {
            const { categoria_id } = req.params;

            // Verifica se a categoria existe
            const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
            if (!categoria) {
                return res.status(404).json({ erro: 'Categoria não encontrada' });
            }

            const oportunidades = await getAll(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.categoria_id = ?
                ORDER BY o.created_at DESC
            `, [categoria_id]);

            return res.json(oportunidades);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar oportunidades por categoria' });
        }
    }

    async listarPorOrganizacao(req, res) {
        try {
            const { organizacao_id } = req.params;

            // Verifica se a organização existe
            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
            if (!organizacao) {
                return res.status(404).json({ erro: 'Organização não encontrada' });
            }

            const oportunidades = await getAll(`
                SELECT 
                    o.*,
                    c.nome as categoria_nome,
                    org.nome as organizacao_nome,
                    org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.organizacao_id = ?
                ORDER BY o.created_at DESC
            `, [organizacao_id]);

            return res.json(oportunidades);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar oportunidades por organização' });
        }
    }
}

export default new OportunidadesController();