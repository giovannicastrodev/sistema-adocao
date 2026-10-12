import api from './api';

export async function listarAnimais(filtros = {}) {
  const params = {};
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== '' && valor !== undefined && valor !== null) {
      params[chave] = valor;
    }
  });
  const { data } = await api.get('/animais', { params });
  return data;
}

export async function buscarAnimal(id) {
  const { data } = await api.get(`/animais/${id}`);
  return data;
}
