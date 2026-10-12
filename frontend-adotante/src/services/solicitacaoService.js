import api from './api';

export async function criarSolicitacao(animalId) {
  const { data } = await api.post('/solicitacoes', { animalId });
  return data;
}

export async function listarMinhasSolicitacoes() {
  const { data } = await api.get('/solicitacoes/minhas');
  return data;
}

export async function buscarSolicitacao(id) {
  const { data } = await api.get(`/solicitacoes/${id}`);
  return data;
}

export async function cancelarSolicitacao(id) {
  const { data } = await api.patch(`/solicitacoes/${id}/cancelar`);
  return data;
}
