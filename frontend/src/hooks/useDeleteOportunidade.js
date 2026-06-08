import { useState } from 'react';
import { deleteOportunidade } from '../services/api';

/**
 * Hook customizado para gerenciar exclusão de oportunidades
 * 
 * Retorna:
 * - deleteItem: função para executar exclusão
 * - isDeleting: estado de loading durante exclusão
 * - deleteError: erro caso ocorra
 * - confirmDelete: objeto com estado do modal de confirmação
 * - openDeleteConfirm: abre modal de confirmação
 * - closeDeleteConfirm: fecha modal de confirmação
 * 
 * Exemplo de uso:
 * ```js
 * const { deleteItem, isDeleting, confirmDelete, openDeleteConfirm, closeDeleteConfirm } = useDeleteOportunidade();
 * 
 * // Abrir confirmação
 * openDeleteConfirm(id, titulo);
 * 
 * // No componente
 * <ConfirmModal
 *   isOpen={confirmDelete.isOpen}
 *   onClose={closeDeleteConfirm}
 *   onConfirm={() => deleteItem(confirmDelete.id, onSuccess)}
 *   loading={isDeleting}
 * />
 * ```
 */
export function useDeleteOportunidade() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    id: null,
    titulo: ''
  });

  /**
   * Abre o modal de confirmação de exclusão
   */
  const openDeleteConfirm = (id, titulo) => {
    setConfirmDelete({
      isOpen: true,
      id,
      titulo
    });
    setDeleteError(null);
  };

  /**
   * Fecha o modal de confirmação
   */
  const closeDeleteConfirm = () => {
    if (!isDeleting) {
      setConfirmDelete({
        isOpen: false,
        id: null,
        titulo: ''
      });
      setDeleteError(null);
    }
  };

  /**
   * Executa a exclusão da oportunidade
   * @param {number} id - ID da oportunidade a ser excluída
   * @param {function} onSuccess - Callback executado em caso de sucesso
   * @param {function} onError - Callback executado em caso de erro
   */
  const deleteItem = async (id, onSuccess, onError) => {
    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deleteOportunidade(id);

      // Fecha o modal
      closeDeleteConfirm();

      // Chama callback de sucesso se fornecido
      if (onSuccess) {
        onSuccess(id);
      }
    } catch (err) {
      console.error('Erro ao excluir oportunidade:', err);
      
      // Tentar extrair mensagem de erro amigável
      let errorMessage = 'Não foi possível excluir a oportunidade.';
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.data?.message) {
        errorMessage = err.data.message;
      } else if (err.status === 404) {
        errorMessage = 'Oportunidade não encontrada.';
      } else if (err.status === 403) {
        errorMessage = 'Você não tem permissão para excluir esta oportunidade.';
      }
      
      setDeleteError(errorMessage);

      // Chama callback de erro se fornecido
      if (onError) {
        onError(errorMessage);
      }
      
      // Não fecha o modal em caso de erro, permite retry
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteItem,
    isDeleting,
    deleteError,
    confirmDelete,
    openDeleteConfirm,
    closeDeleteConfirm
  };
}
