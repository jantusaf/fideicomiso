import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import servicioCliente from '../../../services/clientes'


export default function Ingresos(props) {
  let params = useParams()
  let cuil_cuit = params.cuil_cuit

  const [open, setOpen] = React.useState(false);
  const [ingreso, setIngreso] = useState({
    cuil_cuit: cuil_cuit,
    cuil_cuit_admin: props.cuil_cuit_user

  })


  const handleClickOpen = () => {
    setOpen(true);
    cargar()
  };
  const cargar = async (event) => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const usuario = JSON.parse(loggedUserJSON)
    //  console.log(usuario.cuil_cuit)

  
      setIngreso({ ...ingreso,  ['cuil_cuit_admin']: usuario.cuil_cuit});
   
    }
  };
  const handleDeterminar = async (event) => {
    event.preventDefault();
    try {
 
console.log(ingreso)
      await servicioCliente.habilitar(ingreso)


    } catch (error) {
      console.error(error);
      console.log('Error algo sucedio')


    }
    props.getData()
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Habilitar
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Habilitar legajo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Atencion: se habilitará y por lo tanto de determinará como completo los legajos del cliente
          </DialogContentText>

          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleDeterminar} >Habilitar </Button>
          </DialogActions>

        </DialogContent>



      </Dialog>
    </div>
  );
}
