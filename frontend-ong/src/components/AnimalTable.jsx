import { Link } from 'react-router-dom';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { Eye, Pencil, PawPrint, Plus } from 'lucide-react';

const emojiPorEspecie = {
  CACHORRO: '🐶',
  GATO: '🐱',
  OUTRO: '🐾',
};

export default function AnimalTable({ animais }) {
  if (!animais || animais.length === 0) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Nenhum animal cadastrado ainda"
        description="Comece adicionando os cães, gatos e outros animais sob os cuidados da sua organização."
        actionLabel="Cadastrar primeiro animal"
        onAction={() => (window.location.href = '/animais/novo')}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Animal</th>
              <th className="py-3.5 px-4">Espécie / Sexo</th>
              <th className="py-3.5 px-4">Porte</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right sm:pr-6">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {animais.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                {/* Animal (Foto + Nome + Raça) */}
                <td className="py-3 px-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
                      {a.foto ? (
                        <img
                          src={a.foto}
                          alt={a.nome}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = '🐾';
                          }}
                        />
                      ) : (
                        <span className="text-base">{emojiPorEspecie[a.especie] || '🐾'}</span>
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/animais/${a.id}`}
                        className="font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                      >
                        {a.nome}
                      </Link>
                      <p className="text-xs text-slate-400">
                        {a.raca || 'Sem raça definida'} {a.idade != null ? `• ${a.idade} ano(s)` : ''}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Espécie / Sexo */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-700">
                      {a.especie === 'CACHORRO' ? 'Cachorro' : a.especie === 'GATO' ? 'Gato' : 'Outro'}
                    </span>
                    {a.sexo && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                        {a.sexo === 'MACHO' ? 'Macho' : 'Fêmea'}
                      </span>
                    )}
                  </div>
                </td>

                {/* Porte */}
                <td className="py-3 px-4">
                  <span className="text-xs font-medium text-slate-600 capitalize">
                    {a.porte ? a.porte.toLowerCase() : '-'}
                  </span>
                </td>

                {/* Status */}
                <td className="py-3 px-4">
                  <Badge variant={a.status} />
                </td>

                {/* Ações */}
                <td className="py-3 px-4 sm:pr-6 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      to={`/animais/${a.id}`}
                      title="Ver detalhes"
                      className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/animais/${a.id}/editar`}
                      title="Editar animal"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
