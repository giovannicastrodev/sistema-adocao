import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [ong, setOng] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ong_token');
    const ongSalva = localStorage.getItem('ong_user');
    if (token && ongSalva) {
      setOng(JSON.parse(ongSalva));
    }
    setCarregando(false);
  }, []);

  async function entrar(email, senha) {
    const resposta = await authService.login(email, senha);
    if (resposta.perfil !== 'ROLE_ONG') {
      throw new Error('Esta conta nao e de uma ONG. Use a area do adotante.');
    }
    salvarSessao(resposta);
  }

  async function cadastrar(dados) {
    const resposta = await authService.cadastrarOng(dados);
    salvarSessao(resposta);
  }

  function salvarSessao(resposta) {
    const dadosOng = { id: resposta.id, nome: resposta.nome, perfil: resposta.perfil };
    localStorage.setItem('ong_token', resposta.token);
    localStorage.setItem('ong_user', JSON.stringify(dadosOng));
    setOng(dadosOng);
  }

  function sair() {
    localStorage.removeItem('ong_token');
    localStorage.removeItem('ong_user');
    setOng(null);
  }

  return (
    <AuthContext.Provider value={{ ong, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
