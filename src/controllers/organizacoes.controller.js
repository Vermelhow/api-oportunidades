import { getAll, getOne, runQuery } from '../database/db.js';
import { successResponse, createdResponse, noContentResponse } from '../helpers/responseHelper.js';
import { AppError } from '../middlewares/errorHandler.js';

class OrganizacoesController {
    async listar(req, res, next) {
        try {
            const organizacoes = await getAll(`
                SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at
                FROM organizacoes
                ORDER BY nome
            `);
            
            return successResponse(res, organizacoes);
        } catch (error) {
            next(error);
        }
    }

    async buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            const organizacao = await getOne(`
                SELECT id, nome, descricao, email, telefone, website, endereco, created_at, updated_at
                FROM organizacoes
                WHERE id = ?
            `, [id]);

            if (!organizacao) {
                throw new AppError('Organização não encontrada', 404);
            }

            return successResponse(res, organizacao);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
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
                throw new AppError('Nome e email são obrigatórios', 400);
            }

            // Verifica se já existe uma organização com este email
            const organizacaoExistente = await getOne(
                'SELECT id FROM organizacoes WHERE email = ?',
                [email]
            );

            if (organizacaoExistente) {
                throw new AppError('Já existe uma organização com este email', 400);
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

            return createdResponse(res, organizacao, 'Organização criada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
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
                throw new AppError('Organização não encontrada', 404);
            }

            // Se o email foi alterado, verifica se já existe
            if (email && email !== organizacao.email) {
                const organizacaoExistente = await getOne(
                    'SELECT id FROM organizacoes WHERE email = ? AND id != ?',
                    [email, id]
                );

                if (organizacaoExistente) {
                    throw new AppError('Já existe uma organização com este email', 400);
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

            return successResponse(res, organizacaoAtualizada, 'Organização atualizada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            const organizacao = await getOne('SELECT id FROM organizacoes WHERE id = ?', [id]);
            if (!organizacao) {
                throw new AppError('Organização não encontrada', 404);
            }

            await runQuery('DELETE FROM organizacoes WHERE id = ?', [id]);

            return noContentResponse(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new OrganizacoesController();