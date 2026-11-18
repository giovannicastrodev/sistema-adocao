import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buscarDashboard } from '../services/dashboardService';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import Button from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';
import {
  PawPrint,
  CheckCircle2,
  Clock,
  Heart,
  Inbox,
  FileSearch,
  Plus,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Dashboard() {
  const { ong } = useAuth();
  const [indicadores, setIndicadores] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarDashboard()
      .then(setIndicadores)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Visão Geral da Organização</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Olá, {ong ? ong.nome : 'ONG'} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe em tempo real o status dos animais sob seus cuidados e as solicitações de adoção.
          </p>
        </div>

        <Link to="/animais/novo" className="self-start sm:self-auto">
          <Button variant="primary" size="md" icon={Plus}>
            Cadastrar Novo Animal
          </Button>
        </Link>
      </div>

      {/* Skeletons durante carregamento */}
      {carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 flex justify-between items-center">
              <div className="space-y-2">
                <Skeleton className="h-3.5 w-28 rounded-md" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
              <Skeleton className="w-12 h-12 rounded-2xl" />
            </div>
          ))}
        </div>
      )}

      {/* Grid de Métricas */}
      {!carregando && indicadores && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <StatCard
            titulo="Animais Cadastrados"
            valor={indicadores.animaisCadastrados}
            icon={PawPrint}
            tema="default"
            subtexto="Total de pets sob gestão"
          />

          <StatCard
            titulo="Animais Disponíveis"
            valor={indicadores.animaisDisponiveis}
            icon={CheckCircle2}
            tema="emerald"
            subtexto="Visíveis no catálogo público"
          />

          <StatCard
            titulo="Em Processo de Adoção"
            valor={indicadores.animaisEmProcesso}
            icon={Clock}
            tema="amber"
            subtexto="Animais com interesse ativo"
          />

          <StatCard
            titulo="Adoções Concluídas"
            valor={indicadores.animaisAdotados}
            icon={Heart}
            tema="sky"
            subtexto="Vidas transformadas com sucesso"
          />

          <StatCard
            titulo="Solicitações Pendentes"
            valor={indicadores.solicitacoesPendentes}
            icon={Inbox}
            tema="amber"
            subtexto="Aguardando primeira triagem"
          />

          <StatCard
            titulo="Em Análise"
            valor={indicadores.solicitacoesEmAnalise}
            icon={FileSearch}
            tema="indigo"
            subtexto="Em avaliação detalhada pela ONG"
          />
        </div>
      )}

      {/* Banner de Atalho Rápido */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-emerald-900 to-[#0d2818] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-base font-bold text-white">
            Tem novas solicitações aguardando resposta?
          </h3>
          <p className="text-xs text-emerald-200/80 max-w-lg">
            Avaliar os pedidos rapidamente melhora a experiência dos adotantes e acelera a adoção responsável.
          </p>
        </div>
        <Link to="/solicitacoes" className="shrink-0">
          <Button
            variant="secondary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
            className="text-emerald-900 font-bold hover:bg-white"
          >
            Ver Solicitações
          </Button>
        </Link>
      </div>
    </div>
  );
}
