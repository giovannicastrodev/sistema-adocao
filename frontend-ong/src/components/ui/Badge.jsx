import React from 'react';

const variantClasses = {
  // Status de Solicitação
  PENDENTE: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  EM_ANALISE: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
  APROVADA: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  RECUSADA: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  CANCELADA: 'bg-slate-100 text-slate-600 border border-slate-200',

  // Status do Animal
  DISPONIVEL: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  EM_PROCESSO: 'bg-amber-50 text-amber-800 border border-amber-200/80',
  ADOTADO: 'bg-sky-50 text-sky-700 border border-sky-200/80',
  ARQUIVADO: 'bg-slate-100 text-slate-600 border border-slate-200',

  default: 'bg-slate-100 text-slate-700 border border-slate-200',
};

const statusLabels = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em Análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
  DISPONIVEL: 'Disponível',
  EM_PROCESSO: 'Em Processo',
  ADOTADO: 'Adotado',
  ARQUIVADO: 'Arquivado',
};

export default function Badge({
  children,
  variant,
  icon: Icon,
  className = '',
}) {
  const resolvedVariant = variant || children;
  const badgeStyle = variantClasses[resolvedVariant] || variantClasses.default;
  const label = typeof children === 'string' && statusLabels[children] ? statusLabels[children] : children;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${badgeStyle} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
    </span>
  );
}
