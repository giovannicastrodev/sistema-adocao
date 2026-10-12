import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { buscarSolicitacao, cancelarSolicitacao } from '../services/solicitacaoService';
import StatusTimeline from '../components/StatusTimeline';

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [cancelando, setCancelando] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  function carregar() {
    setCarregando(true);
    buscarSolicitacao(id)
      .then(setSolicitacao)
      .catch(() => setErro('Solicitação não encontrada.'))
      .finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function confirmarCancelamento() {
    setCancelando(true);
    try {
      await cancelarSolicitacao(id);
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível cancelar.');
    } finally {
      setCancelando(false);
      setMostrarConfirmacao(false);
    }
  }

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!solicitacao) return <p className="mensagem-erro">{erro}</p>;

  const podeCancelar = solicitacao.status === 'PENDENTE' || solicitacao.status === 'EM_ANALISE';

  return (
    <div className="pagina-solicitacao-detalhes">
      <h1>Minha Solicitação</h1>
      <p><strong>Animal:</strong> {solicitacao.animalNome}</p>
      <p><strong>ONG:</strong> {solicitacao.ongNome}</p>
      <p><strong>Enviada em:</strong> {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
      {solicitacao.observacao && <p><strong>Observação da ONG:</strong> {solicitacao.observacao}</p>}

      <StatusTimeline status={solicitacao.status} />

      {erro && <p className="mensagem-erro">{erro}</p>}

      {podeCancelar && (
        <button className="btn-secundario" onClick={() => setMostrarConfirmacao(true)}>
          Cancelar solicitação
        </button>
      )}

      {mostrarConfirmacao && (
        <div className="modal-fundo">
          <div className="modal-conteudo">
            <p>Tem certeza que deseja cancelar esta solicitação?</p>
            <div className="modal-acoes">
              <button onClick={() => setMostrarConfirmacao(false)} className="btn-secundario">Voltar</button>
              <button onClick={confirmarCancelamento} className="btn-primario" disabled={cancelando}>
                {cancelando ? 'Cancelando...' : 'Confirmar cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
