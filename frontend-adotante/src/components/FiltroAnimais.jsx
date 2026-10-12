export default function FiltroAnimais({ filtros, onChange, onFiltrar }) {
  function atualizar(campo, valor) {
    onChange({ ...filtros, [campo]: valor });
  }

  return (
    <div className="filtro-animais">
      <input
        type="text"
        placeholder="Pesquisar por nome, raça ou descrição..."
        value={filtros.q}
        onChange={(e) => atualizar('q', e.target.value)}
        className="filtro-busca"
      />

      <div className="filtro-selects">
        <select value={filtros.especie} onChange={(e) => atualizar('especie', e.target.value)}>
          <option value="">Espécie: Todos</option>
          <option value="CACHORRO">Cachorro</option>
          <option value="GATO">Gato</option>
          <option value="OUTRO">Outro</option>
        </select>

        <select value={filtros.porte} onChange={(e) => atualizar('porte', e.target.value)}>
          <option value="">Porte: Todos</option>
          <option value="PEQUENO">Pequeno</option>
          <option value="MEDIO">Médio</option>
          <option value="GRANDE">Grande</option>
        </select>

        <select value={filtros.sexo} onChange={(e) => atualizar('sexo', e.target.value)}>
          <option value="">Sexo: Todos</option>
          <option value="MACHO">Macho</option>
          <option value="FEMEA">Fêmea</option>
        </select>

        <input
          type="number"
          min="0"
          placeholder="Idade"
          value={filtros.idade}
          onChange={(e) => atualizar('idade', e.target.value)}
        />

        <input
          type="text"
          placeholder="Raça"
          value={filtros.raca}
          onChange={(e) => atualizar('raca', e.target.value)}
        />
      </div>

      <button onClick={onFiltrar} className="btn-primario">FILTRAR</button>
    </div>
  );
}
