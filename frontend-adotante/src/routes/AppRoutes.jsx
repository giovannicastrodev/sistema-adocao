import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Home from '../pages/Home';
import Animais from '../pages/Animais';
import AnimalDetalhes from '../pages/AnimalDetalhes';
import MinhasSolicitacoes from '../pages/MinhasSolicitacoes';
import SolicitacaoDetalhes from '../pages/SolicitacaoDetalhes';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/animais" element={<Animais />} />
      <Route path="/animais/:id" element={<AnimalDetalhes />} />
      <Route
        path="/minhas-solicitacoes"
        element={
          <PrivateRoute>
            <MinhasSolicitacoes />
          </PrivateRoute>
        }
      />
      <Route
        path="/solicitacoes/:id"
        element={
          <PrivateRoute>
            <SolicitacaoDetalhes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
