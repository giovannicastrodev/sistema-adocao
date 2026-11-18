import { Search, Filter, RotateCcw } from 'lucide-react';
import Button from './ui/Button';

export default function FiltroAnimais({ filtros, onChange, onFiltrar, onLimpar }) {
  function atualizar(campo, valor) {
    onChange({ ...filtros, [campo]: valor });
  }

  const especies = [
    { valor: '', label: 'Todos os Pets', emoji: '🐾' },
    { valor: 'CACHORRO', label: 'Cachorros', emoji: '🐶' },
    { valor: 'GATO', label: 'Gatos', emoji: '🐱' },
    { valor: 'OUTRO', label: 'Outros', emoji: '🐰' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-soft mb-8">
      {/* Chips Rápidos de Espécie */}
      <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-stone-100">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mr-1">
          Espécie:
        </span>
        {especies.map((item) => {
          const ativo = filtros.especie === item.valor;
          return (
            <button
              key={item.valor}
              type="button"
              onClick={() => atualizar('especie', item.valor)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                ativo
                  ? 'bg-brand-500 text-white shadow-xs shadow-brand-500/20'
                  : 'bg-stone-100 hover:bg-stone-200/70 text-stone-700'
              }`}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Campo de Busca Principal */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por nome, raça, características..."
          value={filtros.q}
          onChange={(e) => atualizar('q', e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all text-sm placeholder:text-stone-400"
        />
      </div>

      {/* Linha de Filtros Secundários */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Porte</label>
          <select
            value={filtros.porte}
            onChange={(e) => atualizar('porte', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:border-brand-500 focus:bg-white outline-hidden transition-colors"
          >
            <option value="">Qualquer porte</option>
            <option value="PEQUENO">Pequeno</option>
            <option value="MEDIO">Médio</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Sexo</label>
          <select
            value={filtros.sexo}
            onChange={(e) => atualizar('sexo', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:border-brand-500 focus:bg-white outline-hidden transition-colors"
          >
            <option value="">Qualquer sexo</option>
            <option value="MACHO">Macho</option>
            <option value="FEMEA">Fêmea</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Idade máx.</label>
          <input
            type="number"
            min="0"
            placeholder="Ex: 5 anos"
            value={filtros.idade}
            onChange={(e) => atualizar('idade', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:border-brand-500 focus:bg-white outline-hidden transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-stone-500 mb-1">Raça</label>
          <input
            type="text"
            placeholder="Ex: Vira-lata"
            value={filtros.raca}
            onChange={(e) => atualizar('raca', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50/50 text-stone-800 text-sm focus:border-brand-500 focus:bg-white outline-hidden transition-colors"
          />
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {onLimpar && (
          <button
            type="button"
            onClick={onLimpar}
            className="text-xs font-semibold text-stone-500 hover:text-stone-700 flex items-center gap-1.5 cursor-pointer py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            variant="primary"
            size="md"
            icon={Filter}
            onClick={onFiltrar}
          >
            Aplicar Filtros
          </Button>
        </div>
      </div>
    </div>
  );
}
