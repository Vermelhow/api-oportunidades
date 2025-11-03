import { runQuery, getOne } from '../src/database/db.js';
import bcrypt from 'bcrypt';

async function seed() {
    try {
        console.log('Iniciando seed de pessoas e interesses...');

        // Pessoas
        const pessoas = [
            {
                nome: 'João Silva',
                email: 'joao.silva@email.com',
                senha: 'senha123',
                bio: 'Estudante de Administração buscando oportunidades de estágio',
                linkedin_url: 'https://linkedin.com/in/joaosilva',
                github_url: null,
                portfolio_url: null
            },
            {
                nome: 'Maria Santos',
                email: 'maria.santos@email.com',
                senha: 'senha123',
                bio: 'Desenvolvedora web em busca de novos desafios',
                linkedin_url: 'https://linkedin.com/in/mariasantos',
                github_url: 'https://github.com/mariasantos',
                portfolio_url: 'https://mariasantos.dev'
            },
            {
                nome: 'Pedro Oliveira',
                email: 'pedro.oliveira@email.com',
                senha: 'senha123',
                bio: 'Recém-formado em Enfermagem',
                linkedin_url: 'https://linkedin.com/in/pedrooliveira',
                github_url: null,
                portfolio_url: null
            },
            {
                nome: 'Ana Costa',
                email: 'ana.costa@email.com',
                senha: 'senha123',
                bio: 'Estudante de Design procurando primeiro emprego',
                linkedin_url: 'https://linkedin.com/in/anacosta',
                github_url: null,
                portfolio_url: 'https://anacosta.portfolio.com'
            },
            {
                nome: 'Lucas Ferreira',
                email: 'lucas.ferreira@email.com',
                senha: 'senha123',
                bio: 'Jovem aprendiz em busca de oportunidades',
                linkedin_url: 'https://linkedin.com/in/lucasferreira',
                github_url: null,
                portfolio_url: null
            }
        ];

        console.log('Inserindo pessoas...');
        for (const pessoa of pessoas) {
            // Hash da senha
            const senhaHash = await bcrypt.hash(pessoa.senha, 10);
            
            await runQuery(
                `INSERT OR IGNORE INTO pessoas (
                    nome, email, senha, bio, linkedin_url, github_url, portfolio_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    pessoa.nome,
                    pessoa.email,
                    senhaHash,
                    pessoa.bio,
                    pessoa.linkedin_url,
                    pessoa.github_url,
                    pessoa.portfolio_url
                ]
            );
        }

        // Função auxiliar para buscar IDs
        async function getIds() {
            const pessoasIds = {};
            for (const pessoa of pessoas) {
                const result = await getOne('SELECT id FROM pessoas WHERE email = ?', [pessoa.email]);
                pessoasIds[pessoa.email] = result.id;
            }

            // Buscar algumas oportunidades para criar interesses
            return { pessoasIds };
        }

        const { pessoasIds } = await getIds();

        // Interesses
        console.log('Inserindo interesses...');
        const interesses = [
            {
                pessoa_email: 'joao.silva@email.com',
                oportunidade_id: 1,
                status: 'pendente',
                mensagem: 'Tenho muito interesse nesta oportunidade e acredito que meu perfil se encaixa perfeitamente.'
            },
            {
                pessoa_email: 'maria.santos@email.com',
                oportunidade_id: 2,
                status: 'aceito',
                mensagem: 'Gostaria muito de participar deste projeto.'
            },
            {
                pessoa_email: 'pedro.oliveira@email.com',
                oportunidade_id: 3,
                status: 'pendente',
                mensagem: 'Estou disponível para começar imediatamente.'
            },
            {
                pessoa_email: 'ana.costa@email.com',
                oportunidade_id: 4,
                status: 'aceito',
                mensagem: 'Tenho experiência na área e gostaria muito de contribuir.'
            },
            {
                pessoa_email: 'lucas.ferreira@email.com',
                oportunidade_id: 5,
                status: 'pendente',
                mensagem: 'Busco uma oportunidade para aprender e crescer profissionalmente.'
            }
        ];

        for (const interesse of interesses) {
            await runQuery(
                `INSERT OR IGNORE INTO interesses (
                    pessoa_id, oportunidade_id, status, mensagem
                ) VALUES (?, ?, ?, ?)`,
                [
                    pessoasIds[interesse.pessoa_email],
                    interesse.oportunidade_id,
                    interesse.status,
                    interesse.mensagem
                ]
            );
        }

        console.log('Seed de pessoas e interesses concluído com sucesso!');
    } catch (error) {
        console.error('Erro ao inserir dados:', error);
    }
}

// Executar o seed
seed();