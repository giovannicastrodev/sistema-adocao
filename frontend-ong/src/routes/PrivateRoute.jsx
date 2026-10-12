import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { ong, carregando } = useAuth();

  if (carregando) {
    return <p className="carregando">Carregando...</p>;
  }

  if (!ong) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
