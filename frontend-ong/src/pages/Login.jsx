import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, Mail, Lock, ArrowRight, AlertCircle, PawPrint } from 'lucide-react';
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
      navigate('/dashboard');
    } catch (err) {
      setErro(err.response?.data?.message || err.message || 'Não foi possível entrar. Verifique suas credenciais.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-soft p-6 sm:p-8 space-y-6">
        {/* Cabeçalho */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-2xs">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Painel da ONG
          </h2>
          <p className="text-xs text-slate-500">
            Acesse o ambiente de gestão de animais e solicitações da sua organização
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
              E-mail da Instituição
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                placeholder="contato@ong.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-emerald-600 focus:ring-3 focus:ring-emerald-600/15 outline-hidden transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Senha de Acesso
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
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
            className="w-full shadow-md shadow-emerald-900/20"
          >
            Acessar Painel
          </Button>
        </form>

        {/* Rodapé */}
        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Sua ONG ainda não tem cadastro?{' '}
          <Link to="/cadastro" className="font-bold text-emerald-700 hover:text-emerald-800">
            Cadastre sua organização
          </Link>
        </div>
      </div>
    </div>
  );
}
