import { getAll, getOne, runQuery } from '../database/db.js';
import { successResponse, createdResponse, noContentResponse } from '../helpers/responseHelper.js';
import { AppError } from '../middlewares/errorHandler.js';

class OportunidadesController {
    async listar(req, res, next) {
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
            
            return successResponse(res, oportunidades);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
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
                throw new AppError('Oportunidade não encontrada', 404);
            }

            return successResponse(res, oportunidade);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const {
                titulo, descricao, categoria_id, organizacao_id, tipo,
                status = 'ativa',
                data_inicio, data_fim, requisitos, beneficios,
                salario_min, salario_max, formato, localizacao, link_inscricao
            } = req.body;

            // Validações básicas
            if (!titulo || !descricao || !categoria_id || !organizacao_id || !tipo) {
                throw new AppError('Campos obrigatórios: titulo, descricao, categoria_id, organizacao_id, tipo', 400);
            }

            // Verifica se a categoria existe
            const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
            if (!categoria) {
                throw new AppError('Categoria não encontrada', 404);
            }

            // Verifica se a organização existe
            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
            if (!organizacao) {
                throw new AppError('Organização não encontrada', 404);
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

            return createdResponse(res, oportunidade, 'Oportunidade criada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async _validarCategoriaOrganizacao(categoria_id, organizacao_id) {
        if (categoria_id) {
            const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
            if (!categoria) return { erro: 'Categoria não encontrada' };
        }
        
        if (organizacao_id) {
            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
            if (!organizacao) return { erro: 'Organização não encontrada' };
        }
        
        return null;
    }

    _prepararDadosAtualizacao(dadosNovos, dadosAtuais) {
        const valorOuAtual = (novo, atual) => novo === undefined ? atual : novo;
        
        return [
            dadosNovos.titulo || dadosAtuais.titulo,
            dadosNovos.descricao || dadosAtuais.descricao,
            dadosNovos.categoria_id || dadosAtuais.categoria_id,
            dadosNovos.organizacao_id || dadosAtuais.organizacao_id,
            dadosNovos.tipo || dadosAtuais.tipo,
            dadosNovos.status || dadosAtuais.status,
            valorOuAtual(dadosNovos.data_inicio, dadosAtuais.data_inicio),
            valorOuAtual(dadosNovos.data_fim, dadosAtuais.data_fim),
            valorOuAtual(dadosNovos.requisitos, dadosAtuais.requisitos),
            valorOuAtual(dadosNovos.beneficios, dadosAtuais.beneficios),
            valorOuAtual(dadosNovos.salario_min, dadosAtuais.salario_min),
            valorOuAtual(dadosNovos.salario_max, dadosAtuais.salario_max),
            valorOuAtual(dadosNovos.formato, dadosAtuais.formato),
            valorOuAtual(dadosNovos.localizacao, dadosAtuais.localizacao),
            valorOuAtual(dadosNovos.link_inscricao, dadosAtuais.link_inscricao)
        ];
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const dadosNovos = req.body;

            const oportunidade = await getOne('SELECT * FROM oportunidades WHERE id = ?', [id]);
            if (!oportunidade) {
                throw new AppError('Oportunidade não encontrada', 404);
            }

            const erroValidacao = await this._validarCategoriaOrganizacao(
                dadosNovos.categoria_id, 
                dadosNovos.organizacao_id
            );
            if (erroValidacao) {
                throw new AppError(erroValidacao.erro, 404);
            }

            const valores = this._prepararDadosAtualizacao(dadosNovos, oportunidade);
            
            await runQuery(
                `UPDATE oportunidades 
                SET titulo = ?, descricao = ?, categoria_id = ?, organizacao_id = ?,
                    tipo = ?, status = ?, data_inicio = ?, data_fim = ?, requisitos = ?,
                    beneficios = ?, salario_min = ?, salario_max = ?, formato = ?,
                    localizacao = ?, link_inscricao = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [...valores, id]
            );

            const oportunidadeAtualizada = await getOne(`
                SELECT o.*, c.nome as categoria_nome, org.nome as organizacao_nome,
                       org.email as organizacao_email
                FROM oportunidades o
                JOIN categorias c ON o.categoria_id = c.id
                JOIN organizacoes org ON o.organizacao_id = org.id
                WHERE o.id = ?
            `, [id]);

            return successResponse(res, oportunidadeAtualizada, 'Oportunidade atualizada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [id]);
            if (!oportunidade) {
                throw new AppError('Oportunidade não encontrada', 404);
            }

            await runQuery('DELETE FROM oportunidades WHERE id = ?', [id]);

            return noContentResponse(res);
        } catch (error) {
            next(error);
        }
    }

    async listarPorCategoria(req, res, next) {
        try {
            const { categoria_id } = req.params;

            // Verifica se a categoria existe
            const categoria = await getOne('SELECT id FROM categorias WHERE id = ?', [categoria_id]);
            if (!categoria) {
                throw new AppError('Categoria não encontrada', 404);
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

            return successResponse(res, oportunidades);
        } catch (error) {
            next(error);
        }
    }

    async listarPorOrganizacao(req, res, next) {
        try {
            const { organizacao_id } = req.params;

            // Verifica se a organização existe
            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [organizacao_id]);
            if (!organizacao) {
                throw new AppError('Organização não encontrada', 404);
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

            return successResponse(res, oportunidades);
        } catch (error) {
            next(error);
        }
    }
}

export default new OportunidadesController();