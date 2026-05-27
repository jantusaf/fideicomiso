import * as React from 'react';
import { useEffect, useState } from "react";

import AsignarLoteACliente from '../../../components/nivel2/asignarlotecliente/AsignarLoteACliente';
import Lotes from '../../../components/nivel2/lotes/Lotes';
import { useNavigate } from "react-router-dom";
import BarraLAteral from '../../../components/nivel2/MenuIzq2'


const drawerWidth = 240;

export default function DetalleCliente() {
  const navigate = useNavigate();
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
  { logueado ? <div> 

    <BarraLAteral>
<AsignarLoteACliente/>
<Lotes/>
 </BarraLAteral>

 </div>   :<div></div> } </div>
  );
}