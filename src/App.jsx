import Rutas from "./Rutas/Rutas";
import NotiContext from "./context/NotiContext";
import UserContext from "./context/UserContext";
import InusualContext from "./context/inusualesContext";

import { BrowserRouter, useRoutes } from "react-router-dom";
import { useState } from "react";

import { AuthProvider, useAuth } from "./auth/AuthContext";

import servicioPagos from "./services/pagos";

function App() {
  const element = useRoutes(Rutas);

  // La sesión ahora vive en AuthProvider (valida token + expiración).
  const { user } = useAuth();

  const [notiContext, setUserNotiContext] = useState(0);
  const [inusualContext, setUsInusualContext] = useState(0);

  const inusuales = async () => {
    const cantInusual = servicioPagos.cantidad();

    setUsInusualContext(cantInusual);
  };

  const declarar = async () => {
    const cantNoti = {
      cantidad: 8,
    };

    setUserNotiContext(cantNoti);
  };

  return (
    <UserContext.Provider value={{ userContext: user }}>
      <InusualContext.Provider value={inusualContext}>
        <NotiContext.Provider value={notiContext}>
          {element}
        </NotiContext.Provider>
      </InusualContext.Provider>
    </UserContext.Provider>
  );
}

export default function RootApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  );
}
