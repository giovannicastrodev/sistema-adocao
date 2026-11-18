import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const { entrar } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await entrar(email, senha);
      navigate('/animais');
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível entrar. Verifique seu e-mail e senha.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Cabeçalho do Card */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-brand-500 mx-auto flex items-center justify-center shadow-2xs">
            <PawPrint className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 tracking-tight">
            Bem-vindo de volta!
          </h2>
          <p className="text-xs text-stone-500">
            Acesse sua conta de adotante para acompanhar seus pedidos
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
              Seu e-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="exemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15 outline-hidden transition-all placeholder:text-stone-400"
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
            className="w-full shadow-md shadow-brand-500/25"
          >
            Entrar na conta
          </Button>
        </form>

        {/* Rodapé do Card */}
        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-500">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro" className="font-bold text-brand-600 hover:text-brand-700">
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}
