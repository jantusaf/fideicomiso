import * as React from 'react';
import { useEffect, useState } from "react";


import DetallesPagos from '../../../components/mapas/listayseleccion';
//import DetallesPagos from '../../../components/mapassegundaparte/componente1';
import { useNavigate } from "react-router-dom";
import BarraLAteral from '../../../components/nivel2/MenuIzq2'
import servicioUsuario from '../../../services/usuarios'
import Navbar from '../../../components/Navbar';



//import {makeStyles} from "@material-ui/core/styles"


const drawerWidth = 240;

export default function DetalleCliente() {
  const navigate = useNavigate();
const [logueado, setLogueado] = useState(false)
const [checking, setChecking] = useState(true)

useEffect(() => {
  const loggedUserJSON = localStorage.getItem('loggedNoteAppUser')

  if (!loggedUserJSON) {
    navigate('/login')
    return
  }

  const user = JSON.parse(loggedUserJSON)

  if (user.nivel !== 5) {
    navigate('/login')
    return
  }

  setLogueado(true)
  setChecking(false)
}, [])

 

   return (
  logueado && (
    <>
  <br/>
      <DetallesPagos />
    </>
  )
)}