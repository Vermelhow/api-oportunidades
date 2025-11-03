import { db } from '../database/db.js';

export const inscreverEmOportunidade = async (req, res) => {
  const { pessoa_id, oportunidade_id, mensagem } = req.body;

  try {
    // Verifica se a pessoa existe
    const pessoa = await db.get('SELECT * FROM pessoas_interessadas WHERE id = ?', [pessoa_id]);
    if (!pessoa) {
      return res.status(404).json({ error: 'Pessoa não encontrada' });
    }

    // Verifica se a oportunidade existe
    const oportunidade = await db.get('SELECT * FROM oportunidades WHERE id = ?', [oportunidade_id]);
    if (!oportunidade) {
      return res.status(404).json({ error: 'Oportunidade não encontrada' });
    }

    // Verifica se já existe uma inscrição
    const inscricaoExistente = await db.get(
      'SELECT * FROM inscricoes WHERE pessoa_id = ? AND oportunidade_id = ?',
      [pessoa_id, oportunidade_id]
    );

    if (inscricaoExistente) {
      return res.status(400).json({ error: 'Inscrição já existe' });
    }

    // Cria a inscrição
    const result = await db.run(
      'INSERT INTO inscricoes (pessoa_id, oportunidade_id, mensagem) VALUES (?, ?, ?)',
      [pessoa_id, oportunidade_id, mensagem]
    );

    res.status(201).json({
      id: result.lastID,
      pessoa_id,
      oportunidade_id,
      mensagem,
      status: 'pendente',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao criar inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarInscricoesPorPessoa = async (req, res) => {
  const { pessoa_id } = req.params;

  try {
    const inscricoes = await db.all(`
      SELECT i.*, o.titulo as oportunidade_titulo, o.descricao as oportunidade_descricao 
      FROM inscricoes i 
      JOIN oportunidades o ON i.oportunidade_id = o.id 
      WHERE i.pessoa_id = ?
      ORDER BY i.created_at DESC
    `, [pessoa_id]);

    res.json(inscricoes);
  } catch (error) {
    console.error('Erro ao listar inscrições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const listarInscricoesPorOportunidade = async (req, res) => {
  const { oportunidade_id } = req.params;

  try {
    const inscricoes = await db.all(`
      SELECT i.*, p.nome as pessoa_nome, p.email as pessoa_email 
      FROM inscricoes i 
      JOIN pessoas_interessadas p ON i.pessoa_id = p.id 
      WHERE i.oportunidade_id = ?
      ORDER BY i.created_at DESC
    `, [oportunidade_id]);

    res.json(inscricoes);
  } catch (error) {
    console.error('Erro ao listar inscrições:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const atualizarStatusInscricao = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusPermitidos = ['pendente', 'aprovada', 'rejeitada'];
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ 
      error: 'Status inválido',
      statusPermitidos
    });
  }

  try {
    const inscricao = await db.get('SELECT * FROM inscricoes WHERE id = ?', [id]);
    if (!inscricao) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    await db.run(
      'UPDATE inscricoes SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    const inscricaoAtualizada = await db.get('SELECT * FROM inscricoes WHERE id = ?', [id]);
    res.json(inscricaoAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar status da inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const cancelarInscricao = async (req, res) => {
  const { id } = req.params;

  try {
    const inscricao = await db.get('SELECT * FROM inscricoes WHERE id = ?', [id]);
    if (!inscricao) {
      return res.status(404).json({ error: 'Inscrição não encontrada' });
    }

    await db.run('DELETE FROM inscricoes WHERE id = ?', [id]);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao cancelar inscrição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};