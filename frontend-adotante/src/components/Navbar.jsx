import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PawPrint, HeartHandshake, LogOut, User, Menu, X, Sparkles } from 'lucide-react';
import Button from './ui/Button';

export default function Navbar() {
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  function handleSair() {
    sair();
    setMenuAberto(false);
    navigate('/login');
  }

  const linkAtivo = (caminho) =>
    location.pathname === caminho
      ? 'text-brand-600 font-semibold bg-orange-50/80'
      : 'text-stone-600 hover:text-brand-600 hover:bg-stone-50';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-stone-900 font-bold text-lg tracking-tight group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <PawPrint className="w-5 h-5" />
          </div>
          <span>
            Adote um <span className="text-brand-500">Amigo</span>
          </span>
        </Link>

        {/* Links Desktop */}
        <nav className="hidden md:flex items-center gap-1.5">
          <Link
            to="/animais"
            className={`px-3.5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${linkAtivo('/animais')}`}
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Encontrar Pets</span>
          </Link>

          {usuario && (
            <Link
              to="/minhas-solicitacoes"
              className={`px-3.5 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${linkAtivo('/minhas-solicitacoes')}`}
            >
              <HeartHandshake className="w-4 h-4 text-brand-500" />
              <span>Minhas Solicitações</span>
            </Link>
          )}
        </nav>

        {/* Auth / Ações Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {usuario ? (
            <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
              <div className="flex items-center gap-2 text-sm text-stone-700 bg-stone-50 py-1.5 px-3 rounded-full border border-stone-200/60">
                <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs">
                  {usuario.nome.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium">{usuario.nome.split(' ')[0]}</span>
              </div>
              <button
                onClick={handleSair}
                title="Sair"
                className="p-2 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-brand-600 hover:bg-stone-50 rounded-xl transition-colors"
              >
                Entrar
              </Link>
              <Link to="/cadastro">
                <Button variant="primary" size="md">
                  Criar conta
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMenuAberto(!menuAberto)}
          className="md:hidden p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          aria-label="Abrir menu"
        >
          {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Menu Mobile */}
      {menuAberto && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-white border-b border-stone-200 flex flex-col gap-2 animate-in slide-in-from-top-2 duration-150">
          <Link
            to="/animais"
            onClick={() => setMenuAberto(false)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${linkAtivo('/animais')}`}
          >
            <Sparkles className="w-4 h-4 text-brand-500" />
            Encontrar Pets
          </Link>

          {usuario && (
            <Link
              to="/minhas-solicitacoes"
              onClick={() => setMenuAberto(false)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 ${linkAtivo('/minhas-solicitacoes')}`}
            >
              <HeartHandshake className="w-4 h-4 text-brand-500" />
              Minhas Solicitações
            </Link>
          )}

          <div className="pt-3 mt-1 border-t border-stone-100 flex flex-col gap-2">
            {usuario ? (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-sm text-stone-700">
                  <User className="w-4 h-4 text-stone-400" />
                  <span>Olá, {usuario.nome.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleSair}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuAberto(false)}
                  className="w-full text-center py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 rounded-xl"
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  onClick={() => setMenuAberto(false)}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-xs"
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
