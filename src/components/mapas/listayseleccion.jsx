import { useState, useEffect } from "react";


import { useNavigate } from "react-router-dom";
import Ic3 from "./soloic3"
import PIT from "./soloparque"

import Usuar from "../mapassegundaparte/componente1"
import MApaterceraparte from "../mapassegundaparte/nuevocomponente"

import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import Modaldetalles from './modalver'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });



const Lotes = () => {
    //configuracion de Hooks
    const [mapa, setMapa] = useState("3");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

  
 
    const handleChange = (e) => {
        console.log( e.target.value)
        setMapa(e.target.value)


    }
    return (
        <>
           <NativeSelect
  defaultValue={30}
  onChange={handleChange}
  sx={{
    fontSize: "1.6rem",   // tamaño de "Elegir"
    fontWeight: "500",
  }}
  inputProps={{
    name: 'anio',
    id: 'uncontrolled-native',
  }}
>
  <option value="" style={{ fontSize: "1.2rem" }}>Elegir</option>
  <option value={3} style={{ fontSize: "1.2rem" }}>Uso de suelo</option>
  <option value={1} style={{ fontSize: "1.2rem" }}>IC3</option>
  <option value={2} style={{ fontSize: "1.2rem" }}>Parque</option>
  <option value={4} style={{ fontSize: "1.2rem" }}>Nuevo</option>

  MApaterceraparte
  
</NativeSelect>
{ mapa === "1" ? <><Ic3/></>:<>


{ mapa === "2" ? <><PIT/></>:<>
<br/><br/>
{ mapa === "3" ? <><Usuar/></>:<>
<br/>
Componetne2
Sin seleccion



</>}
{ mapa === "3" ? <><Usuar/></>:<>
<br/>




</>}
{ mapa === "4" ? <><MApaterceraparte/></>:<>
<br/>




</>}


</>}



</>}

        </>


    )
}

export default Lotes;

