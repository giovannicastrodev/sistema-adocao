import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { buscarAnimal, editarAnimal } from '../services/animalService';
import AnimalForm from '../components/AnimalForm';
import { Skeleton } from '../components/ui/Skeleton';
import { ArrowLeft, Pencil, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function AnimalEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarAnimal(id).then(setAnimal).finally(() => setCarregando(false));
  }, [id]);

  async function salvar(dados) {
    await editarAnimal(id, dados);
    navigate(`/animais/${id}`);
  }

  if (carregando) {
    return (
      <div className="space-y-6 max-w-4xl py-6">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 mb-4 inline-block">
          <AlertCircle className="w-8 h-8 mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Animal não encontrado</h2>
        <Link to="/animais">
          <Button variant="primary">Voltar para animais</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      <Link
        to={`/animais/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para detalhes de {animal.nome}</span>
      </Link>

      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <Pencil className="w-3.5 h-3.5" />
          <span>Atualização Cadastral</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Editar {animal.nome}
        </h1>
      </div>

      <AnimalForm valoresIniciais={animal} onSalvar={salvar} textoBotao="Salvar Alterações" />
    </div>
  );
}
