import { Link } from 'react-router-dom';

const LABEL_STATUS = {
  DISPONIVEL: 'Disponível',
  EM_PROCESSO: 'Em processo',
  ADOTADO: 'Adotado',
  ARQUIVADO: 'Arquivado',
};

export default function AnimalTable({ animais }) {
  if (animais.length === 0) {
    return <p>Nenhum animal cadastrado ainda.</p>;
  }

  return (
    <table className="tabela">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Espécie</th>
          <th>Porte</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {animais.map((a) => (
          <tr key={a.id}>
            <td>{a.nome}</td>
            <td>{a.especie}</td>
            <td>{a.porte}</td>
            <td><span className={`badge badge-${a.status.toLowerCase()}`}>{LABEL_STATUS[a.status]}</span></td>
            <td>
              <Link to={`/animais/${a.id}`} className="link-tabela">Ver</Link>
              {' · '}
              <Link to={`/animais/${a.id}/editar`} className="link-tabela">Editar</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
