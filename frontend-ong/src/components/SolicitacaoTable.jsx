import { Link } from 'react-router-dom';

const LABEL_STATUS = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  APROVADA: 'Aprovada',
  RECUSADA: 'Recusada',
  CANCELADA: 'Cancelada',
};

export default function SolicitacaoTable({ solicitacoes }) {
  if (solicitacoes.length === 0) {
    return <p>Nenhuma solicitação recebida ainda.</p>;
  }

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Adotante</th>
          <th>Animal</th>
          <th>Data</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {solicitacoes.map((s) => (
          <tr key={s.id}>
            <td>{s.usuarioNome}</td>
            <td>{s.animalNome}</td>
            <td>{new Date(s.dataSolicitacao).toLocaleDateString('pt-BR')}</td>
            <td><span className={`badge badge-${s.status.toLowerCase()}`}>{LABEL_STATUS[s.status]}</span></td>
            <td><Link to={`/solicitacoes/${s.id}`} className="link-tabela">Analisar</Link></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
