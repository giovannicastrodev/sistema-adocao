import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PawPrint,
  HeartHandshake,
  LogOut,
  Building2,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';

export default function Sidebar() {
  const { ong, sair } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuAberto, setMobileMenuAberto] = useState(false);

  function handleSair() {
    sair();
    setMobileMenuAberto(false);
    navigate('/login');
  }

  const linkClasse = ({ isActive }) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-emerald-600/30 text-emerald-300 font-semibold border-l-3 border-emerald-400 pl-3'
        : 'text-slate-300 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* Barra Superior Mobile */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0d2818] text-white border-b border-[#173f27] sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <PawPrint className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight">Painel ONG</h2>
            {ong && <p className="text-[11px] text-emerald-400 truncate max-w-[180px]">{ong.nome}</p>}
          </div>
        </div>
        <button
          onClick={() => setMobileMenuAberto(!mobileMenuAberto)}
          className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
        >
          {mobileMenuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Menu Mobile Overlay */}
      {mobileMenuAberto && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 bg-[#0d2818] text-white p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                    <PawPrint className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">Painel ONG</h2>
                    <p className="text-xs text-emerald-400">Gestão de Adoções</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuAberto(false)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {ong && (
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-white truncate">{ong.nome}</p>
                    <p className="text-[11px] text-slate-400 truncate">{ong.email}</p>
                  </div>
                </div>
              )}

              <nav className="flex flex-col gap-1.5">
                <NavLink
                  to="/dashboard"
                  onClick={() => setMobileMenuAberto(false)}
                  className={linkClasse}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/animais"
                  onClick={() => setMobileMenuAberto(false)}
                  className={linkClasse}
                >
                  <PawPrint className="w-4 h-4" />
                  <span>Meus Animais</span>
                </NavLink>

                <NavLink
                  to="/solicitacoes"
                  onClick={() => setMobileMenuAberto(false)}
                  className={linkClasse}
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>Solicitações</span>
                </NavLink>
              </nav>
            </div>

            <button
              onClick={handleSair}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuAberto(false)} />
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-[#0d2818] border-r border-[#173f27] text-white p-5 min-h-screen shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Logo & Marca */}
          <div className="flex items-center gap-3 pb-5 border-b border-white/10">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-xs">
              <PawPrint className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white">Painel ONG</h2>
              <p className="text-[11px] text-emerald-400 font-medium">Gestão & Adoção</p>
            </div>
          </div>

          {/* Card da ONG Logada */}
          {ong && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{ong.nome}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="text-[10px] text-slate-400">Online</span>
                </div>
              </div>
            </div>
          )}

          {/* Links de Navegação */}
          <nav className="flex flex-col gap-1.5">
            <NavLink to="/dashboard" className={linkClasse}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/animais" className={linkClasse}>
              <PawPrint className="w-4 h-4 shrink-0" />
              <span>Animais</span>
            </NavLink>

            <NavLink to="/solicitacoes" className={linkClasse}>
              <HeartHandshake className="w-4 h-4 shrink-0" />
              <span>Solicitações</span>
            </NavLink>
          </nav>
        </div>

        {/* Rodapé da Sidebar */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={handleSair}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:text-rose-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Encerrar sessão</span>
          </button>
        </div>
      </aside>
    </>
  );
}
