import * as React from 'react';
import { useEffect, useState } from "react";


import PagarCuota from '../../../components/nivel2/pagarcuota/PagarCuota';
import { useNavigate } from "react-router-dom";
import BarraLAteral from '../../../components/nivel2/MenuIzq2'
import servicioUsuario from '../../../services/usuarios'
import Ingresos from '../../../components/nivel2/detalleclienteIngresos/Ingresos'


//import {makeStyles} from "@material-ui/core/styles"


const drawerWidth = 240;

export default function DetalleCliente() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [modal, setModal] = useState(false)

  const [ingreso, setIngreso] = useState({
    ingreso: "",

  });

  const [logueado, setLogueado] = useState(false)
  useEffect(() => {
    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
      
    if (loggedUserJSON) {
      
      const user = JSON.parse(loggedUserJSON)
      if (user.nivel != 2){
        window.localStorage.removeItem('loggedNoteAppUser')
   

      }else{

        setLogueado(true)
      }
    
      //servicioUsuario.setToken(user.token)  
     
      
    }else{
      navigate('/login')
     
    }
   
  }, []) 





  ////////

  return (

    <div>
      {logueado ? <div>
        <BarraLAteral>

          {<PagarCuota
          />}
        </BarraLAteral>
      </div> : <div></div>} </div>

  );
}