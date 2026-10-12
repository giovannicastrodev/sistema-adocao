import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { buscarAnimal, editarAnimal } from '../services/animalService';
import AnimalForm from '../components/AnimalForm';

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

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!animal) return <p className="mensagem-erro">Animal não encontrado.</p>;

  return (
    <div>
      <h1>Editar {animal.nome}</h1>
      <AnimalForm valoresIniciais={animal} onSalvar={salvar} textoBotao="Salvar alterações" />
    </div>
  );
}
