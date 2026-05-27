import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import servicioCuotas from '../../../services/cuotas'

import servicioCliente from '../../../services/clientes'

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

  const [nuevoIcc, setNuevoIcc] = useState()


  const handleChange = (e) =>{
    setNuevoIcc({  ...nuevoIcc, [e.target.name]: e.target.value })
    console.log(nuevoIcc)
  }


  const setear = () => {
   
    setNuevoIcc ({
        id:props.id
    })
    
    
    //{if(rta.puede=''){ props.setpuede()}}




  }

  const preba = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const cuil_cuit = preba.cuil_cuit



  const handleClickOpen = () => {
    setear()
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
   
  };

  const designar = async (event) => {
    
  
 await servicioCuotas.asignarICC(nuevoIcc)
    props.traer()
 setOpen(false);

}

  ////
  const pagar = async (event) => {
   // event.preventDefault();
    try {

      await servicioCliente.pagar()


    } catch (error) {
      console.error(error);
      console.log('Error algo sucedio')

    }

    setOpen(false);
  };/////
  const [currency, setCurrency] = React.useState('EUR');

  /*   const handleChange = (event) => {
      setCurrency(event.target.value);
    }; */


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
      agregar ICC
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
        <TextField
                            autoFocus
                            margin="dense"
                            variant="filled"
                            type={'number'}
                            id="name"
                            label="Icc"
                            name="ICC"
                            onChange={handleChange}
                            fullWidth
                        />
           

      <Button onClick={handleClose} size="small" variant="contained" >
              Cerrar
            </Button>
            <Button onClick={designar} size="small" variant="contained" >
              agregar
            </Button>
      </DialogContent>
    </Dialog>
    </Box >




  );
}