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

  return (
    <div>
      <Button variant="contained"   sx={{
          mb: 2,
          px: 2.2,
          py: 1.1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 700,
          backgroundColor: '#01567c',
          boxShadow: '0 10px 25px rgba(1,86,124,0.25)',
          '&:hover': { backgroundColor: '#014a6b' }
        }}>
        Agregar Beneficiarios
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
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
