import { useEffect, useState } from 'react';
import { listarSolicitacoesDaOng } from '../services/solicitacaoService';
import SolicitacaoTable from '../components/SolicitacaoTable';

export default function Solicitacoes() {
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    listarSolicitacoesDaOng()
      .then(setSolicitacoes)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div>
      <h1>Solicitações Recebidas</h1>
      {carregando ? <p className="carregando">Carregando...</p> : <SolicitacaoTable solicitacoes={solicitacoes} />}
    </div>
  );
}
