import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import servicioCliente from '../../../services/clientes'
import { COLOR_TEXT, COLOR_MUTED, sxBtnPrimary, sxBtnOutlined, sxBtnDangerOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "../detalleclienteIngresos/estilos";

export default function Ingresos(props) {
  let params = useParams()
  let cuil_cuit = params.cuil_cuit

  const [open, setOpen] = React.useState(false);
  const [ingreso, setIngreso] = useState({
    cuil_cuit: cuil_cuit,
    cuil_cuit_admin: props.cuil_cuit_user
  })

  const handleClickOpen = () => {
    setOpen(true);
    cargar()
  };

  const cargar = async (event) => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const usuario = JSON.parse(loggedUserJSON)
      setIngreso({ ...ingreso, ['cuil_cuit_admin']: usuario.cuil_cuit });
    }
  };

  const handleDeterminar = async (event) => {
    event.preventDefault();
    try {
      await servicioCliente.deshabilitar(ingreso)
    } catch (error) {
      console.error(error);
      console.log('Error algo sucedio')
    }
    props.getData()
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} sx={sxBtnDangerOutlined}>
        Deshabilitar
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>Deshabilitar legajo</DialogTitle>

        <DialogContent sx={{ px: 3, py: 2 }}>
          <div
            style={{
              marginTop: 16,
              borderRadius: 10,
              padding: 14,
              background: 'rgba(198,40,40,0.04)',
              border: '1px solid #e3b5b5',
            }}
          >
            <DialogContentText sx={{ m: 0, fontWeight: 700, color: '#c62828', fontSize: 14 }}>
              Atención
            </DialogContentText>

            <DialogContentText sx={{ mt: 0.5, color: COLOR_TEXT, lineHeight: 1.5, fontSize: 14 }}>
              Se deshabilitará y por lo tanto se determinará como completo los legajos del cliente.
              Verificá antes de confirmar.
            </DialogContentText>
          </div>
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>
            Cancelar
          </Button>

          <Button onClick={handleDeterminar} variant="contained" sx={sxBtnPrimary}>
            Deshabilitar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
