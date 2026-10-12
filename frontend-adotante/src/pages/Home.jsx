import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarAnimais } from '../services/animalService';
import AnimalCard from '../components/AnimalCard';

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
    <div className="pagina-home">
      <section className="hero">
        <h1>Encontre seu novo melhor amigo 🐾</h1>
        <p>Conectamos você às ONGs responsáveis por dezenas de animais esperando por um lar.</p>
        <Link to="/animais" className="btn-primario btn-grande">Ver animais disponíveis</Link>
      </section>

      <section>
        <h2>Destaques</h2>
        {carregando && <p>Carregando destaques...</p>}
        {!carregando && destaques.length === 0 && <p>Nenhum animal disponível no momento.</p>}
        <div className="grid-animais">
          {destaques.map((animal) => (
            <AnimalCard key={animal.id} animal={animal} />
          ))}
        </div>
      </section>
    </div>
  );
}
