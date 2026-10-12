import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { listarInteressados } from '../services/solicitacaoService';
import { buscarAnimal } from '../services/animalService';

const LABEL_STATUS = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
};

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

  if (carregando) return <p className="carregando">Carregando...</p>;

  return (
    <div>
      <h1>Interessados {animal ? `em ${animal.nome}` : ''}</h1>

      {interessados.length === 0 && <p>Ainda não há interessados neste animal.</p>}

      <div className="lista-interessados">
        {interessados.map((s) => (
          <Link to={`/solicitacoes/${s.id}`} key={s.id} className="item-interessado">
            <div>
              <strong>{s.usuarioNome}</strong>
              <p>Data: {new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <span className={`badge badge-${s.status.toLowerCase()}`}>{LABEL_STATUS[s.status]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
