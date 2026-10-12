import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { ong, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-topo">
        <h2>🐾 Painel ONG</h2>
        {ong && <p className="sidebar-nome">{ong.nome}</p>}
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/animais">Animais</NavLink>
        <NavLink to="/solicitacoes">Solicitações</NavLink>
      </nav>

      <button onClick={handleSair} className="btn-secundario sidebar-sair">Sair</button>
    </aside>
  );
}
