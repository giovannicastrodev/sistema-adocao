import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  buscarSolicitacao,
  colocarEmAnalise,
  aprovarSolicitacao,
  recusarSolicitacao,
} from '../services/solicitacaoService';

const LABEL_STATUS = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
};

export default function SolicitacaoDetalhes() {
  const { id } = useParams();
  const [solicitacao, setSolicitacao] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [processando, setProcessando] = useState(false);
  const [erro, setErro] = useState('');
  const [observacaoRecusa, setObservacaoRecusa] = useState('');
  const [mostrarRecusa, setMostrarRecusa] = useState(false);

  function carregar() {
    setCarregando(true);
    buscarSolicitacao(id).then(setSolicitacao).finally(() => setCarregando(false));
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function executar(acao) {
    setErro('');
    setProcessando(true);
    try {
      await acao();
      carregar();
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível concluir a ação.');
    } finally {
      setProcessando(false);
      setMostrarRecusa(false);
    }
  }

  if (carregando) return <p className="carregando">Carregando...</p>;
  if (!solicitacao) return <p className="mensagem-erro">Solicitação não encontrada.</p>;

  const podeAnalisar = solicitacao.status === 'PENDENTE';
  const podeDecidir = solicitacao.status === 'PENDENTE' || solicitacao.status === 'EM_ANALISE';

  return (
    <div className="pagina-solicitacao-detalhes-ong">
      <h1>Solicitação #{solicitacao.id}</h1>

      <div className="dados-solicitacao">
        <p><strong>Adotante:</strong> {solicitacao.usuarioNome}</p>
        <p><strong>Animal desejado:</strong> {solicitacao.animalNome}</p>
        <p><strong>Data da solicitação:</strong> {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
        <p><strong>Status atual:</strong> <span className={`badge badge-${solicitacao.status.toLowerCase()}`}>{LABEL_STATUS[solicitacao.status]}</span></p>
        {solicitacao.observacao && <p><strong>Observações:</strong> {solicitacao.observacao}</p>}
      </div>

      {erro && <p className="mensagem-erro">{erro}</p>}

      {podeDecidir && (
        <div className="acoes-solicitacao">
          {podeAnalisar && (
            <button className="btn-secundario" disabled={processando} onClick={() => executar(() => colocarEmAnalise(id))}>
              Colocar em análise
            </button>
          )}
          <button className="btn-primario" disabled={processando} onClick={() => executar(() => aprovarSolicitacao(id))}>
            Aprovar
          </button>
          <button className="btn-recusar" disabled={processando} onClick={() => setMostrarRecusa(true)}>
            Recusar
          </button>
        </div>
      )}

      {mostrarRecusa && (
        <div className="modal-fundo">
          <div className="modal-conteudo">
            <p>Deseja recusar esta solicitação?</p>
            <textarea
              rows={3}
              placeholder="Observação (opcional)"
              value={observacaoRecusa}
              onChange={(e) => setObservacaoRecusa(e.target.value)}
            />
            <div className="modal-acoes">
              <button className="btn-secundario" onClick={() => setMostrarRecusa(false)}>Voltar</button>
              <button
                className="btn-recusar"
                disabled={processando}
                onClick={() => executar(() => recusarSolicitacao(id, observacaoRecusa))}
              >
                Confirmar recusa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
