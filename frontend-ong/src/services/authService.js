import api from './api';

export async function login(email, senha) {
  const { data } = await api.post('/auth/login', { email, senha });
  return data;
}

export async function cadastrarOng(dados) {
  const { data } = await api.post('/auth/ong', dados);
  return data;
}
