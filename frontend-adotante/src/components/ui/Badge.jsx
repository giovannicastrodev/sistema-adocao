import React from 'react';

const variantClasses = {
  // Status de Adoção
  PENDENTE: 'bg-amber-100 text-amber-800 border border-amber-200/80',
  EM_ANALISE: 'bg-indigo-50 text-indigo-700 border border-indigo-200/80',
  APROVADA: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  RECUSADA: 'bg-rose-50 text-rose-700 border border-rose-200/80',
  CANCELADA: 'bg-stone-100 text-stone-600 border border-stone-200',

  // Status do Animal
  DISPONIVEL: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
  ADOTADO: 'bg-stone-100 text-stone-600 border border-stone-200',

  // Atributos de Saúde & Características
  saude: 'bg-teal-50 text-teal-700 border border-teal-200/60',
  genero: 'bg-orange-50 text-orange-700 border border-orange-200/60',
  porte: 'bg-stone-100 text-stone-700 border border-stone-200/80',
  default: 'bg-stone-100 text-stone-700 border border-stone-200',
};

const statusLabels = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em Análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
  DISPONIVEL: 'Disponível',
  ADOTADO: 'Adotado',
};

export default function Badge({
  children,
  variant = 'default',
  icon: Icon,
  className = '',
}) {
  const badgeStyle = variantClasses[variant] || variantClasses.default;
  const label = typeof children === 'string' && statusLabels[children] ? statusLabels[children] : children;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${badgeStyle} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      <span>{label}</span>
    </span>
  );
}
