import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { buscarSolicitacao, cancelarSolicitacao } from '../services/solicitacaoService';
import StatusTimeline from '../components/StatusTimeline';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import {
  ArrowLeft,
  Building2,
  Calendar,
  PawPrint,
  AlertTriangle,
  MessageSquare,
  X,
  AlertCircle
} from 'lucide-react';

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

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

  async function confirmarCancelamento() {
    setCancelando(true);
    try {
      await cancelarSolicitacao(id);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível cancelar sua solicitação.');
    } finally {
      setCancelando(false);
      setMostrarConfirmacao(false);
    }
  }

  if (carregando) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 py-8">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 mb-4 inline-block">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Solicitação não encontrada</h2>
        <p className="text-stone-500 text-sm mb-6">{erro}</p>
        <Link to="/minhas-solicitacoes">
          <Button variant="primary">Voltar para Minhas Solicitações</Button>
        </Link>
      </div>
    );
  }

  const podeCancelar = solicitacao.status === 'PENDENTE' || solicitacao.status === 'EM_ANALISE';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Voltar */}
      <Link
        to="/minhas-solicitacoes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-brand-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para Minhas Solicitações</span>
      </Link>

      {/* Cartão de Identificação do Pedido */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 border border-orange-100 flex items-center justify-center shrink-0">
              <PawPrint className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Adoção Solicitada
              </span>
              <h1 className="text-2xl font-extrabold text-stone-900">
                {solicitacao.animalNome}
              </h1>
            </div>
          </div>
          <Badge variant={solicitacao.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-400" />
            <span>ONG: <strong>{solicitacao.ongNome}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            <span>Enviada em: <strong>{new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}</strong></span>
          </div>
        </div>
      </div>

      {/* Observação da ONG (se houver) */}
      {solicitacao.observacao && (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-900 space-y-1">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Observação da ONG
            </span>
          </div>
          <p className="text-sm pl-6 leading-relaxed">{solicitacao.observacao}</p>
        </div>
      )}

      {/* Stepper de Status */}
      <StatusTimeline status={solicitacao.status} />

      {/* Erro */}
      {erro && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Ação de Cancelamento */}
      {podeCancelar && (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-stone-50 border border-stone-200">
          <div>
            <h4 className="text-sm font-bold text-stone-800">Mudou de ideia?</h4>
            <p className="text-xs text-stone-500">
              Você pode cancelar este pedido enquanto a ONG ainda não tiver finalizado a análise.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMostrarConfirmacao(true)}
            className="text-rose-600 border-rose-200 hover:bg-rose-50"
          >
            Cancelar solicitação
          </Button>
        </div>
      )}

      {/* Modal de Cancelamento */}
      {mostrarConfirmacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-stone-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setMostrarConfirmacao(false)}
                className="p-1 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Cancelar solicitação de adoção?
              </h3>
              <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                Tem certeza que deseja cancelar? A ONG será informada e o animal continuará disponível para outros interessados.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => setMostrarConfirmacao(false)}
                disabled={cancelando}
              >
                Voltar
              </Button>
              <Button
                variant="danger"
                size="md"
                onClick={confirmarCancelamento}
                loading={cancelando}
              >
                Sim, cancelar pedido
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
