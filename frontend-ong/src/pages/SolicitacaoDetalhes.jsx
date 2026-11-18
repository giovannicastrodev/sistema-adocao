import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  buscarSolicitacao,
  colocarEmAnalise,
  aprovarSolicitacao,
  recusarSolicitacao,
} from '../services/solicitacaoService';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import {
  ArrowLeft,
  User,
  PawPrint,
  Calendar,
  CheckCircle2,
  XCircle,
  FileSearch,
  AlertCircle,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');
  const [observacaoRecusa, setObservacaoRecusa] = useState('');
  const [mostrarRecusa, setMostrarRecusa] = useState(false);
  const [mostrarAprovacao, setMostrarAprovacao] = useState(false);

  function carregar() {
    setCarregando(true);
    buscarSolicitacao(id)
      .then(setSolicitacao)
      .catch(() => setErro('Solicitação não encontrada.'))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function executar(acao, callbackFechaModal) {
    setErro('');
    setProcessando(true);
    try {
      await acao();
      if (callbackFechaModal) callbackFechaModal();
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível concluir a ação.');
    } finally {
      setProcessando(false);
    }
  }

  if (carregando) {
    return (
      <div className="space-y-6 max-w-3xl py-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 mb-4 inline-block">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Solicitação não encontrada</h2>
        <Link to="/solicitacoes">
          <Button variant="primary">Voltar para solicitações</Button>
        </Link>
      </div>
    );
  }

  const podeAnalisar = solicitacao.status === 'PENDENTE';
  const podeDecidir = solicitacao.status === 'PENDENTE' || solicitacao.status === 'EM_ANALISE';

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <Link
        to="/solicitacoes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para fila de solicitações</span>
      </Link>

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pedido de Adoção
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Solicitação #{solicitacao.id}
          </h1>
        </div>
        <Badge variant={solicitacao.status} className="self-start sm:self-auto text-sm px-3 py-1" />
      </div>

      {erro && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Cartão de Detalhes do Pedido */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden divide-y divide-slate-100">
        {/* Adotante */}
        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-base shrink-0">
            {solicitacao.usuarioNome ? solicitacao.usuarioNome.charAt(0).toUpperCase() : <User />}
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Candidato a Adotante
            </span>
            <h3 className="text-lg font-bold text-slate-900">{solicitacao.usuarioNome}</h3>
            <p className="text-xs text-slate-500">
              Solicitação submetida em{' '}
              <strong>{new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}</strong>
            </p>
          </div>
        </div>

        {/* Animal */}
        <div className="p-5 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <PawPrint className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Animal Solicitado
            </span>
            <h3 className="text-lg font-bold text-slate-900">{solicitacao.animalNome}</h3>
            {solicitacao.animalId && (
              <Link
                to={`/animais/${solicitacao.animalId}`}
                className="text-xs font-semibold text-emerald-700 hover:underline inline-block mt-0.5"
              >
                Ver ficha cadastral do animal →
              </Link>
            )}
          </div>
        </div>

        {/* Observações Existentes */}
        {solicitacao.observacao && (
          <div className="p-5 bg-slate-50/60 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              Observação Registrada
            </span>
            <p className="text-sm text-slate-700 pl-5 leading-relaxed">{solicitacao.observacao}</p>
          </div>
        )}
      </div>

      {/* Barra de Ações Decisórias */}
      {podeDecidir && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center gap-3">
          {podeAnalisar && (
            <Button
              variant="outline"
              size="md"
              icon={FileSearch}
              disabled={processando}
              onClick={() => executar(() => colocarEmAnalise(id))}
              className="bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
            >
              Colocar em Análise
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            icon={CheckCircle2}
            disabled={processando}
            onClick={() => setMostrarAprovacao(true)}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            Aprovar Adoção
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={XCircle}
            disabled={processando}
            onClick={() => setMostrarRecusa(true)}
            className="ml-auto"
          >
            Recusar Pedido
          </Button>
        </div>
      )}

      {/* Modal de Confirmação de Aprovação */}
      <Modal
        isOpen={mostrarAprovacao}
        onClose={() => setMostrarAprovacao(false)}
        title="Aprovar Adoção"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Ao aprovar esta solicitação para <strong>{solicitacao.usuarioNome}</strong>, o animal{' '}
              <strong>{solicitacao.animalNome}</strong> passará para o status <strong>ADOTADO</strong> e
              todas as outras solicitações ativas para este animal serão recusadas automaticamente.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setMostrarAprovacao(false)}
              disabled={processando}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              loading={processando}
              onClick={() => executar(() => aprovarSolicitacao(id), () => setMostrarAprovacao(false))}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              Confirmar Aprovação
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação de Recusa */}
      <Modal
        isOpen={mostrarRecusa}
        onClose={() => setMostrarRecusa(false)}
        title="Recusar Solicitação"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Deseja recusar a solicitação de <strong>{solicitacao.usuarioNome}</strong>?
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Justificativa / Motivo (opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: O perfil do adotante não atendeu aos critérios específicos para este animal..."
              value={observacaoRecusa}
              onChange={(e) => setObservacaoRecusa(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-rose-600 focus:ring-3 focus:ring-rose-600/15 outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setMostrarRecusa(false)}
              disabled={processando}
            >
              Voltar
            </Button>
            <Button
              variant="danger"
              size="md"
              loading={processando}
              onClick={() =>
                executar(() => recusarSolicitacao(id, observacaoRecusa), () => setMostrarRecusa(false))
              }
            >
              Confirmar Recusa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
