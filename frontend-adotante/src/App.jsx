import { BrowserRouter, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import AppRoutes from './routes/AppRoutes';
import { PawPrint, Heart } from 'lucide-react';
import './styles.css';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-[#fdfaf6] text-stone-800 font-sans selection:bg-orange-100 selection:text-orange-900">
          <Navbar />

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <AppRoutes />
          </main>

          {/* Rodapé Acolhedor */}
          <footer className="border-t border-stone-200/80 bg-white py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
              <div className="flex items-center gap-2 font-medium text-stone-700">
                <div className="w-6 h-6 rounded-lg bg-orange-50 text-brand-500 flex items-center justify-center">
                  <PawPrint className="w-3.5 h-3.5" />
                </div>
                <span>Adote um Amigo © {new Date().getFullYear()}</span>
              </div>

              <div className="flex items-center gap-1 text-center">
                <span>Feito com</span>
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                <span>para conectar vidas e promover o bem-estar animal.</span>
              </div>

              <div className="flex items-center gap-4">
                <Link to="/animais" className="hover:text-brand-600 transition-colors">
                  Animais
                </Link>
                <Link to="/login" className="hover:text-brand-600 transition-colors">
                  Entrar
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
