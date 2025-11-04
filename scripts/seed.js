import { db } from '../src/database/db.js';
import bcrypt from 'bcrypt';

function seedCategorias() {
    console.log("Aplicando seed de categorias...");
    
    const categorias = [
        { nome: "Curso", descricao: "Cursos gratuitos e de curta duração" },
        { nome: "Emprego", descricao: "Vagas de emprego e estágios" },
        { nome: "Mutirão", descricao: "Ações sociais e serviços comunitários" }
    ];

    // Insere cada categoria se não existir
    for (const cat of categorias) {
        try {
            db.prepare(`
                INSERT OR IGNORE INTO categorias (nome, descricao) 
                VALUES (?, ?)
            `).run(cat.nome, cat.descricao);
        } catch (e) {
            console.error(`Erro ao inserir categoria ${cat.nome}:`, e.message);
        }
    }
}

async function seedPessoas() {
    console.log('Iniciando seed de pessoas...');

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

    const pessoasIds = {};

    for (const pessoa of pessoas) {
        try {
            // Hash da senha
            const senhaHash = await bcrypt.hash(pessoa.senha, 10);
            
            db.prepare(`
                INSERT OR IGNORE INTO pessoas (
                    nome, email, senha, bio, linkedin_url, github_url, portfolio_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                pessoa.nome,
                pessoa.email,
                senhaHash,
                pessoa.bio,
                pessoa.linkedin_url,
                pessoa.github_url,
                pessoa.portfolio_url
            );

            // Guardar o ID para uso posterior
            const result = db.prepare('SELECT id FROM pessoas WHERE email = ?').get(pessoa.email);
            pessoasIds[pessoa.email] = result.id;
        } catch (error) {
            console.error(`Erro ao inserir pessoa ${pessoa.nome}:`, error);
        }
    }

    return pessoasIds;
}

function waitForPessoas() {
    // Função auxiliar para garantir que as pessoas foram inseridas
    let tentativas = 0;
    const maxTentativas = 10;
    let pessoasIds = {};

    // Tenta buscar os IDs das pessoas
    function buscaIds() {
        const pessoas = [
            'joao.silva@email.com',
            'maria.santos@email.com',
            'pedro.oliveira@email.com',
            'ana.costa@email.com',
            'lucas.ferreira@email.com'
        ];

        for (const email of pessoas) {
            const result = db.prepare('SELECT id FROM pessoas WHERE email = ?').get(email);
            if (result) {
                pessoasIds[email] = result.id;
            } else {
                return false;
            }
        }

        return true;
    }

    // Loop até conseguir todos os IDs ou atingir o máximo de tentativas
    while (tentativas < maxTentativas) {
        if (buscaIds()) {
            return pessoasIds;
        }
        tentativas++;
        // Espera 100ms antes da próxima tentativa
        new Promise(resolve => setTimeout(resolve, 100));
    }

    throw new Error('Não foi possível obter os IDs das pessoas após várias tentativas');
}

function seedInteresses() {
    console.log('Inserindo interesses...');
    
    const pessoasIds = waitForPessoas();
    
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
        try {
            const pessoaId = pessoasIds[interesse.pessoa_email];
            if (!pessoaId) {
                console.error(`ID não encontrado para pessoa ${interesse.pessoa_email}`);
                continue;
            }

            db.prepare(`
                INSERT OR IGNORE INTO interesses (
                    pessoa_id, oportunidade_id, status, mensagem
                ) VALUES (?, ?, ?, ?)
            `).run(
                pessoaId,
                interesse.oportunidade_id,
                interesse.status,
                interesse.mensagem
            );
        } catch (error) {
            console.error(`Erro ao inserir interesse para ${interesse.pessoa_email}:`, error);
        }
    }
}

function seedOportunidades() {
    console.log('Criando oportunidades...');

    const oportunidades = [
        {
            titulo: 'Desenvolvedor Full Stack Junior',
            descricao: 'Vaga para desenvolvedor web com conhecimento em React e Node.js',
            categoria_id: 2, // Emprego
            organizacao_id: 1,
            tipo: 'emprego',
            status: 'ativa',
            data_inicio: '2025-11-10',
            requisitos: 'React, Node.js, Git',
            beneficios: 'Vale refeição, Vale transporte, Plano de saúde',
            salario_min: 3000.00,
            salario_max: 4500.00,
            formato: 'hibrido',
            localizacao: 'São Paulo, SP'
        },
        {
            titulo: 'Curso de Programação Web',
            descricao: 'Curso gratuito de desenvolvimento web para iniciantes',
            categoria_id: 1, // Curso
            organizacao_id: 2,
            tipo: 'curso',
            status: 'ativa',
            data_inicio: '2025-12-01',
            data_fim: '2026-02-28',
            requisitos: 'Conhecimentos básicos de informática',
            formato: 'remoto'
        },
        {
            titulo: 'Enfermeiro(a) para UBS',
            descricao: 'Vaga para enfermeiro(a) em Unidade Básica de Saúde',
            categoria_id: 2, // Emprego
            organizacao_id: 3,
            tipo: 'emprego',
            status: 'ativa',
            data_inicio: '2025-11-15',
            requisitos: 'COREN ativo, experiência em UBS',
            beneficios: 'Vale alimentação, Plano de saúde',
            salario_min: 4500.00,
            salario_max: 6000.00,
            formato: 'presencial',
            localizacao: 'Santos, SP'
        },
        {
            titulo: 'Designer UI/UX Junior',
            descricao: 'Vaga para designer com foco em interfaces e experiência do usuário',
            categoria_id: 2, // Emprego
            organizacao_id: 1,
            tipo: 'emprego',
            status: 'ativa',
            data_inicio: '2025-11-20',
            requisitos: 'Figma, Adobe XD, conhecimento em Design System',
            beneficios: 'Vale refeição, Home Office',
            salario_min: 3500.00,
            salario_max: 5000.00,
            formato: 'remoto'
        },
        {
            titulo: 'Mutirão de Limpeza de Praia',
            descricao: 'Ação voluntária para limpeza da praia e conscientização ambiental',
            categoria_id: 3, // Mutirão
            organizacao_id: 4,
            tipo: 'evento',
            status: 'ativa',
            data_inicio: '2025-12-15',
            data_fim: '2025-12-15',
            requisitos: 'Maior de 18 anos',
            formato: 'presencial',
            localizacao: 'Praia do Gonzaga, Santos, SP'
        }
    ];

    for (const oportunidade of oportunidades) {
        try {
            db.prepare(`
                INSERT OR IGNORE INTO oportunidades (
                    titulo, descricao, categoria_id, organizacao_id, tipo, status,
                    data_inicio, data_fim, requisitos, beneficios,
                    salario_min, salario_max, formato, localizacao
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).run(
                oportunidade.titulo,
                oportunidade.descricao,
                oportunidade.categoria_id,
                oportunidade.organizacao_id,
                oportunidade.tipo,
                oportunidade.status,
                oportunidade.data_inicio,
                oportunidade.data_fim || null,
                oportunidade.requisitos,
                oportunidade.beneficios || null,
                oportunidade.salario_min || null,
                oportunidade.salario_max || null,
                oportunidade.formato,
                oportunidade.localizacao || null
            );
        } catch (error) {
            console.error(`Erro ao inserir oportunidade ${oportunidade.titulo}:`, error);
        }
    }
}

async function seedOrganizacoes() {
    console.log('Criando organizações...');

    const organizacoes = [
        {
            nome: 'TechCorp Solutions',
            email: 'contato@techcorp.com',
            senha: 'senha123',
            descricao: 'Empresa de desenvolvimento de software',
            website: 'https://techcorp.com',
            linkedin_url: 'https://linkedin.com/company/techcorp'
        },
        {
            nome: 'Instituto Code+',
            email: 'contato@codeplus.org',
            senha: 'senha123',
            descricao: 'Instituto de ensino de programação',
            website: 'https://codeplus.org',
            linkedin_url: 'https://linkedin.com/company/codeplus'
        },
        {
            nome: 'Secretaria Municipal de Saúde',
            email: 'saude@santos.sp.gov.br',
            senha: 'senha123',
            descricao: 'Órgão público responsável pela saúde municipal',
            website: 'https://santos.sp.gov.br/saude'
        },
        {
            nome: 'ONG Praia Limpa',
            email: 'contato@praialimpa.ong.br',
            senha: 'senha123',
            descricao: 'Organização focada em preservação ambiental',
            website: 'https://praialimpa.ong.br',
            instagram_url: '@ong.praialimpa'
        }
    ];

    for (const org of organizacoes) {
        try {
            const senhaHash = await bcrypt.hash(org.senha, 10);
            
            db.prepare(`
                INSERT OR IGNORE INTO organizacoes (
                    nome, email, senha, descricao, website,
                    linkedin_url, instagram_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
            `).run(
                org.nome,
                org.email,
                senhaHash,
                org.descricao,
                org.website,
                org.linkedin_url || null,
                org.instagram_url || null
            );
        } catch (error) {
            console.error(`Erro ao inserir organização ${org.nome}:`, error);
        }
    }
}

function waitForOrganizacoes() {
    let tentativas = 0;
    const maxTentativas = 10;

    while (tentativas < maxTentativas) {
        const org = db.prepare('SELECT id FROM organizacoes LIMIT 1').get();
        if (org) {
            return true;
        }
        tentativas++;
        // Pequena pausa entre tentativas
        new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
}

function waitForCategorias() {
    let tentativas = 0;
    const maxTentativas = 10;

    while (tentativas < maxTentativas) {
        const cat = db.prepare('SELECT id FROM categorias LIMIT 1').get();
        if (cat) {
            return true;
        }
        tentativas++;
        new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
}

async function runSeeds() {
    try {
        console.log('Iniciando processo de seeds...');
        
        // Executar seeds em sequência para manter a ordem das dependências
        seedCategorias();
        if (!waitForCategorias()) {
            throw new Error('Falha ao criar categorias');
        }
        console.log('Categorias adicionadas');

        await seedOrganizacoes();
        if (!waitForOrganizacoes()) {
            throw new Error('Falha ao criar organizações');
        }
        console.log('Organizações adicionadas');

        await seedPessoas();
        console.log('Pessoas adicionadas');

        seedOportunidades();
        console.log('Oportunidades adicionadas');

        seedInteresses();
        console.log('Interesses adicionados');
        
        console.log('Todos os seeds foram aplicados com sucesso!');
    } catch (error) {
        console.error('Erro durante o processo de seed:', error);
        throw error;
    }
}

// Executar todos os seeds
runSeeds().catch(error => {
    console.error('Erro fatal durante o seed:', error);
    process.exit(1);
});