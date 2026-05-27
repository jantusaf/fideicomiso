import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import servicioPagos from '../../../services/pagos'
import {  useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';


export default function AprobacionPago(props) {
  const [open, setOpen] = React.useState(false);
  const [cambiarmonto, setCambiarmonto] = React.useState(false);
  
   const [form, setForm] = useState ({
    id:props.id
   })
  
  const handleClickOpen = () => {
    setOpen(true);
  
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlemonto = () =>{
    setForm({  ...form, ['cambiarmonto']:!cambiarmonto})
  setCambiarmonto(!cambiarmonto)
  
  }

  const aprobar =async ()  => {
     await servicioPagos.aprobarpago(form)
   //  setOpen(false)
   window.location.reload(true);

  // window.location.reload(true)
  }
  const handleChange = (e) =>{
  console.log(form)
  setForm({  ...form, [e.target.name]: e.target.value })
}
  return (
    <div><Tooltip title="Aprobar pago/cambiar monto"arrow>
      <IconButton>
      <Button  onClick={handleClickOpen}>
       Aprobar
      </Button>
      </IconButton>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Aprobar Pago</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El monto a Aprobar es de <b>${props.monto}</b>
          </DialogContentText>
          
    <label><Checkbox label="Cambiar el monto" onChange={handlemonto} /> Cambiar el monto 
      </label>
    {cambiarmonto ?<div> 
          
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Determinar Monto"
            name= "montonuevo"
            type={'number'}
            onChange={handleChange}
            fullWidth
            variant="standard"
            min="0" 
          />
      
          </div>:<div> 
            
        
            
            
            </div>}


          
       
        </DialogContent>
        <DialogActions>
        {cambiarmonto ? <div>  </div>:<div> </div>}
        <Button onClick={() => {aprobar(props.id)}}>Aprobar </Button>
          <Button onClick={handleClose}>Cancel</Button>
         
        </DialogActions>
        
      </Dialog>
    </div>
  );
}
