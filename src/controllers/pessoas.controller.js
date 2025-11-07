import { getAll, getOne, runQuery } from '../database/db.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../middlewares/authMiddleware.js';
import { successResponse, createdResponse, noContentResponse } from '../helpers/responseHelper.js';
import { AppError } from '../middlewares/errorHandler.js';

export class PessoasController {
    listar(req, res, next) {
        try {
            const pessoas = getAll(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas`
            );
            
            return successResponse(res, pessoas);
        } catch (error) {
            next(error);
        }
    }

    buscarPorId(req, res, next) {
        try {
            const { id } = req.params;
            
            const pessoa = getOne(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas
                WHERE id = ?`,
                [id]
            );

            if (!pessoa) {
                throw new AppError('Pessoa não encontrada', 404);
            }

            return successResponse(res, pessoa);
        } catch (error) {
            next(error);
        }
    }

    listarInteresses(req, res, next) {
        try {
            const { id } = req.params;
            
            const interesses = getAll(
                `SELECT i.*, o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.pessoa_id = ?`,
                [id]
            );

            return successResponse(res, interesses);
        } catch (error) {
            next(error);
        }
    }

    async criar(req, res, next) {
        try {
            const { nome, email, senha, bio, linkedin_url, github_url, portfolio_url } = req.body;

            const pessoaExistente = getOne(
                'SELECT id FROM pessoas WHERE email = ?',
                [email]
            );
            
            if (pessoaExistente) {
                throw new AppError('Email já cadastrado', 400);
            }

            // Hash da senha
            const senhaHash = await bcrypt.hash(senha, 10);

            const result = await runQuery(
                `INSERT INTO pessoas (nome, email, senha, bio, linkedin_url, github_url, portfolio_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nome, email, senhaHash, bio, linkedin_url, github_url, portfolio_url]
            );

            const pessoa = await getOne(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas
                WHERE id = ?`,
                [result.lastID]
            );

            return createdResponse(res, pessoa, 'Pessoa criada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async atualizar(req, res, next) {
        try {
            const { id } = req.params;
            const { nome, email, senha, bio, linkedin_url, github_url, portfolio_url } = req.body;

            const pessoa = await getOne(
                'SELECT * FROM pessoas WHERE id = ?',
                [id]
            );

            if (!pessoa) {
                throw new AppError('Pessoa não encontrada', 404);
            }

            if (email && email !== pessoa.email) {
                const pessoaExistente = await getOne(
                    'SELECT id FROM pessoas WHERE email = ?',
                    [email]
                );
                
                if (pessoaExistente) {
                    throw new AppError('Email já cadastrado', 400);
                }
            }

            // Hash da nova senha se fornecida
            const senhaHash = senha ? await bcrypt.hash(senha, 10) : pessoa.senha;

            const dadosAtualizacao = {
                nome: nome || pessoa.nome,
                email: email || pessoa.email,
                senha: senhaHash,
                bio: bio === undefined ? pessoa.bio : bio,
                linkedin_url: linkedin_url === undefined ? pessoa.linkedin_url : linkedin_url,
                github_url: github_url === undefined ? pessoa.github_url : github_url,
                portfolio_url: portfolio_url === undefined ? pessoa.portfolio_url : portfolio_url
            };

            await runQuery(
                `UPDATE pessoas 
                SET nome = ?, email = ?, senha = ?, bio = ?, linkedin_url = ?, github_url = ?, portfolio_url = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?`,
                [
                    dadosAtualizacao.nome,
                    dadosAtualizacao.email,
                    dadosAtualizacao.senha,
                    dadosAtualizacao.bio,
                    dadosAtualizacao.linkedin_url,
                    dadosAtualizacao.github_url,
                    dadosAtualizacao.portfolio_url,
                    id
                ]
            );

            const pessoaAtualizada = await getOne(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas
                WHERE id = ?`,
                [id]
            );

            return successResponse(res, pessoaAtualizada, 'Pessoa atualizada com sucesso');
        } catch (error) {
            next(error);
        }
    }

    async excluir(req, res, next) {
        try {
            const { id } = req.params;

            const pessoa = await getOne(
                'SELECT id FROM pessoas WHERE id = ?',
                [id]
            );

            if (!pessoa) {
                throw new AppError('Pessoa não encontrada', 404);
            }

            // Excluir interesses relacionados
            await runQuery(
                'DELETE FROM interesses WHERE pessoa_id = ?',
                [id]
            );

            // Excluir a pessoa
            await runQuery(
                'DELETE FROM pessoas WHERE id = ?',
                [id]
            );

            return noContentResponse(res);
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, senha } = req.body;

            // Busca a pessoa pelo email (incluindo a senha)
            const pessoa = await getOne(
                'SELECT id, nome, email, senha FROM pessoas WHERE email = ?',
                [email]
            );

            if (!pessoa) {
                throw new AppError('Credenciais inválidas', 401);
            }

            // Verifica a senha
            const senhaValida = await bcrypt.compare(senha, pessoa.senha);

            if (!senhaValida) {
                throw new AppError('Credenciais inválidas', 401);
            }

            // Gera o token JWT
            const token = generateToken({
                id: pessoa.id,
                nome: pessoa.nome,
                email: pessoa.email
            });

            // Retorna os dados do usuário (sem a senha) e o token
            return successResponse(res, {
                user: {
                    id: pessoa.id,
                    nome: pessoa.nome,
                    email: pessoa.email
                },
                token
            }, 'Login realizado com sucesso');
        } catch (error) {
            next(error);
        }
    }
}

export default new PessoasController();