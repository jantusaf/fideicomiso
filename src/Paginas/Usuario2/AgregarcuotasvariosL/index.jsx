import * as React from 'react';
import  { useEffect, useState } from "react";

import BarraLAteral from '../../../components/nivel2/MenuIzq2'
import { useNavigate } from "react-router-dom";
import AgregarVarias from '../../../components/nivel2/agregarCuotasVariosLotes/Agregarvarios'

const drawerWidth = 240;

export default function MenuUsuario2() {
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
      setLogueado(true)
    }
   
  }, []) 

  

  let path =''


  
  
  return (

    <div> 
  { logueado ? <div>
 <BarraLAteral>
 <AgregarVarias/>
 </BarraLAteral>
 </div>   :<div></div> }</div>
  );
}