import api from './api';

export async function listarSolicitacoesDaOng() {
  const { data } = await api.get('/ongs/solicitacoes');
  return data;
}

export async function listarInteressados(animalId) {
  const { data } = await api.get(`/animais/${animalId}/interessados`);
  return data;
}

export async function buscarSolicitacao(id) {
  const { data } = await api.get(`/solicitacoes/${id}`);
  return data;
}

export async function colocarEmAnalise(id) {
  const { data } = await api.patch(`/solicitacoes/${id}/analise`);
  return data;
}

export async function aprovarSolicitacao(id) {
  const { data } = await api.patch(`/solicitacoes/${id}/aprovar`);
  return data;
}

export async function recusarSolicitacao(id, observacao) {
  const { data } = await api.patch(`/solicitacoes/${id}/recusar`, { observacao });
  return data;
}
