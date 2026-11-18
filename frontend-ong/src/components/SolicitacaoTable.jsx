import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { HeartHandshake, User, Calendar, ArrowRight } from 'lucide-react';

export default function SolicitacaoTable({ solicitacoes }) {
  if (!solicitacoes || solicitacoes.length === 0) {
    return (
      <EmptyState
        icon={HeartHandshake}
        title="Nenhuma solicitação recebida ainda"
        description="Assim que os adotantes demonstrarem interesse nos seus animais, os pedidos aparecerão aqui para sua análise."
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Adotante</th>
              <th className="py-3.5 px-4">Animal Desejado</th>
              <th className="py-3.5 px-4">Data do Pedido</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right sm:pr-6">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {solicitacoes.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Adotante */}
                <td className="py-3 px-4 sm:px-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {s.usuarioNome ? s.usuarioNome.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block leading-tight">
                        {s.usuarioNome}
                      </span>
                      <span className="text-[11px] text-slate-400">Interessado</span>
                    </div>
                  </div>
                </td>

                {/* Animal */}
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-800">{s.animalNome}</span>
                </td>

                {/* Data */}
                <td className="py-3 px-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <Badge variant={s.status} />
                </td>

                {/* Ação */}
                <td className="py-3 px-4 sm:pr-6 text-right">
                  <Link
                    to={`/solicitacoes/${s.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 transition-colors"
                  >
                    <span>Avaliar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
