import * as React from 'react';
import { useEffect, useState } from "react";


import DetalleL from '../../../components/nivel2/legajocliente/LegajoCliente';
import { useNavigate } from "react-router-dom";
import BarraLAteral from '../../../components/nivel2/MenuIzq2'
import servicioUsuario from '../../../services/usuarios'
import Ingresos from '../../../components/nivel2/detalleclienteIngresos/Ingresos'
import { useParams } from "react-router-dom"

//import {makeStyles} from "@material-ui/core/styles"


const drawerWidth = 240;

export default function DetalleCliente() {
    let params = useParams()
    let cuil_cuit = params.cuil_cuit
  const navigate = useNavigate();

  const [logueado, setLogueado] = useState(false) 
  const [user, setUser] = useState({}) 
  useEffect(() => {
    
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
      
    if (loggedUserJSON) {
      
      const user = JSON.parse(loggedUserJSON)
      if (user.nivel != 2 && user.nivel != 3){
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
  { logueado ? <div> 
    <BarraLAteral>

      {<DetalleL
      cuil_cuit={cuil_cuit} 
      cuil_cuit_user= {user.cuil_cuit}/>}
 </BarraLAteral>
 </div>   :<div></div> } </div>
  );
}