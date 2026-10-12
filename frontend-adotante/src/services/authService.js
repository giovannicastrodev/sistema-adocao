import api from './api';

export async function cadastrar(dados) {
  const { data } = await api.post('/auth/cadastro', dados);
  return data;
}

export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}
