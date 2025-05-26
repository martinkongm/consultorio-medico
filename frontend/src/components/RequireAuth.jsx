import { Navigate, useLocation } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const isAuthenticated = localStorage.getItem('authenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
