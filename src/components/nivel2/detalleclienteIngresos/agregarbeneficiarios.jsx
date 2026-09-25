import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, Select, TextField } from '@mui/material';
import servicioCliente from '../../../services/clientes';

const BeneficiariosDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState(2);
  const [beneficiarios, setBeneficiarios] = useState({
    beneficiario1: '',
    cuilBeneficiario1: '',
    beneficiario2: '',
    cuilBeneficiario2: '',
    beneficiario3: '',
    cuilBeneficiario3: '',
    id:props.id
  });

  const handleChange = (e) => {
    setCantidad(e.target.value);
  };

  const handleInputChange = (e) => {
    console.log(beneficiarios)
    setBeneficiarios({
      ...beneficiarios,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Beneficiarios:', beneficiarios);
    servicioCliente.agregarbeneficiarios(beneficiarios)
    setOpen(false);
  };

  // OJO: este botón NO tiene onClick a propósito (así estaba originalmente).
  // El endpoint /agregarbeneficiarios sobrescribe los 3 beneficiarios con lo que
  // envía el diálogo (que arranca vacío) y no exige login: activarlo sin corregir
  // eso podría borrar beneficiarios existentes.
  return (
    <div>
      <Button variant="outlined" sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 1.5,
          px: 2.25,
          color: '#1a303e',
          borderColor: '#c9d2d8',
          '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' }
        }}>
        Agregar beneficiarios
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        <DialogTitle>Agregar Beneficiarios</DialogTitle>
        <DialogContent>
          <Select value={cantidad} onChange={handleChange} fullWidth>
            <MenuItem value={2}>2 Beneficiarios</MenuItem>
            <MenuItem value={3}>3 Beneficiarios</MenuItem>
          </Select>
          <TextField name="beneficiario1" label="Beneficiario 1" fullWidth onChange={handleInputChange} margin="dense" />
          <TextField name="cuilBeneficiario1" label="CUIL Beneficiario 1" fullWidth onChange={handleInputChange} margin="dense" />
          <TextField name="porcentaje1" label="porcentaje 1" fullWidth onChange={handleInputChange} margin="dense" />

          <TextField name="beneficiario2" label="Beneficiario 2" fullWidth onChange={handleInputChange} margin="dense" />
          <TextField name="cuilBeneficiario2" label="CUIL Beneficiario 2" fullWidth onChange={handleInputChange} margin="dense" />
          <TextField name="porcentaje2" label="porcentaje 2" fullWidth onChange={handleInputChange} margin="dense" />

             {cantidad === 3 && (
            <>
              <TextField name="beneficiario3" label="Beneficiario 3" fullWidth onChange={handleInputChange} margin="dense" />
              <TextField name="cuilBeneficiario3" label="CUIL Beneficiario 3" fullWidth onChange={handleInputChange} margin="dense" />
              <TextField name="porcentaje3" label="porcentaje 3" fullWidth onChange={handleInputChange} margin="dense" />

              </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} color="primary">Aceptar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BeneficiariosDialog;
