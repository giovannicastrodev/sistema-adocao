import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();

  function handleSair() {
    sair();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">🐾 Adote um Amigo</Link>
      <div className="navbar-links">
        <Link to="/animais">Animais</Link>
        {usuario && <Link to="/minhas-solicitacoes">Minhas Solicitações</Link>}
        {usuario ? (
          <>
            <span className="navbar-usuario">Olá, {usuario.nome.split(' ')[0]}</span>
            <button onClick={handleSair} className="btn-link">Sair</button>
          </>
        ) : (
          <>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro" className="btn-destaque">Criar conta</Link>
          </>
        )}
      </div>
    </nav>
  );
}
