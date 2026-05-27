import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import servicioClientes from '../../../services/clientes'
import NativeSelect from '@mui/material/NativeSelect';
import servicioCliente from '../../../services/clientes'
import servicioLotes from '../../../services/lotes'
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, Fragment } from "react";

const currencies = [
  {
    value: 'CBU',
    label: 'CBU N°1',
  },
  {
    value: 'CBU',
    label: 'CBU N°2',
  },

];

export default function SelectTextFields(props) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext

  const [rta, setRta] = useState()
  const [habilitado, setHabilitado] = useState(false)




  const traer = async () => {
   
    const valor = await servicioLotes.calcular(props.datos)
    console.log(valor)
    setRta(valor)
    if (valor.puede){
      setHabilitado(true)
    }
    
    
    //{if(rta.puede=''){ props.setpuede()}}




  }

  const preba = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const cuil_cuit = preba.cuil_cuit



  const handleClickOpen = () => {
    traer()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false)
   
  };

  const designar = async (event) => {
    
  
 const rta = await servicioClientes.ventaLote(props.datos)
console.log(rta)
     navigate('/usuario2/detallecliente/'+rta[1])


}


////


  return (

    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <Button variant="outlined" onClick={handleClickOpen}>
      Comprobar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
      {rta? <div> 
        <h2>  Lote: {rta.nombre} </h2>  
        Superficie: {rta.superficie} <br/>
        Actual valor metro cuadrado: {rta.valor} <br/>
        Valor del terreno: ${rta.precio}<br/>
        Valor del anticipo: ${rta.anticipo}<br/>
        Saldo a Financiar: ${rta.finalSant}<br/>
        Valor de cuotas en 60(20% anticipo): ${rta.cuotas60}<br/>
        Ingresos: ${rta.ingresos}<br/>
       Estado: {rta.estado}
        <h3>{rta.puede}</h3> 
        {props.puedee}


          

         

          {habilitado ? <div> 
            <Button onClick={designar} position="right"variant='contained' size="small" >Asignar</Button>
        </div> : <div> 
        <h3>   No puede asignarse el lote</h3>
            Motivo/s: <br/>
            {rta.lotetieneasignado} <br/>
            {rta.cuotamuygrande}

        </div>}
      </div>  : <div> 
        
      </div> }
           

      <Button onClick={handleClose} size="small" variant="contained" >
              Cerrar
            </Button>
      </DialogContent>
    </Dialog>
    </Box >




  );
}