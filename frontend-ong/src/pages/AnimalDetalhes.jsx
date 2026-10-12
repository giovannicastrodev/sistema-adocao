import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { buscarAnimal, arquivarAnimal, alterarDisponibilidade } from '../services/animalService';

const LABEL_STATUS = {
  DISPONIVEL: 'Disponível',
  EM_PROCESSO: 'Em processo',
  ADOTADO: 'Adotado',
  ARQUIVADO: 'Arquivado',
};

export default function AnimalDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [animal, setAnimal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  function carregar() {
    setCarregando(true);
    buscarAnimal(id).then(setAnimal).finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleAlternarDisponibilidade() {
    setErro('');
    try {
      const atualizado = await alterarDisponibilidade(animal.id, animal.status !== 'DISPONIVEL');
      setAnimal(atualizado);
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível alterar a disponibilidade.');
    }
  }

  async function handleArquivar() {
    if (!window.confirm('Tem certeza que deseja arquivar este animal? Ele deixará de aparecer na listagem pública.')) return;
    await arquivarAnimal(animal.id);
    navigate('/animais');
  }

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!animal) return <p className="mensagem-erro">Animal não encontrado.</p>;

  return (
    <div className="pagina-detalhes-animal-ong">
      <div className="cabecalho-pagina">
        <h1>{animal.nome}</h1>
        <div>
          <Link to={`/animais/${animal.id}/editar`} className="btn-secundario">Editar</Link>
          {' '}
          <Link to={`/animais/${animal.id}/interessados`} className="btn-secundario">Ver interessados</Link>
        </div>
      </div>

      {erro && <p className="mensagem-erro">{erro}</p>}

      <p><strong>Espécie:</strong> {animal.especie}</p>
      <p><strong>Raça:</strong> {animal.raca || 'Não informada'}</p>
      <p><strong>Idade:</strong> {animal.idade != null ? `${animal.idade} ano(s)` : 'Não informada'}</p>
      <p><strong>Porte:</strong> {animal.porte}</p>
      <p><strong>Sexo:</strong> {animal.sexo}</p>
      <p><strong>Status:</strong> <span className={`badge badge-${animal.status.toLowerCase()}`}>{LABEL_STATUS[animal.status]}</span></p>
      <p><strong>Descrição:</strong> {animal.descricao || 'Sem descrição.'}</p>

      <div className="acoes-animal">
        {(animal.status === 'DISPONIVEL' || animal.status === 'EM_PROCESSO') && (
          <button className="btn-primario" onClick={handleAlternarDisponibilidade}>
            {animal.status === 'DISPONIVEL' ? 'Marcar como indisponível' : 'Marcar como disponível'}
          </button>
        )}
        {animal.status !== 'ARQUIVADO' && (
          <button className="btn-secundario" onClick={handleArquivar}>Arquivar animal</button>
        )}
      </div>
    </div>
  );
}
