import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { buildOpportunityReading, formatSpokenDate, formatSpokenMoney } from './opportunityReading.js';

const FULL = {
  id: 42,
  titulo: 'Desenvolvedor(a) Front-end',
  descricao: 'Atuar no desenvolvimento de interfaces acessíveis.\nTrabalho em equipe.',
  requisitos: 'React\nAcessibilidade (WCAG)',
  beneficios: 'Vale-refeição\nPlano de saúde',
  tipo: 'estagio',
  status: 'ativa',
  formato: 'hibrido',
  localizacao: 'Salvador, BA',
  vagas_disponiveis: 3,
  data_inicio: '2026-12-01',
  data_fim: '2026-12-31',
  salario_min: 1500,
  salario_max: '2500.5',
  categoria_nome: 'Tecnologia',
  organizacao_nome: 'CINE',
  link_inscricao: 'https://empresa.example.com/vaga?token=abc123',
};

const text = (segments) => segments.join('\n');

describe('buildOpportunityReading', () => {
  it('lê título, identificação, informações principais e textos longos, nessa ordem', () => {
    const segments = buildOpportunityReading(FULL);
    assert.equal(segments.length, 6);
    assert.equal(segments[0], 'Oportunidade: Desenvolvedor(a) Front-end.');
    assert.equal(segments[1], 'Situação: Ativa. Tipo: Estágio. Categoria: Tecnologia. Organização: CINE.');
    assert.match(segments[2], /^Informações principais\. Localização: Salvador, BA\. Formato: Híbrido\. Vagas: 3 vagas\./);
    assert.match(segments[2], /Período: de 1 de dezembro de 2026 até 31 de dezembro de 2026\./);
    assert.match(segments[2], /Remuneração: de R\$ 1\.500,00 a R\$ 2\.500,50\./);
    assert.match(segments[3], /^Sobre a oportunidade\.\nAtuar no desenvolvimento/);
    assert.match(segments[4], /^Requisitos\.\nReact/);
    assert.match(segments[5], /^Benefícios\.\nVale-refeição/);
  });

  it('não lê ids, link de inscrição nem campos desconhecidos ou sensíveis', () => {
    const spoken = text(
      buildOpportunityReading({
        ...FULL,
        senha: 'segredo123',
        token: 'jwt.token.valor',
        email: 'pessoa@privado.com',
        cpf: '123.456.789-00',
        telefone: '71 99999-0000',
        pessoa_id: 777,
        organizacao_id: 555,
      })
    );
    for (const forbidden of ['segredo123', 'jwt.token', 'pessoa@privado.com', '123.456.789-00', '99999-0000', 'abc123', 'empresa.example.com', '777', '555', ' 42']) {
      assert.equal(spoken.includes(forbidden), false, `não deveria ler: ${forbidden}`);
    }
  });

  it('omite o que não existe, sem lacunas nem "undefined"', () => {
    const segments = buildOpportunityReading({ titulo: 'Só título', descricao: '   ', requisitos: null });
    assert.deepEqual(segments, ['Oportunidade: Só título.']);
    assert.equal(text(segments).includes('undefined'), false);
    assert.equal(text(segments).includes('null'), false);
  });

  it('devolve lista vazia para dados inválidos', () => {
    assert.deepEqual(buildOpportunityReading(null), []);
    assert.deepEqual(buildOpportunityReading(undefined), []);
    assert.deepEqual(buildOpportunityReading('texto'), []);
    assert.deepEqual(buildOpportunityReading({}), []);
  });

  it('usa singular em uma vaga e ignora quantidade inválida', () => {
    assert.match(buildOpportunityReading({ titulo: 'A', vagas_disponiveis: 1 })[1], /Vagas: 1 vaga\./);
    assert.equal(text(buildOpportunityReading({ titulo: 'A', vagas_disponiveis: 0 })).includes('Vagas'), false);
    assert.equal(text(buildOpportunityReading({ titulo: 'A', vagas_disponiveis: 'abc' })).includes('Vagas'), false);
  });

  it('descreve período e remuneração parciais', () => {
    assert.match(text(buildOpportunityReading({ titulo: 'A', data_inicio: '2026-03-05' })), /Início em 5 de março de 2026\./);
    assert.match(text(buildOpportunityReading({ titulo: 'A', data_fim: '2026-03-05' })), /Término em 5 de março de 2026\./);
    assert.match(text(buildOpportunityReading({ titulo: 'A', salario_min: 1000 })), /a partir de R\$ 1\.000,00\./);
    assert.match(text(buildOpportunityReading({ titulo: 'A', salario_max: 3000 })), /até R\$ 3\.000,00\./);
  });

  it('não duplica a pontuação final dos valores e mantém valores desconhecidos', () => {
    const segments = buildOpportunityReading({ titulo: 'Vaga de TI.', tipo: 'outro', formato: 'misto', status: 'em_analise' });
    assert.equal(segments[0], 'Oportunidade: Vaga de TI.');
    assert.equal(segments[1], 'Situação: em_analise. Tipo: outro.');
    assert.match(segments[2], /Formato: misto\./);
  });
});

describe('formatSpokenDate', () => {
  it('lê datas só com dia como dia do calendário local (sem voltar um dia)', () => {
    assert.equal(formatSpokenDate('2026-12-01'), '1 de dezembro de 2026');
    assert.equal(formatSpokenDate('2026-01-31'), '31 de janeiro de 2026');
  });

  it('aceita data com horário, ignora vazios e preserva texto inválido', () => {
    assert.match(formatSpokenDate('2026-06-15T12:00:00'), /15 de junho de 2026/);
    assert.equal(formatSpokenDate(''), null);
    assert.equal(formatSpokenDate(null), null);
    assert.equal(formatSpokenDate('em breve'), 'em breve');
  });
});

describe('formatSpokenMoney', () => {
  it('formata em reais e rejeita valores inválidos ou zerados', () => {
    assert.equal(formatSpokenMoney(1500), 'R$ 1.500,00');
    assert.equal(formatSpokenMoney('2000'), 'R$ 2.000,00');
    assert.equal(formatSpokenMoney(0), null);
    assert.equal(formatSpokenMoney(-5), null);
    assert.equal(formatSpokenMoney('abc'), null);
    assert.equal(formatSpokenMoney(null), null);
    assert.equal(formatSpokenMoney(''), null);
  });
});
