import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import servicioLegajos from '../../../services/legajos';
import { COLOR_TEXT, sxBtnPrimary, sxBtnOutlined, sxCard } from '../detalleclienteIngresos/estilos';

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
      <Box
        sx={{
          ...sxCard,
          width: { xs: "calc(100% - 32px)", sm: 440 },
          p: 3,
          mx: "auto",
          mt: 10,
          outline: "none",
          boxShadow: "0 20px 50px rgba(15, 34, 48, 0.25)",
        }}
      >
        <Typography sx={{ fontSize: 17, fontWeight: 700, color: COLOR_TEXT }}>Editar descripción</Typography>

        <TextField
          fullWidth
          size="small"
          label="Tipo"
          variant="outlined"
          value={data?.tipo || ''}
          disabled
          margin="normal"
          sx={{ mt: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
        />

        <TextField
          fullWidth
          size="small"
          label="Descripción"
          variant="outlined"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          margin="normal"
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
        />

        <Box sx={{ mt: 2.5, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button variant="outlined" onClick={handleClose} sx={sxBtnOutlined}>
            Cerrar
          </Button>
          <Button variant="contained" onClick={handleGuardar} sx={sxBtnPrimary}>
            Guardar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalEditarDescripcion;
