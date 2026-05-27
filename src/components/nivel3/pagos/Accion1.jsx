import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import servicioPagos from '../../../services/pagos'
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import {  useState } from "react";
export default function FormDialog(props) {
  const [open, setOpen] = React.useState(false);
   const [form, setForm] = useState ({
    id:props.id
   })

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const rechazar =async ()  => {
     await servicioPagos.rechazararpagoniv3(form)
     setOpen(false);

  // window.location.reload(true)
  }
  const handleChange = (e) =>
  setForm({  ...form, [e.target.name]: e.target.value })
  return (
    <div>
      <ThumbDownAltIcon variant="outlined" onClick={handleClickOpen}>
        Open form dialog
      </ThumbDownAltIcon>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Rechazar</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Detalla  motivo del rechazo 
          </DialogContentText>
          <form  onSubmit={rechazar}>

          <InputLabel  variant="standard" htmlFor="uncontrolled-native">
                          Tipo de pago 
                        </InputLabel>
                        <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{
                                name: 'tipo',
                                id: 'uncontrolled-native',
                               
                            }}
                        >   <option  value={'Inusual'}>Elegir</option>
                            <option   value={'Inusual'}>Inusual</option>
                            <option  value={'Sospechoso'}>Sospechoso</option>
                         
                        </NativeSelect> 
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
           <Button onClick={() => {rechazar(props.id)}}>Rechazar</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
         
        </DialogActions>
        
      </Dialog>
    </div>
  );
}
