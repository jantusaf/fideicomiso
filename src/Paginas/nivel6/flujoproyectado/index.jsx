import BarraLAteral from '../../../components/nivel6/menuizq6'
import FlujoProyectado from '../../../components/resumenes/flujoproyectado'
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FlujoDeFondosProyectado() {
  const navigate = useNavigate();
  const [logueado, setLogueado] = useState(false)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      if (user.nivel != 6) {
        window.localStorage.removeItem('loggedNoteAppUser')
        navigate('/login')
      } else {
        setLogueado(true)
      }
    }
  }, [])

  return (
    <div>
      {logueado ? <div>
        <CssBaseline />
        <BarraLAteral>
          <FlujoProyectado />
        </BarraLAteral>
      </div> : <div></div>}
    </div>
  );
}
