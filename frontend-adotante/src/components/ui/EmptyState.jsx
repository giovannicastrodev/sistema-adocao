import React from 'react';
import { PawPrint } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = PawPrint,
  title = 'Nenhum resultado encontrado',
  description = 'Não encontramos nenhum item correspondente aos seus filtros no momento.',
  actionLabel,
  onAction,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-3xl border border-dashed border-stone-300 max-w-lg mx-auto ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-brand-500 mb-4 shadow-sm">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-stone-800 mb-1.5">{title}</h3>
      <p className="text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
