import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMinhasSolicitacoes } from '../services/solicitacaoService';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { HeartHandshake, Building2, Calendar, ArrowRight, PawPrint } from 'lucide-react';

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMinhasSolicitacoes()
      .then(setSolicitacoes)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Processos de Adoção</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Minhas Solicitações
          </h1>
        </div>

        {!carregando && solicitacoes.length > 0 && (
          <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200 self-start sm:self-auto">
            {solicitacoes.length} {solicitacoes.length === 1 ? 'pedido ativo' : 'pedidos ativos'}
          </span>
        )}
      </div>

      {/* Loading Skeletons */}
      {carregando && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-stone-200 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-md" />
                <Skeleton className="h-4 w-60 rounded-md" />
              </div>
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {!carregando && solicitacoes.length === 0 && (
        <EmptyState
          icon={PawPrint}
          title="Nenhuma solicitação encontrada"
          description="Você ainda não demonstrou interesse em nenhum animal. Que tal navegar pelo catálogo e escolher um amigo?"
          actionLabel="Ver Animais Disponíveis"
          onAction={() => (window.location.href = '/animais')}
        />
      )}

      {/* Lista de Solicitações */}
      {!carregando && solicitacoes.length > 0 && (
        <div className="space-y-3">
          {solicitacoes.map((s) => (
            <Link
              to={`/solicitacoes/${s.id}`}
              key={s.id}
              className="group p-5 rounded-2xl bg-white border border-stone-200/90 shadow-soft hover:shadow-hover hover:border-brand-200 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-600 border border-orange-100 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <PawPrint className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
                    {s.animalNome}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-stone-400" />
                      {s.ongNome}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      Enviada em {new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                <Badge variant={s.status} />
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
