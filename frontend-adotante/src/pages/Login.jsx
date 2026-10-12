import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha);
      navigate('/animais');
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível entrar.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-auth">
      <form onSubmit={handleSubmit} className="card-auth">
        <h2>Entrar</h2>
        {erro && <p className="mensagem-erro">{erro}</p>}

        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Senha</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required />

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </button>

        <p>Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </form>
    </div>
  );
}
