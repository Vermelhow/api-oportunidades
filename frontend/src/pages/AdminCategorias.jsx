import { useEffect, useState } from 'react';
import {
  getCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from '../services/api';
import { useNotification } from '../context/NotificationContext';
import {
  Sidebar,
  Loading,
  ErrorMessage,
  EmptyState,
  ConfirmModal,
  FormField,
  FormActions,
  ButtonLoading,
} from '../components';
import '../styles/AdminCategorias.css';

const FORM_INICIAL = { nome: '', descricao: '' };

function AdminCategorias() {
  const { showSuccess, showError } = useNotification();

  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState(FORM_INICIAL);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    carregarCategorias();
  }, []);

  async function carregarCategorias() {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategorias();
      setCategorias(response?.data || response || []);
    } catch (err) {
      setError(err);
      showError(err.message || 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  function validarFormulario() {
    const novosErros = {};

    if (!formData.nome.trim()) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 3) {
      novosErros.nome = 'Nome deve ter pelo menos 3 caracteres';
    }

    if (formData.descricao && formData.descricao.length > 500) {
      novosErros.descricao = 'Descrição deve ter no máximo 500 caracteres';
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function iniciarEdicao(categoria) {
    setEditingId(categoria.id);
    setFormData({ nome: categoria.nome, descricao: categoria.descricao || '' });
    setErrors({});
  }

  function cancelarEdicao() {
    setEditingId(null);
    setFormData(FORM_INICIAL);
    setErrors({});
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      setSaving(true);

      const dados = {
        nome: formData.nome.trim(),
        descricao: formData.descricao?.trim() || null,
      };

      if (editingId) {
        const response = await updateCategoria(editingId, dados);
        const categoriaAtualizada = response?.data || response;
        setCategorias((prev) =>
          prev.map((c) => (c.id === editingId ? categoriaAtualizada : c))
        );
        showSuccess('Categoria atualizada com sucesso!');
      } else {
        const response = await createCategoria(dados);
        const novaCategoria = response?.data || response;
        setCategorias((prev) => [...prev, novaCategoria].sort((a, b) => a.nome.localeCompare(b.nome)));
        showSuccess('Categoria criada com sucesso!');
      }

      cancelarEdicao();
    } catch (err) {
      showError(err.message || 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  }

  async function confirmarExclusao() {
    if (!categoriaParaExcluir) return;

    try {
      setExcluindo(true);
      await deleteCategoria(categoriaParaExcluir.id);
      setCategorias((prev) => prev.filter((c) => c.id !== categoriaParaExcluir.id));
      showSuccess('Categoria excluída com sucesso!');
      setCategoriaParaExcluir(null);
    } catch (err) {
      showError(err.message || 'Erro ao excluir categoria. Verifique se não há oportunidades vinculadas.');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="admin-content" id="main-content">
        <div className="admin-header">
          <div>
            <h1>🏷️ Gerenciar Categorias</h1>
            <p>Cadastre e organize as categorias usadas nas oportunidades</p>
          </div>
        </div>

        <div className="categoria-form-card">
          <h2 className="categoria-form-title">
            {editingId ? '✏️ Editar Categoria' : '➕ Nova Categoria'}
          </h2>
          <form onSubmit={handleSubmit}>
            <FormField
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              error={errors.nome}
              required
              placeholder="Ex: Educação, Saúde, Meio Ambiente..."
            />
            <FormField
              label="Descrição"
              name="descricao"
              type="textarea"
              rows={2}
              value={formData.descricao}
              onChange={handleChange}
              error={errors.descricao}
              placeholder="Descrição opcional da categoria"
            />
            <FormActions>
              {editingId && (
                <button type="button" className="btn btn-outline" onClick={cancelarEdicao} disabled={saving}>
                  Cancelar
                </button>
              )}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><ButtonLoading /> Salvando...</> : editingId ? 'Salvar Alterações' : 'Criar Categoria'}
              </button>
            </FormActions>
          </form>
        </div>

        {loading && <Loading fullscreen={false} text="Carregando categorias..." size="lg" />}

        {!loading && error && (
          <ErrorMessage
            title="Erro ao Carregar Categorias"
            message={error.message}
            onRetry={carregarCategorias}
            showRetry={true}
          />
        )}

        {!loading && !error && categorias.length === 0 && (
          <EmptyState
            icon="🏷️"
            title="Nenhuma categoria cadastrada"
            message="Cadastre a primeira categoria usando o formulário acima."
          />
        )}

        {!loading && !error && categorias.length > 0 && (
          <div className="categorias-grid">
            {categorias.map((categoria) => (
              <div key={categoria.id} className="categoria-card">
                <h3>{categoria.nome}</h3>
                {categoria.descricao && <p>{categoria.descricao}</p>}
                <div className="categoria-card-actions">
                  <button className="btn btn-sm btn-secondary" onClick={() => iniciarEdicao(categoria)}>
                    ✏️ Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setCategoriaParaExcluir(categoria)}
                  >
                    🗑️ Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(categoriaParaExcluir)}
        onClose={() => setCategoriaParaExcluir(null)}
        onConfirm={confirmarExclusao}
        title="Excluir Categoria"
        message={`Tem certeza que deseja excluir "${categoriaParaExcluir?.nome}"? Oportunidades vinculadas a ela podem ser afetadas.`}
        confirmText="Sim, Excluir"
        cancelText="Cancelar"
        type="danger"
        loading={excluindo}
      />
    </div>
  );
}

export default AdminCategorias;
