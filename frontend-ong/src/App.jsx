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
      <main className="conteudo-publico">
        <AppRoutes />
      </main>
    );
  }

  return (
    <div className="layout-ong">
      <Sidebar />
      <main className="conteudo-principal">
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
