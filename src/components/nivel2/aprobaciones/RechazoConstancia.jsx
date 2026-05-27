import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import servicioAprobaciones from '../../../services/Aprobaciones'
import {  useState } from "react";
import Tooltip from '@mui/material/Tooltip';
export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [completo, setCompleto] = React.useState(false);
  const [form, setForm] = useState ({
    id:props.id
   })
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const rechazar =async (event)  => {
   
    console.log(form)
   const respuesta = await servicioAprobaciones.rechazo(form)
   console.log(respuesta)

  window.location.reload(true)
 }
 const handleChange = (e) =>{
 setForm({  ...form, [e.target.name]: e.target.value })
 setCompleto(true)
 console.log(form)}

  return (
    <div>
      <Tooltip title="Rechazar">
      <ThumbDownAltIcon variant="outlined" onClick={handleClickOpen}/>
    </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Rechazar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Detalla  motivo del rechazo 
          </DialogContentText>
          <form  onSubmit={rechazar}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="detalle"
            name= "detalle"
            onChange={handleChange}
          
            fullWidth
            variant="standard"
          />
          {completo ? <div><Button onClick={rechazar}>Rechazar</Button> </div>  :<div> </div>}
          
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
         
        </DialogActions>
        
      </Dialog>
    </div>
  );
}
