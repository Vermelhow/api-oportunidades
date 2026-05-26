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
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao excluir oportunidade';
      setDeleteError(errorMessage);

      // Chama callback de erro se fornecido
      if (onError) {
        onError(errorMessage);
      }

      console.error('Erro ao excluir oportunidade:', err);
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
