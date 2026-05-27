import * as React from 'react';
import { useParams } from "react-router-dom";
import { useState } from "react";
import servicioCliente from '../../../services/clientes';
import {
  Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, NativeSelect, InputLabel, Paper, Backdrop, CircularProgress,
  Typography
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

export default function ClienteNuevo({ getClients }) {
  let { cuil_cuit } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeterminar = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
     const resultado= await servicioCliente.crear(form);
      alert(resultado);
      getClients();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert('Error al crear el cliente');
    }
    setLoading(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen} startIcon={<PersonAddAlt1Icon />}
        sx={{ mb: 2, backgroundColor: '#01567c', '&:hover': { backgroundColor: '#4d7d26' } }}>
        AGREGAR CLIENTE
      </Button>  
      
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle sx={{ backgroundColor: "#1a303e", color:'#fffff' }}>NUEVO CLIENTE</DialogTitle>
        <Paper sx={{ background: "#dcf0f6", padding: 2 }}>
          <DialogContent>
            <DialogContentText sx={{ fontFamily: 'Montserrat, sans-serif', color: "#555" }}>
              Complete los datos del nuevo cliente
            </DialogContentText>
            <form onSubmit={handleDeterminar}>
              <TextField label="Nombre" name="Nombre" onChange={handleChange} fullWidth variant="outlined" margin="dense" />
              <InputLabel variant="standard">Razón</InputLabel>
              <NativeSelect name='razon' onChange={handleChange} fullWidth>
                <option value=''>Elegir</option>
                <option value='Empresa'>Empresa</option>
                <option value='Persona'>Persona</option>
              </NativeSelect>
      
              <TextField label="Número (con guiones)" name="cuil_cuit" onChange={handleChange} fullWidth variant="outlined" margin="dense" />
              <TextField label="Domicilio" name="domicilio" onChange={handleChange} fullWidth variant="outlined" margin="dense" />
              <TextField label="Teléfono" name="telefono" onChange={handleChange} fullWidth variant="outlined" margin="dense" />
              <TextField label="Observaciones" name="observaciones" onChange={handleChange} fullWidth variant="outlined" margin="dense" multiline rows={3} />
              
              <DialogActions>
                {form.cuil_cuit && form.observaciones && form.telefono && form.domicilio && form.Nombre ? (
                  <Button variant="contained" type="submit" sx={{ backgroundColor: "#6D9F71", color: "white" }}>Crear</Button>
                ) : (
                  <Typography color="error" sx={{ fontSize: 14 }}>Completar todos los campos</Typography>
                )}
                <Button variant="contained" color="error" onClick={handleClose}>Cancelar</Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Paper>
      </Dialog>
      
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={loading}>
        <CircularProgress color="inherit" />
        <Typography sx={{ marginLeft: 2 }}>Guardando y Analizando...</Typography>
      </Backdrop>
    </div>
  );
}
