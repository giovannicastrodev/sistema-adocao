import { useNavigate, Link } from 'react-router-dom';
import { cadastrarAnimal } from '../services/animalService';
import AnimalForm from '../components/AnimalForm';
import { ArrowLeft, PawPrint } from 'lucide-react';

export default function AnimalNovo() {
  const navigate = useNavigate();

  async function salvar(dados) {
    const animal = await cadastrarAnimal(dados);
    navigate(`/animais/${animal.id}`);
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Voltar */}
      <Link
        to="/animais"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Voltar para lista de animais</span>
      </Link>

      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <PawPrint className="w-3.5 h-3.5" />
          <span>Novo Registro</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cadastrar Animal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Informe as características do pet para disponibilizá-lo para adoção.
        </p>
      </div>

      <AnimalForm onSalvar={salvar} textoBotao="Concluir Cadastro" />
    </div>
  );
}
