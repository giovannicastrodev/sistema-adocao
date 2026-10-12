import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <p className="carregando">Carregando...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
