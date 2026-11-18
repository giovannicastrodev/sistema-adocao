import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PawPrint, MapPin, Building2, Heart, ArrowRight } from 'lucide-react';
import Badge from './ui/Badge';

const emojiPorEspecie = {
  CACHORRO: '🐶',
  GATO: '🐱',
  OUTRO: '🐾',
};

const labelEspecie = {
  CACHORRO: 'Cachorro',
  GATO: 'Gato',
  OUTRO: 'Pet',
};

export default function AnimalCard({ animal }) {
  const [imgErro, setImgErro] = useState(false);

  const fotoSrc = !imgErro && animal.foto
    ? animal.foto
    : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-stone-200/90 shadow-soft hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Imagem do Pet */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
        <img
          src={fotoSrc}
          alt={animal.nome}
          onError={() => setImgErro(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Badges Flutuantes */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-stone-800 shadow-xs">
            {emojiPorEspecie[animal.especie] || '🐾'} {labelEspecie[animal.especie] || animal.especie}
          </span>
        </div>

        {animal.status && (
          <div className="absolute top-3 right-3">
            <Badge variant={animal.status} />
          </div>
        )}
      </div>

      {/* Conteúdo do Card */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-brand-600 transition-colors">
              {animal.nome}
            </h3>
            {animal.sexo && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                {animal.sexo === 'MACHO' ? 'Macho' : animal.sexo === 'FEMEA' ? 'Fêmea' : animal.sexo}
              </span>
            )}
          </div>

          {/* Atributos / Metadados */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-stone-600">
            {animal.porte && (
              <span className="px-2 py-0.5 rounded-md bg-amber-50/80 text-amber-800 border border-amber-200/40">
                Porte {animal.porte.toLowerCase()}
              </span>
            )}
            {animal.idade != null && (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
              </span>
            )}
            {animal.raca && (
              <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 truncate max-w-[120px]">
                {animal.raca}
              </span>
            )}
          </div>

          {/* ONG Responsável */}
          {animal.ongNome && (
            <div className="flex items-center gap-1.5 mt-3 text-xs text-stone-500">
              <Building2 className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate">{animal.ongNome}</span>
            </div>
          )}
        </div>

        {/* Botão de Ação */}
        <Link
          to={`/animais/${animal.id}`}
          className="mt-2 w-full inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-sm font-semibold text-brand-600 bg-orange-50 hover:bg-brand-500 hover:text-white transition-all duration-200"
        >
          <span>Conhecer {animal.nome}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
