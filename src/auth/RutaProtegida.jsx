import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { homeDe } from './mapaNiveles';

// Guardia de rutas.
//  - Sin sesión válida  -> /login
//  - Nivel no permitido -> home de su propio nivel
//  - OK                 -> renderiza children (o <Outlet/> si es ruta anidada)
export default function RutaProtegida({ niveles, children }) {
  const { isAuthenticated, nivel } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  if (
    Array.isArray(niveles) &&
    niveles.length > 0 &&
    !niveles.includes(Number(nivel))
  ) {
    return <Navigate to={homeDe(nivel)} replace />;
  }

  return children ? children : <Outlet />;
}
