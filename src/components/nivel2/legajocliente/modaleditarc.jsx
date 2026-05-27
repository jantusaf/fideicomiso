import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import servicioLegajos from '../../../services/legajos';

const tiposCbu = ["Cbu personal", "Cbu familiar", "Socio/Gerente/Apoderado", "Propio"];

const ModalEditarDescripcion = ({ open, handleClose, data, getData }) => {
  const [descripcion, setDescripcion] = useState('');

  useEffect(() => {
    if (data) {
      setDescripcion(data.descripcion || '');
    }
  }, [data]); // Se ejecuta cada vez que cambia `data`

  const handleGuardar = async () => {
    if (!data) return;

    try {
      let rta;
      if (tiposCbu.includes(data.tipo)) {
        rta = await servicioLegajos.modificarcbu({ id: data.id, descripcion });
      } else {
        rta = await servicioLegajos.modificarconstancianormal({ id: data.id, descripcion });
      }
      alert(rta);
      getData();
      handleClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ width: 400, p: 3, bgcolor: 'white', mx: 'auto', mt: 10, borderRadius: 2 }}>
        <Typography variant="h6">Editar Descripción</Typography>

        <TextField
          fullWidth
          label="Tipo"
          variant="outlined"
          value={data?.tipo || ''}
          disabled
          margin="normal"
        />

        <TextField
          fullWidth
          label="Descripción"
          variant="outlined"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          margin="normal"
        />

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="primary" onClick={handleGuardar}>
            Guardar
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalEditarDescripcion;
