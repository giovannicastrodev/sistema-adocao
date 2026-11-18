import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import './styles.css';

function Layout() {
  const { ong } = useAuth();
  const location = useLocation();
  const telaPublica = location.pathname === '/login' || location.pathname === '/cadastro';

  if (!ong || telaPublica) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-800">
        <AppRoutes />
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f8fafc] text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <Sidebar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 overflow-y-auto">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
