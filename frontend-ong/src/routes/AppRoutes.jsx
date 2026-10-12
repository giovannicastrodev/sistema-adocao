import { Navigate, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Dashboard from '../pages/Dashboard';
import Animais from '../pages/Animais';
import AnimalNovo from '../pages/AnimalNovo';
import AnimalDetalhes from '../pages/AnimalDetalhes';
import AnimalEditar from '../pages/AnimalEditar';
import Solicitacoes from '../pages/Solicitacoes';
import SolicitacaoDetalhes from '../pages/SolicitacaoDetalhes';
import Interessados from '../pages/Interessados';
import PrivateRoute from './PrivateRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/animais" element={<PrivateRoute><Animais /></PrivateRoute>} />
      <Route path="/animais/novo" element={<PrivateRoute><AnimalNovo /></PrivateRoute>} />
      <Route path="/animais/:id" element={<PrivateRoute><AnimalDetalhes /></PrivateRoute>} />
      <Route path="/animais/:id/editar" element={<PrivateRoute><AnimalEditar /></PrivateRoute>} />
      <Route path="/animais/:animalId/interessados" element={<PrivateRoute><Interessados /></PrivateRoute>} />
      <Route path="/solicitacoes" element={<PrivateRoute><Solicitacoes /></PrivateRoute>} />
      <Route path="/solicitacoes/:id" element={<PrivateRoute><SolicitacaoDetalhes /></PrivateRoute>} />
    </Routes>
  );
}
