import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMeusAnimais } from '../services/animalService';
import AnimalTable from '../components/AnimalTable';

export default function Animais() {
  const [animais, setAnimais] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMeusAnimais()
      .then(setAnimais)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <div className="cabecalho-pagina">
        <h1>Meus Animais</h1>
        <Link to="/animais/novo" className="btn-primario">+ Cadastrar animal</Link>
      </div>

      {carregando ? <p className="carregando">Carregando...</p> : <AnimalTable animais={animais} />}
    </div>
  );
}
