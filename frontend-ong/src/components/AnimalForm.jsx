import { useState } from 'react';
import Button from './ui/Button';
import { Image as ImageIcon, Save, AlertCircle, Sparkles } from 'lucide-react';

const VAZIO = {
  nome: '', especie: 'CACHORRO', raca: '', idade: '', porte: 'MEDIO',
  sexo: 'MACHO', descricao: '', foto: '',
};

export default function AnimalForm({ valoresIniciais, onSalvar, textoBotao = 'Salvar' }) {
  const [form, setForm] = useState({ ...VAZIO, ...valoresIniciais });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [imgErro, setImgErro] = useState(false);

  function atualizar(campo, valor) {
    if (campo === 'foto') setImgErro(false);
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {erro && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Formulário Principal (8 colunas) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Dados do Animal</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do Animal *
            </label>
            <input
              type="text"
              placeholder="Ex: Thor, Mel, Pipoca"
              value={form.nome}
              onChange={(e) => atualizar('nome', e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Espécie *</label>
              <select
                value={form.especie}
                onChange={(e) => atualizar('especie', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:border-emerald-600 focus:bg-white outline-hidden"
              >
                <option value="CACHORRO">Cachorro</option>
                <option value="GATO">Gato</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Porte *</label>
              <select
                value={form.porte}
                onChange={(e) => atualizar('porte', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:border-emerald-600 focus:bg-white outline-hidden"
              >
                <option value="PEQUENO">Pequeno</option>
                <option value="MEDIO">Médio</option>
                <option value="GRANDE">Grande</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sexo *</label>
              <select
                value={form.sexo}
                onChange={(e) => atualizar('sexo', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:border-emerald-600 focus:bg-white outline-hidden"
              >
                <option value="MACHO">Macho</option>
                <option value="FEMEA">Fêmea</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Raça</label>
              <input
                type="text"
                placeholder="Ex: SRD / Labrador"
                value={form.raca}
                onChange={(e) => atualizar('raca', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Idade aproximada (anos)</label>
              <input
                type="number"
                min="0"
                placeholder="Ex: 2"
                value={form.idade ?? ''}
                onChange={(e) => atualizar('idade', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              URL da Foto
            </label>
            <input
              type="url"
              placeholder="https://exemplo.com/foto-do-pet.jpg"
              value={form.foto}
              onChange={(e) => atualizar('foto', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              História e Descrição
            </label>
            <textarea
              rows={4}
              placeholder="Descreva o temperamento do animal, necessidades especiais, vacinas, etc..."
              value={form.descricao}
              onChange={(e) => atualizar('descricao', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all resize-y"
            />
          </div>
        </div>

        {/* Live Preview da Foto (4 colunas) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pré-visualização do Pet
            </h4>

            <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
              {form.foto && !imgErro ? (
                <img
                  src={form.foto}
                  alt={form.nome || 'Preview'}
                  onError={() => setImgErro(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-4 text-slate-400 space-y-1">
                  <ImageIcon className="w-8 h-8 mx-auto stroke-1" />
                  <p className="text-xs font-medium">Insira a URL da foto ao lado para ver o preview</p>
                </div>
              )}
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-900 text-base">
                {form.nome || 'Nome do Pet'}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {form.especie === 'CACHORRO' ? 'Cachorro' : form.especie === 'GATO' ? 'Gato' : 'Outro'} •{' '}
                {form.porte ? form.porte.toLowerCase() : 'porte'} •{' '}
                {form.idade ? `${form.idade} ano(s)` : 'idade não informada'}
              </p>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={salvando}
            icon={Save}
            className="w-full shadow-md shadow-emerald-900/20"
          >
            {textoBotao}
          </Button>
        </div>
      </div>
    </form>
  );
}
