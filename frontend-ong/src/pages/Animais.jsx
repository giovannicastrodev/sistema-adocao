import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { listarMeusAnimais } from '../services/animalService';
import AnimalTable from '../components/AnimalTable';
import Button from '../components/ui/Button';
import { TableSkeleton } from '../components/ui/Skeleton';
import { PawPrint, Plus, Search, Filter } from 'lucide-react';

export default function Animais() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');

  useEffect(() => {
    listarMeusAnimais()
      .then(setAnimais)
      .finally(() => setCarregando(false));
  }, []);

  const animaisFiltrados = useMemo(() => {
    return animais.filter((a) => {
      const matchBusca =
        !busca ||
        a.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        a.raca?.toLowerCase().includes(busca.toLowerCase());
      const matchStatus = !filtroStatus || a.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [animais, busca, filtroStatus]);

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <PawPrint className="w-3.5 h-3.5" />
            <span>Gestão do Plantel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Meus Animais
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Cadastre, edite e controle a disponibilidade dos animais da sua organização.
          </p>
        </div>

        <Link to="/animais/novo" className="self-start sm:self-auto">
          <Button variant="primary" size="md" icon={Plus}>
            Cadastrar Novo Animal
          </Button>
        </Link>
      </div>

      {/* Barra de Filtro Rápido */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-soft flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Filtrar por nome ou raça..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block shrink-0" />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-700 focus:border-emerald-600 focus:bg-white outline-hidden"
          >
            <option value="">Todos os status</option>
            <option value="DISPONIVEL">Disponível</option>
            <option value="EM_PROCESSO">Em Processo</option>
            <option value="ADOTADO">Adotado</option>
            <option value="ARQUIVADO">Arquivado</option>
          </select>
        </div>
      </div>

      {/* Conteúdo */}
      {carregando ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <AnimalTable animais={animaisFiltrados} />
      )}
    </div>
  );
}
