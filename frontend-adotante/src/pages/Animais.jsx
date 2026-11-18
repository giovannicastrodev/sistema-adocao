import { useEffect, useState } from 'react';
import { listarAnimais } from '../services/animalService';
import AnimalCard from '../components/AnimalCard';
import FiltroAnimais from '../components/FiltroAnimais';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { PawPrint, AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';

const FILTROS_VAZIOS = { q: '', especie: '', porte: '', sexo: '', idade: '', raca: '' };

export default function Animais() {
  const [animais, setAnimais] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VAZIOS);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function buscar(filtrosAtuais = filtros) {
    setCarregando(true);
    setErro('');
    try {
      const dados = await listarAnimais(filtrosAtuais);
      setAnimais(dados);
    } catch {
      setErro('Não foi possível carregar os animais agora. Verifique sua conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  }

  function handleLimparFiltros() {
    setFiltros(FILTROS_VAZIOS);
    buscar(FILTROS_VAZIOS);
  }

  useEffect(() => {
    buscar(FILTROS_VAZIOS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 mb-1">
            <PawPrint className="w-3.5 h-3.5" />
            <span>Catálogo de Adoção</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Encontre seu companheiro ideal
          </h1>
        </div>

        {!carregando && !erro && (
          <span className="text-sm font-semibold text-stone-500 bg-white px-3.5 py-1.5 rounded-full border border-stone-200 shadow-2xs self-start sm:self-auto">
            {animais.length} {animais.length === 1 ? 'animal disponível' : 'animais disponíveis'}
          </span>
        )}
      </div>

      {/* Caixa de Filtros */}
      <FiltroAnimais
        filtros={filtros}
        onChange={setFiltros}
        onFiltrar={() => buscar(filtros)}
        onLimpar={handleLimparFiltros}
      />

      {/* Mensagem de Erro */}
      {erro && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{erro}</span>
          </div>
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={() => buscar(filtros)}>
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Loading Skeletons */}
      {carregando && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Estado Vazio */}
      {!carregando && animais.length === 0 && !erro && (
        <EmptyState
          title="Nenhum pet encontrado"
          description="Tente ajustar ou limpar os filtros de busca para encontrar outros amiguinhos disponíveis."
          actionLabel="Limpar todos os filtros"
          onAction={handleLimparFiltros}
        />
      )}

      {/* Grid de Animais */}
      {!carregando && animais.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {animais.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      )}
    </div>
  );
}
