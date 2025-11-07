import { db } from "../database/db.js";
import { successResponse, createdResponse, noContentResponse } from "../helpers/responseHelper.js";
import { AppError } from "../middlewares/errorHandler.js";

export const list = (_req, res, next) => {
  try {
    const rows = db.prepare(`SELECT id, nome, descricao FROM categorias ORDER BY nome ASC`).all();
    return successResponse(res, rows);
  } catch (error) {
    next(error);
  }
};

export const get = (req, res, next) => {
  try {
    const row = db.prepare(`SELECT id, nome, descricao FROM categorias WHERE id = ?`).get(req.params.id);
    if (!row) {
      throw new AppError("Categoria não encontrada", 404);
    }
    return successResponse(res, row);
  } catch (error) {
    next(error);
  }
};

export const create = (req, res, next) => {
  try {
    const { nome, descricao } = req.body;
    
    const info = db.prepare(
      `INSERT INTO categorias (nome, descricao) VALUES (?, ?)`
    ).run(nome, descricao || null);
    
    const row = db.prepare(`SELECT id, nome, descricao FROM categorias WHERE id = ?`).get(info.lastInsertRowid);
    return createdResponse(res, row, "Categoria criada com sucesso");
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) {
      throw new AppError("Categoria já existe", 409);
    }
    next(error);
  }
};

export const update = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { nome, descricao } = req.body;

    const r = db.prepare(
      `UPDATE categorias SET nome = COALESCE(?, nome), descricao = COALESCE(?, descricao) WHERE id = ?`
    ).run(nome || null, descricao, id);
    
    if (r.changes === 0) {
      throw new AppError("Categoria não encontrada", 404);
    }
    
    const row = db.prepare(`SELECT id, nome, descricao FROM categorias WHERE id = ?`).get(id);
    return successResponse(res, row, "Categoria atualizada com sucesso");
  } catch (error) {
    if (String(error?.message || "").includes("UNIQUE")) {
      throw new AppError("Já existe outra categoria com esse nome", 409);
    }
    next(error);
  }
};

export const remove = (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const r = db.prepare(`DELETE FROM categorias WHERE id = ?`).run(id);
    
    if (r.changes === 0) {
      throw new AppError("Categoria não encontrada", 404);
    }
    
    return noContentResponse(res);
  } catch (error) {
    next(error);
  }
};
