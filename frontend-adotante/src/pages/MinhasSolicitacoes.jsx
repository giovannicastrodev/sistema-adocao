import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarMinhasSolicitacoes } from '../services/solicitacaoService';

const LABEL_STATUS = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
};

export default function MinhasSolicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarMinhasSolicitacoes()
      .then(setSolicitacoes)
      .finally(() => setCarregando(false));
  }, []);

  if (carregando) return <p className="carregando">Carregando...</p>;

  return (
    <div className="pagina-solicitacoes">
      <h1>Minhas Solicitações</h1>

      {solicitacoes.length === 0 && <p>Você ainda não demonstrou interesse em nenhum animal.</p>}

      <div className="lista-solicitacoes">
        {solicitacoes.map((s) => (
          <Link to={`/solicitacoes/${s.id}`} key={s.id} className="item-solicitacao">
            <div>
              <strong>{s.animalNome}</strong>
              <p>ONG: {s.ongNome}</p>
              <p>Enviada em {new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
            </div>
            <span className={`badge badge-${s.status.toLowerCase()}`}>{LABEL_STATUS[s.status]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
