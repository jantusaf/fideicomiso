import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TablaDeudoresParque from '../../../components/nivel2/deudoresparque/tabla';
import { nivel } from '../../../helpers/herlperlogin'

import BarraLAteral from '../../../components/nivel2/MenuIzq2'

export default function DeudoresParquePagina() {
  const navigate = useNavigate();
  const [logueado, setLogueado] = useState(true)

  // Deslogueo si no es nivel 2
  useEffect(() => {
    const verificar = async () => {
      const esniv2 = await nivel(2) // helper de verificacion
      if (esniv2) {
        setLogueado(true)
      } else {
        navigate('/login')
      }
    }
    verificar()
  }, [navigate])

  return (
    <div>
      {logueado ? (
        <BarraLAteral>
          <TablaDeudoresParque />
        </BarraLAteral>
      ) : null}
    </div>
  );
}
