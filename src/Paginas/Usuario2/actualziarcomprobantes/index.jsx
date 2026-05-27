import * as React from 'react';
import { useEffect, useState } from "react";
import {nivel} from '../../../helpers/herlperlogin'

import DetalleC from '../../../components/nivel2/detallestodoslospagoscli/DetallesPagosCuotas';

import { useNavigate } from "react-router-dom";
import BarraLAteral from '../../../components/nivel2/MenuIzq2'




export default function DetalleCliente() {
  const navigate = useNavigate();
 
 
  const [logueado, setLogueado] = useState(false) 

  useEffect(() => {
   
    traer()
      
        //servicioUsuario.setToken(user.token)  
       
        
     
    }, [])

  const traer = async () => {
    const esniv2 =  await nivel(2) //helper de verificacion
    console.log(esniv2)
    if (esniv2){
     setLogueado(true)
    }else{
     navigate('/login')
    }

   }
  
  


 

  ////////

  return (
    <div> 
  { logueado ? <div> 
    <BarraLAteral>
    
      {<DetalleC />}
 </BarraLAteral>
 </div>   :<div></div> } </div>
  );
}