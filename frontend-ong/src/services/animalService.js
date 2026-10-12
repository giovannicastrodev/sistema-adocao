import api from './api';

export async function listarMeusAnimais() {
  const { data } = await api.get('/ongs/animais');
  return data;
}

export async function buscarAnimal(id) {
  const { data } = await api.get(`/animais/${id}`);
  return data;
}

export async function cadastrarAnimal(dados) {
  const { data } = await api.post('/animais', dados);
  return data;
}

export async function editarAnimal(id, dados) {
  const { data } = await api.put(`/animais/${id}`, dados);
  return data;
}

export async function arquivarAnimal(id) {
  await api.delete(`/animais/${id}`);
}

export async function alterarStatusAnimal(id, status) {
  const { data } = await api.patch(`/animais/${id}/status`, { status });
  return data;
}

export async function alterarDisponibilidade(id, disponivel) {
  const { data } = await api.patch(`/animais/${id}/disponibilidade`, { disponivel });
  return data;
}
