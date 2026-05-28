
import BarraLAteral from '../../../components/nivel6/menuizq6'
import AgregarIcc from '../../../components/resumenes/resumen6'
import CssBaseline from '@mui/material/CssBaseline';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";






export default function Legajos() {
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

      //servicioUsuario.setToken(user.token)  


    }

  }, [])

  return (

    <>
      {logueado ? <div>
        <CssBaseline />
        <BarraLAteral>


          < AgregarIcc />

        </BarraLAteral>
      </div> : <div></div>} </>

  );

}