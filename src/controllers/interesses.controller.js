import { getAll, getOne, runQuery } from '../database/db.js';
import { successResponse, createdResponse, noContentResponse } from '../helpers/responseHelper.js';
import { AppError } from '../middlewares/errorHandler.js';

class InteressesController {
    async listar(req, res, next) {
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
            
            return successResponse(res, interesses);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
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
                throw new AppError('Interesse não encontrado', 404);
            }

            return successResponse(res, interesse);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const { pessoa_id, oportunidade_id, mensagem } = req.body;

            if (!pessoa_id || !oportunidade_id) {
                throw new AppError('pessoa_id e oportunidade_id são obrigatórios', 400);
            }

            // Verificar se a pessoa existe
            const pessoa = await getOne('SELECT id FROM pessoas WHERE id = ?', [pessoa_id]);
            if (!pessoa) {
                throw new AppError('Pessoa não encontrada', 404);
            }

            // Verificar se a oportunidade existe
            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [oportunidade_id]);
            if (!oportunidade) {
                throw new AppError('Oportunidade não encontrada', 404);
            }

            // Verificar se já existe um interesse para esta pessoa e oportunidade
            const interesseExistente = await getOne(
                'SELECT id FROM interesses WHERE pessoa_id = ? AND oportunidade_id = ?',
                [pessoa_id, oportunidade_id]
            );
                
            if (interesseExistente) {
                throw new AppError('Já existe um interesse registrado para esta pessoa nesta oportunidade', 400);
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

            return createdResponse(res, interesse, 'Interesse criado com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const { status, mensagem } = req.body;

            const interesse = await getOne('SELECT * FROM interesses WHERE id = ?', [id]);
            if (!interesse) {
                throw new AppError('Interesse não encontrado', 404);
            }

            if (status && !['pendente', 'aceito', 'recusado'].includes(status)) {
                throw new AppError('Status inválido', 400);
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

            return successResponse(res, interesseAtualizado, 'Interesse atualizado com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            const interesse = await getOne('SELECT id FROM interesses WHERE id = ?', [id]);
            if (!interesse) {
                throw new AppError('Interesse não encontrado', 404);
            }

            await runQuery('DELETE FROM interesses WHERE id = ?', [id]);

            return noContentResponse(res);
        } catch (error) {
            next(error);
        }
    }

    async listarPorPessoa(req, res, next) {
        try {
            const { pessoa_id } = req.params;

            const pessoa = await getOne('SELECT id FROM pessoas WHERE id = ?', [pessoa_id]);
            if (!pessoa) {
                throw new AppError('Pessoa não encontrada', 404);
            }

            const interesses = await getAll(`
                SELECT 
                    i.*,
                    o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.pessoa_id = ?
            `, [pessoa_id]);

            return successResponse(res, interesses);
        } catch (error) {
            next(error);
        }
    }

    async listarPorOportunidade(req, res, next) {
        try {
            const { oportunidade_id } = req.params;

            const oportunidade = await getOne('SELECT id FROM oportunidades WHERE id = ?', [oportunidade_id]);
            if (!oportunidade) {
                throw new AppError('Oportunidade não encontrada', 404);
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

            return successResponse(res, interesses);
        } catch (error) {
            next(error);
        }
    }
}

export default new InteressesController();