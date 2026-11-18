import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarAnimais } from '../services/animalService';
import AnimalCard from '../components/AnimalCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import { Heart, Sparkles, ShieldCheck, Clock, ArrowRight, PawPrint } from 'lucide-react';

export default function Home() {
  const [destaques, setDestaques] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarAnimais()
      .then((animais) => setDestaques(animais.slice(0, 4)))
      .catch(() => setDestaques([]))
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-100/80 via-amber-50 to-rose-50/70 border border-orange-200/50 p-6 sm:p-12 lg:p-16 shadow-soft">
        <div className="max-w-2xl relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-orange-200/60 text-xs font-semibold text-brand-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Adotar é um ato de amor e responsabilidade</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-[1.15]">
            Encontre seu novo <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-amber-600">
              melhor amigo
            </span>{' '}
            hoje mesmo 🐾
          </h1>

          <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
            Conectamos você diretamente às ONGs e protetores sérios da sua região.
            Centenas de cães e gatos estão esperando por um lar cheio de afeto.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link to="/animais">
              <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
                Explorar animais disponíveis
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="secondary" size="lg">
                Cadastrar-se como adotante
              </Button>
            </Link>
          </div>
        </div>

        {/* Círculos Decorativos de Fundo */}
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-orange-200/30 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-60 h-60 rounded-full bg-amber-200/20 blur-2xl pointer-events-none" />
      </section>

      {/* 3 Pilares / Por que adotar aqui */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-500 border border-orange-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-1">ONGs Verificadas</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Animais cadastrados por instituições comprometidas com saúde e bem-estar animal.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Acompanhamento Fácil</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Veja a timeline do seu pedido em tempo real, desde o interesse até a adoção aprovada.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-soft flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Adoção Responsável</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Auxiliamos você a encontrar o companheiro que melhor combina com seu estilo de vida.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
              <PawPrint className="w-3.5 h-3.5" />
              <span>Esperando por você</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              Pets em Destaque
            </h2>
          </div>

          <Link
            to="/animais"
            className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Ver todos os pets</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {carregando && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Estado Vazio */}
        {!carregando && destaques.length === 0 && (
          <EmptyState
            title="Nenhum pet disponível no momento"
            description="Novos animais são cadastrados regularmente pelas ONGs parceiras. Volte em breve!"
          />
        )}

        {/* Grid de Cards */}
        {!carregando && destaques.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {destaques.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </section>

      {/* Banner de CTA Final */}
      <section className="bg-gradient-to-r from-stone-900 to-stone-800 rounded-3xl p-8 sm:p-12 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="space-y-2 text-center sm:text-left">
          <h3 className="text-2xl font-bold">Pronto para transformar uma vida?</h3>
          <p className="text-stone-300 text-sm max-w-lg">
            Navegue pelo catálogo completo de cães e gatos resgatados e dê o primeiro passo para a adoção.
          </p>
        </div>
        <Link to="/animais" className="shrink-0">
          <Button variant="primary" size="lg" icon={PawPrint}>
            Ver Catálogo Completo
          </Button>
        </Link>
      </section>
    </div>
  );
}
