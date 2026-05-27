import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import servicioPagos from '../../../services/pagos'
import NativeSelect from '@mui/material/NativeSelect';
import useUser from '../../../hooks/useUser'
import ServicioLegajos from '../../../services/legajos'
import Tooltip from "@mui/material/Tooltip";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
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
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext


  

  
  const preba = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const cuil_cuit = preba.cuil_cuit



  const handleClickOpen = () => {
    setOpen(true);
  
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  
  const handleDeterminar = async (event) => {
    event.preventDefault();
    try {

      await ServicioLegajos.borrar(props.id)
      props.reload()

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

      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
       < Tooltip title="Leer">
      <DeleteForeverIcon variant="outlined" onClick={handleClickOpen}/>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>

            ¿Seguro desea borrar legajo?
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleDeterminar} >Si </Button>
          </DialogActions>
      </Dialog>
    </Box >

   
  );
}