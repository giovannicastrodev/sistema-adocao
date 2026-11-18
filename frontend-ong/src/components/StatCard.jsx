import React from 'react';

const themes = {
  emerald: {
    iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    valor: 'text-emerald-700',
  },
  amber: {
    iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
    valor: 'text-amber-700',
  },
  indigo: {
    iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    valor: 'text-indigo-700',
  },
  sky: {
    iconBg: 'bg-sky-50 text-sky-600 border-sky-100',
    valor: 'text-sky-700',
  },
  rose: {
    iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
    valor: 'text-rose-700',
  },
  default: {
    iconBg: 'bg-slate-100 text-slate-600 border-slate-200',
    valor: 'text-slate-800',
  },
};

export default function StatCard({
  titulo,
  valor,
  icon: Icon,
  tema = 'default',
  subtexto,
}) {
  const theme = themes[tema] || themes.default;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft flex items-center justify-between gap-4 transition-all hover:shadow-card">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
          {titulo}
        </span>
        <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.valor}`}>
          {valor != null ? valor : 0}
        </div>
        {subtexto && (
          <p className="text-[11px] text-slate-400 font-medium">{subtexto}</p>
        )}
      </div>

      {Icon && (
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${theme.iconBg}`}
        >
          <Icon className="w-6 h-6" />
        </div>
      )}
    </div>
  );
}
