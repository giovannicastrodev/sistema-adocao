import { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adotante_token');
    const usuarioSalvo = localStorage.getItem('adotante_user');
    if (token && usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    }
    setCarregando(false);
  }, []);

  async function entrar(email, senha) {
    const resposta = await authService.login(email, senha);
    if (resposta.perfil !== 'ROLE_ADOTANTE') {
      throw new Error('Esta conta nao e de adotante. Use a area de ONGs.');
    }
    salvarSessao(resposta);
  }

  async function cadastrar(dados) {
    const resposta = await authService.cadastrar(dados);
    salvarSessao(resposta);
  }

  function salvarSessao(resposta) {
    const dadosUsuario = { id: resposta.id, nome: resposta.nome, perfil: resposta.perfil };
    localStorage.setItem('adotante_token', resposta.token);
    localStorage.setItem('adotante_user', JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  function sair() {
    localStorage.removeItem('adotante_token');
    localStorage.removeItem('adotante_user');
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, cadastrar, sair }}>
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
