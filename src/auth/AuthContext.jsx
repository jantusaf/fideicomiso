import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import servicioUsuario from '../services/usuarios';
import { tokenVigente } from './decodeJwt';

const STORAGE_KEY = 'loggedNoteAppUser';
const INACTIVIDAD_MS = 60 * 60 * 1000; // 60 minutos
const EVENTOS_ACTIVIDAD = [
  'mousemove',
  'mousedown',
  'keydown',
  'scroll',
  'touchstart',
  'click',
];

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

// Lee la sesión guardada y la valida (token presente y no expirado).
const leerSesion = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw);
    if (!u || !u.token || !tokenVigente(u.token)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return u;
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    return null;
  }
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => leerSesion());
  const inactividadRef = useRef(null);

  const logout = useCallback(
    (motivo) => {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* noop */
      }
      setUser(null);
      if (motivo === 'inactividad') {
        setTimeout(() => {
          try {
            alert('Tu sesión se cerró por inactividad. Ingresá nuevamente.');
          } catch {
            /* noop */
          }
        }, 0);
      }
      navigate('/login', { replace: true });
    },
    [navigate]
  );

  const login = useCallback((userObj) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(userObj));
    servicioUsuario.setToken(userObj.token);
    setUser(userObj);
  }, []);

  // Mantiene el token cargado en memoria del servicio de axios.
  useEffect(() => {
    if (user && user.token) {
      servicioUsuario.setToken(user.token);
    }
  }, [user]);

  // Interceptor global: corta la sesión ante 401/403 o el body "error login"
  // (el backend responde 200 con texto "error login" cuando el token falla).
  useEffect(() => {
    const id = axios.interceptors.response.use(
      (resp) => {
        if (
          typeof resp.data === 'string' &&
          resp.data.trim() === 'error login'
        ) {
          logout('sesion');
          return Promise.reject(new Error('error login'));
        }
        return resp;
      },
      (error) => {
        const status = error && error.response && error.response.status;
        const data = error && error.response && error.response.data;
        if (
          status === 401 ||
          status === 403 ||
          (typeof data === 'string' && data.trim() === 'error login')
        ) {
          logout('sesion');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(id);
  }, [logout]);

  // Cierre por inactividad (60 min) + chequeo periódico de expiración del token.
  useEffect(() => {
    if (!user) return undefined;

    const reiniciarTimer = () => {
      if (inactividadRef.current) clearTimeout(inactividadRef.current);
      inactividadRef.current = setTimeout(
        () => logout('inactividad'),
        INACTIVIDAD_MS
      );
    };

    let ultimo = 0;
    const onActividad = () => {
      const ahora = Date.now();
      if (ahora - ultimo < 1000) return; // throttle
      ultimo = ahora;
      reiniciarTimer();
    };

    EVENTOS_ACTIVIDAD.forEach((ev) =>
      window.addEventListener(ev, onActividad, { passive: true })
    );
    reiniciarTimer();

    const chequeoExp = setInterval(() => {
      if (!tokenVigente(user.token)) logout('expirada');
    }, 60 * 1000);

    return () => {
      EVENTOS_ACTIVIDAD.forEach((ev) =>
        window.removeEventListener(ev, onActividad)
      );
      if (inactividadRef.current) clearTimeout(inactividadRef.current);
      clearInterval(chequeoExp);
    };
  }, [user, logout]);

  const value = {
    user,
    nivel: user ? Number(user.nivel) : null,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export default AuthContext;
