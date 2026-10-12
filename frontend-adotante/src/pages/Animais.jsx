import { useEffect, useState } from 'react';
import { listarAnimais } from '../services/animalService';
import AnimalCard from '../components/AnimalCard';
import FiltroAnimais from '../components/FiltroAnimais';

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
      setErro('Não foi possível carregar os animais agora.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscar(FILTROS_VAZIOS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pagina-animais">
      <h1>Encontre seu novo amigo 🐾</h1>

      <FiltroAnimais filtros={filtros} onChange={setFiltros} onFiltrar={() => buscar(filtros)} />

      {carregando && <p className="carregando">Carregando animais...</p>}
      {erro && <p className="mensagem-erro">{erro}</p>}

      {!carregando && animais.length === 0 && !erro && (
        <p>Nenhum animal encontrado com esses filtros.</p>
      )}

      <div className="grid-animais">
        {animais.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
}
