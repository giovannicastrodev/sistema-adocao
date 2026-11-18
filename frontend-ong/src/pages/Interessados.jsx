import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listarInteressados } from '../services/solicitacaoService';
import { buscarAnimal } from '../services/animalService';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft, User, Calendar, HeartHandshake, ArrowRight } from 'lucide-react';

export default function Interessados() {
  const { animalId } = useParams();
  const [animal, setAnimal] = useState(null);
  const [interessados, setInteressados] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    Promise.all([buscarAnimal(animalId), listarInteressados(animalId)])
      .then(([animalData, interessadosData]) => {
        setAnimal(animalData);
        setInteressados(interessadosData);
      })
      .finally(() => setCarregando(false));
  }, [animalId]);

  if (carregando) {
    return (
      <div className="space-y-4 max-w-3xl py-6">
        <Skeleton className="h-6 w-32 rounded-lg" />
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6 pb-16">
      <Link
        to={`/animais/${animalId}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para ficha de {animal ? animal.nome : 'animal'}</span>
      </Link>

      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Fila de Espera</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Candidatos para {animal ? animal.nome : ''}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          {interessados.length} {interessados.length === 1 ? 'adotante interessado' : 'adotantes interessados'}
        </p>
      </div>

      {interessados.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="Nenhum interessado ainda"
          description={`Ainda não foram registradas solicitações de adoção para ${animal ? animal.nome : 'este animal'}.`}
        />
      ) : (
        <div className="space-y-3">
          {interessados.map((s) => (
            <Link
              to={`/solicitacoes/${s.id}`}
              key={s.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-emerald-200 transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                  {s.usuarioNome ? s.usuarioNome.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{s.usuarioNome}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Solicitado em {new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={s.status} />
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
