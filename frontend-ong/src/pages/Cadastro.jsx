import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', endereco: '', cnpj: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await cadastrar(form);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível criar a conta da ONG.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="pagina-auth">
      <form onSubmit={handleSubmit} className="card-auth">
        <h2>Cadastrar ONG</h2>
        {erro && <p className="mensagem-erro">{erro}</p>}

        <label>Nome da organização</label>
        <input value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} required />

        <label>Email</label>
        <input type="email" value={form.email} onChange={(e) => atualizar('email', e.target.value)} required />

        <label>Senha</label>
        <input type="password" minLength={6} value={form.senha} onChange={(e) => atualizar('senha', e.target.value)} required />

        <label>CNPJ</label>
        <input value={form.cnpj} onChange={(e) => atualizar('cnpj', e.target.value)} placeholder="00.000.000/0000-00" required />

        <label>Telefone</label>
        <input value={form.telefone} onChange={(e) => atualizar('telefone', e.target.value)} />

        <label>Endereço</label>
        <input value={form.endereco} onChange={(e) => atualizar('endereco', e.target.value)} />

        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? 'Criando conta...' : 'Criar conta'}
        </button>

        <p>Já tem conta? <Link to="/login">Entrar</Link></p>
      </form>
    </div>
  );
}
