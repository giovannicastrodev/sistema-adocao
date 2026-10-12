import { useNavigate } from 'react-router-dom';
import { cadastrarAnimal } from '../services/animalService';
import AnimalForm from '../components/AnimalForm';

export default function AnimalNovo() {
  const navigate = useNavigate();

  async function salvar(dados) {
    const animal = await cadastrarAnimal(dados);
    navigate(`/animais/${animal.id}`);
  }

  return (
    <div>
      <h1>Cadastrar animal</h1>
      <AnimalForm onSalvar={salvar} textoBotao="Cadastrar" />
    </div>
  );
}
