import * as React from 'react';
import  { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


import  Clientes from '../../components/buscador/componente'



import { ThemeProvider, createTheme } from '@mui/material/styles';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


const drawerWidth = 240;

export default function MenuUsuario2() {
  const navigate = useNavigate();

  const [logueado, setLogueado] = useState(false) 


  


  return (
   
<div> 
< Clientes /></div>
  );
}