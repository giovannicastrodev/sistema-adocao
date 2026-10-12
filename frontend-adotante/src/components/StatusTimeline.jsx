const ETAPAS = [
  { chave: 'PENDENTE', label: 'Solicitação enviada' },
  { chave: 'EM_ANALISE', label: 'Em análise' },
  { chave: 'APROVADA', label: 'Aprovada' },
];

const FINALIZACOES_NEGATIVAS = {
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
};

export default function StatusTimeline({ status }) {
  if (FINALIZACOES_NEGATIVAS[status]) {
    return (
      <div className="status-timeline status-timeline-negativo">
        <p>Solicitação enviada</p>
        <p className="seta">↓</p>
        <p className="status-final-negativo">{FINALIZACOES_NEGATIVAS[status]}</p>
      </div>
    );
  }

  const indiceAtual = ETAPAS.findIndex((etapa) => etapa.chave === status);

  return (
    <div className="status-timeline">
      {ETAPAS.map((etapa, i) => (
        <div key={etapa.chave} className="status-etapa">
          <span className={i <= indiceAtual ? 'bolinha preenchida' : 'bolinha'}>●</span>
          <span className={i <= indiceAtual ? 'etapa-ativa' : 'etapa-inativa'}>{etapa.label}</span>
        </div>
      ))}
    </div>
  );
}
