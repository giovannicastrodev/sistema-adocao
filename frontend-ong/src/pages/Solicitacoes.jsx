import { useEffect, useState, useMemo } from 'react';
import { listarSolicitacoesDaOng } from '../services/solicitacaoService';
import SolicitacaoTable from '../components/SolicitacaoTable';
import { TableSkeleton } from '../components/ui/Skeleton';
import { HeartHandshake, Filter } from 'lucide-react';

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    listarSolicitacoesDaOng()
      .then(setSolicitacoes)
      .finally(() => setCarregando(false));
  }, []);

  const solicitacoesFiltradas = useMemo(() => {
    if (!filtroStatus) return solicitacoes;
    return solicitacoes.filter((s) => s.status === filtroStatus);
  }, [solicitacoes, filtroStatus]);

  const tabs = [
    { valor: '', label: 'Todas' },
    { valor: 'PENDENTE', label: 'Pendentes' },
    { valor: 'EM_ANALISE', label: 'Em Análise' },
    { valor: 'APROVADA', label: 'Aprovadas' },
    { valor: 'RECUSADA', label: 'Recusadas' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Fila de Adoção</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Solicitações Recebidas
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Avalie e responda aos pedidos de interesse enviados pelos adotantes.
        </p>
      </div>

      {/* Tabs de Filtro de Status */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {tabs.map((tab) => {
          const ativa = filtroStatus === tab.valor;
          const count = tab.valor
            ? solicitacoes.filter((s) => s.status === tab.valor).length
            : solicitacoes.length;

          return (
            <button
              key={tab.valor}
              onClick={() => setFiltroStatus(tab.valor)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                ativa
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  ativa ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <SolicitacaoTable solicitacoes={solicitacoesFiltradas} />
      )}
    </div>
  );
}
