import { db, getAll, getOne, runQuery } from '../database/db.js';
import bcrypt from 'bcrypt';

export class PessoasController {
    listar(req, res) {
        try {
            const pessoas = getAll(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas`
            );
            
            return res.json(pessoas);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar pessoas' });
        }
    }

    buscarPorId(req, res) {
        try {
            const { id } = req.params;
            
            const pessoa = getOne(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas
                WHERE id = ?`,
                [id]
            );

            if (!pessoa) {
                return res.status(404).json({ erro: 'Pessoa não encontrada' });
            }

            return res.json(pessoa);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao buscar pessoa' });
        }
    }

    listarInteresses(req, res) {
        try {
            const { id } = req.params;
            
            const interesses = getAll(
                `SELECT i.*, o.titulo as oportunidade_titulo
                FROM interesses i
                JOIN oportunidades o ON i.oportunidade_id = o.id
                WHERE i.pessoa_id = ?`,
                [id]
            );

            return res.json(interesses);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao listar interesses' });
        }
    }

    async criar(req, res) {
        try {
            const { nome, email, senha, bio, linkedin_url, github_url, portfolio_url } = req.body;

            if (!nome || !email || !senha) {
                return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
            }

            // Validar email
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                return res.status(400).json({ erro: 'Email inválido' });
            }

            const pessoaExistente = getOne(
                'SELECT id FROM pessoas WHERE email = ?',
                [email]
            );
            
            if (pessoaExistente) {
                return res.status(400).json({ erro: 'Email já cadastrado' });
            }

            const result = await runQuery(
                `INSERT INTO pessoas (nome, email, senha, bio, linkedin_url, github_url, portfolio_url)
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [nome, email, senha, bio, linkedin_url, github_url, portfolio_url]
            );

            const pessoa = await getOne(
                `SELECT id, nome, email, bio, linkedin_url, github_url, portfolio_url, created_at, updated_at
                FROM pessoas
                WHERE id = ?`,
                [result.lastID]
            );

            return res.status(201).json(pessoa);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar pessoa' });
        }
    }

    async atualizar(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha, bio, linkedin_url, github_url, portfolio_url } = req.body;

            const pessoa = await getOne(
                'SELECT * FROM pessoas WHERE id = ?',
                [id]
            );

            if (!pessoa) {
                return res.status(404).json({ erro: 'Pessoa não encontrada' });
            }

            if (email && email !== pessoa.email) {
                const pessoaExistente = await getOne(
                    'SELECT id FROM pessoas WHERE email = ?',
                    [email]
                );
                
                if (pessoaExistente) {
                    return res.status(400).json({ erro: 'Email já cadastrado' });
                }
            }

            const dadosAtualizacao = {
                nome: nome || pessoa.nome,
                email: email || pessoa.email,
                senha: senha || pessoa.senha, // Em uma implementação real, a senha deve ser hasheada
                bio: bio !== undefined ? bio : pessoa.bio,
                linkedin_url: linkedin_url !== undefined ? linkedin_url : pessoa.linkedin_url,
                github_url: github_url !== undefined ? github_url : pessoa.github_url,
                portfolio_url: portfolio_url !== undefined ? portfolio_url : pessoa.portfolio_url
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

            return res.json(pessoaAtualizada);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar pessoa' });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;

            const pessoa = await getOne(
                'SELECT id FROM pessoas WHERE id = ?',
                [id]
            );

            if (!pessoa) {
                return res.status(404).json({ erro: 'Pessoa não encontrada' });
            }

            await db.serialize(async () => {
                await runQuery('BEGIN TRANSACTION');
                try {
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

                    await runQuery('COMMIT');
                    return res.status(204).send();
                } catch (error) {
                    await runQuery('ROLLBACK');
                    throw error;
                }
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao excluir pessoa' });
        }
    }
}

export default new PessoasController();