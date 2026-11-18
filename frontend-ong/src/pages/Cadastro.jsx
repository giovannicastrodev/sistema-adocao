import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, Phone, MapPin, FileText, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', endereco: '', cnpj: '' });
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  function atualizar(campo, valor) {
    setForm({ ...form, [campo]: valor });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await cadastrar(form);
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível criar a conta da ONG.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Cadastrar Organização
          </h2>
          <p className="text-xs text-slate-500">
            Crie a conta da sua ONG ou abrigo para gerenciar adoções e animais
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Razão Social ou Nome da ONG *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Ex: Associação Protetora dos Animais"
                value={form.nome}
                onChange={(e) => atualizar('nome', e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                E-mail Institucional *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="contato@ong.org"
                  value={form.email}
                  onChange={(e) => atualizar('email', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Senha (mín. 6 dígitos) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={form.senha}
                  onChange={(e) => atualizar('senha', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                CNPJ *
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="00.000.000/0000-00"
                  value={form.cnpj}
                  onChange={(e) => atualizar('cnpj', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Telefone de Contato
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="(11) 3333-3333"
                  value={form.telefone}
                  onChange={(e) => atualizar('telefone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Endereço / Cidade / Estado
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rua das Flores, 123 - Curitiba, PR"
                value={form.endereco}
                onChange={(e) => atualizar('endereco', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={enviando}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full shadow-md shadow-emerald-900/20 mt-2"
          >
            Cadastrar ONG
          </Button>
        </form>

        {/* Rodapé */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Sua ONG já possui conta?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:text-emerald-800">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
