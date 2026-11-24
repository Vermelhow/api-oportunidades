/**
 * Roteiro de leitura de uma oportunidade (REQ-A33)
 *
 * Monta, a partir dos dados da oportunidade, os trechos que o leitor em voz
 * alta vai falar. Só entram campos públicos do anúncio (lista fixa abaixo):
 * ids, link de inscrição, dados da sessão do usuário e qualquer outro campo
 * nunca são lidos. Funciona sem React, então é testado com node:test.
 */

const STATUS_LABELS = { ativa: 'Ativa', encerrada: 'Encerrada', pausada: 'Pausada' };

const TIPO_LABELS = {
  emprego: 'Emprego',
  estagio: 'Estágio',
  curso: 'Curso',
  evento: 'Evento',
  projeto: 'Projeto',
  voluntariado: 'Voluntariado',
};

const FORMATO_LABELS = { presencial: 'Presencial', remoto: 'Remoto', hibrido: 'Híbrido' };

function hasText(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

// Um dado com rótulo vira uma frase curta. Pontuação final do valor é removida para não duplicar o ponto.
function sentence(label, value) {
  return `${label}: ${String(value).trim().replace(/[.!?…;:]+$/, '')}.`;
}

// Datas só com dia (AAAA-MM-DD) são lidas como dia do calendário local: new Date('2026-12-01') seria 30/11 no Brasil
export function formatSpokenDate(value) {
  if (!hasText(value)) return null;
  const text = String(value).trim();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(text) ? new Date(`${text}T00:00:00`) : new Date(text);
  if (Number.isNaN(date.getTime())) return text;
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatSpokenMoney(value) {
  const number = Number(value);
  if (!hasText(value) || !Number.isFinite(number) || number <= 0) return null;
  // Intl separa "R$" do valor com espaço não separável; espaço comum evita surpresas na fala e nas comparações
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number).replace(/\u00A0/g, ' ');
}

function periodSentence(inicio, fim) {
  const start = formatSpokenDate(inicio);
  const finish = formatSpokenDate(fim);
  if (start && finish) return `Período: de ${start} até ${finish}.`;
  if (start) return `Início em ${start}.`;
  if (finish) return `Término em ${finish}.`;
  return null;
}

function salarySentence(min, max) {
  const low = formatSpokenMoney(min);
  const high = formatSpokenMoney(max);
  if (low && high) return `Remuneração: de ${low} a ${high}.`;
  if (low) return `Remuneração: a partir de ${low}.`;
  if (high) return `Remuneração: até ${high}.`;
  return null;
}

function vagasSentence(vagas) {
  const number = Number(vagas);
  if (!hasText(vagas) || !Number.isFinite(number) || number <= 0) return null;
  return `Vagas: ${number} ${number === 1 ? 'vaga' : 'vagas'}.`;
}

/**
 * Ordem pensada para quem ouve: título e identificação primeiro, depois as
 * informações principais e, por fim, o texto longo (descrição, requisitos e
 * benefícios), que o usuário pode interromper a qualquer momento.
 *
 * @returns {string[]} trechos de texto; vazio se não houver título nem conteúdo
 */
export function buildOpportunityReading(oportunidade) {
  if (!oportunidade || typeof oportunidade !== 'object') return [];
  const op = oportunidade;
  const segments = [];

  if (hasText(op.titulo)) segments.push(sentence('Oportunidade', op.titulo));

  const identification = [
    hasText(op.status) && sentence('Situação', STATUS_LABELS[op.status] || op.status),
    hasText(op.tipo) && sentence('Tipo', TIPO_LABELS[op.tipo] || op.tipo),
    hasText(op.categoria_nome) && sentence('Categoria', op.categoria_nome),
    hasText(op.organizacao_nome) && sentence('Organização', op.organizacao_nome),
  ].filter(Boolean);
  if (identification.length > 0) segments.push(identification.join(' '));

  const mainInfo = [
    hasText(op.localizacao) && sentence('Localização', op.localizacao),
    hasText(op.formato) && sentence('Formato', FORMATO_LABELS[op.formato] || op.formato),
    vagasSentence(op.vagas_disponiveis),
    periodSentence(op.data_inicio, op.data_fim),
    salarySentence(op.salario_min, op.salario_max),
  ].filter(Boolean);
  if (mainInfo.length > 0) segments.push(`Informações principais. ${mainInfo.join(' ')}`);

  if (hasText(op.descricao)) segments.push(`Sobre a oportunidade.\n${op.descricao}`);
  if (hasText(op.requisitos)) segments.push(`Requisitos.\n${op.requisitos}`);
  if (hasText(op.beneficios)) segments.push(`Benefícios.\n${op.beneficios}`);

  return segments;
}
