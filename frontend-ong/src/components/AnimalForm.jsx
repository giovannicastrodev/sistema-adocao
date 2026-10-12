import { useState } from 'react';

const VAZIO = {
  nome: '', especie: 'CACHORRO', raca: '', idade: '', porte: 'MEDIO',
  sexo: 'MACHO', descricao: '', foto: '',
};

export default function AnimalForm({ valoresIniciais, onSalvar, textoBotao = 'Salvar' }) {
  const [form, setForm] = useState({ ...VAZIO, ...valoresIniciais });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setSalvando(true);
    try {
      await onSalvar({ ...form, idade: form.idade === '' ? null : Number(form.idade) });
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível salvar o animal.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="formulario-animal">
      {erro && <p className="mensagem-erro">{erro}</p>}

      <label>Nome</label>
      <input value={form.nome} onChange={(e) => atualizar('nome', e.target.value)} required />

      <div className="linha-form">
        <div>
          <label>Espécie</label>
          <select value={form.especie} onChange={(e) => atualizar('especie', e.target.value)}>
            <option value="CACHORRO">Cachorro</option>
            <option value="GATO">Gato</option>
            <option value="OUTRO">Outro</option>
          </select>
        </div>
        <div>
          <label>Porte</label>
          <select value={form.porte} onChange={(e) => atualizar('porte', e.target.value)}>
            <option value="PEQUENO">Pequeno</option>
            <option value="MEDIO">Médio</option>
            <option value="GRANDE">Grande</option>
          </select>
        </div>
        <div>
          <label>Sexo</label>
          <select value={form.sexo} onChange={(e) => atualizar('sexo', e.target.value)}>
            <option value="MACHO">Macho</option>
            <option value="FEMEA">Fêmea</option>
          </select>
        </div>
      </div>

      <div className="linha-form">
        <div>
          <label>Raça</label>
          <input value={form.raca} onChange={(e) => atualizar('raca', e.target.value)} />
        </div>
        <div>
          <label>Idade (anos)</label>
          <input type="number" min="0" value={form.idade ?? ''} onChange={(e) => atualizar('idade', e.target.value)} />
        </div>
      </div>

      <label>Foto (URL)</label>
      <input value={form.foto} onChange={(e) => atualizar('foto', e.target.value)} placeholder="https://..." />

      <label>Descrição</label>
      <textarea rows={4} value={form.descricao} onChange={(e) => atualizar('descricao', e.target.value)} />

      <button type="submit" className="btn-primario" disabled={salvando}>
        {salvando ? 'Salvando...' : textoBotao}
      </button>
    </form>
  );
}
