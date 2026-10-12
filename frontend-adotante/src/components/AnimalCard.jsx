import { Link } from 'react-router-dom';

const emojiPorEspecie = {
  CACHORRO: '🐶',
  GATO: '🐱',
  OUTRO: '🐾',
};

export default function AnimalCard({ animal }) {
  return (
    <div className="animal-card">
      <img
        src={animal.foto || 'https://placehold.co/400x300?text=Sem+foto'}
        alt={animal.nome}
        className="animal-card-foto"
      />
      <div className="animal-card-conteudo">
        <h3>{emojiPorEspecie[animal.especie] || '🐾'} {animal.nome}</h3>
        <p>{animal.especie === 'CACHORRO' ? 'Cachorro' : animal.especie === 'GATO' ? 'Gato' : 'Outro'} • {animal.porte} • {animal.idade != null ? `${animal.idade} ano(s)` : 'Idade não informada'}</p>
        <Link to={`/animais/${animal.id}`} className="btn-primario">Ver detalhes</Link>
      </div>
    </div>
  );
}
