import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', telefone: '', endereco: '' });
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
      navigate('/animais');
    } catch (err) {
      setErro(err.response?.data?.message || 'Não foi possível criar sua conta. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-stone-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-brand-500 mx-auto flex items-center justify-center shadow-2xs">
            <PawPrint className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Crie sua conta de Adotante
          </h2>
          <p className="text-xs text-stone-500">
            Preencha seus dados para começar a demonstrar interesse nos animais
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={(e) => atualizar('nome', e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                E-mail *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={(e) => atualizar('email', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Senha (mín. 6 dígitos) *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  value={form.senha}
                  onChange={(e) => atualizar('senha', e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Telefone / WhatsApp
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={form.telefone}
                  onChange={(e) => atualizar('telefone', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Cidade / Bairro
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="São Paulo, SP"
                  value={form.endereco}
                  onChange={(e) => atualizar('endereco', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
                />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={enviando}
            icon={ArrowRight}
            iconPosition="right"
            className="w-full shadow-md shadow-brand-500/25 mt-2"
          >
            Finalizar Cadastro
          </Button>
        </form>

        {/* Rodapé */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          Já possui conta cadastrada?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:text-brand-700">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
