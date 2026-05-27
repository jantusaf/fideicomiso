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
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          mb: 1,
          px: 2.2,
          py: 1.05,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 900,
          backgroundColor: '#01567c',
          boxShadow: '0 10px 25px rgba(1,86,124,0.22)',
          '&:hover': { backgroundColor: '#014a6b' }
        }}
      >
        Deshabilitar
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 22px 70px rgba(10,59,79,0.28)',
            border: '1px solid rgba(1,86,124,0.12)',
          }
        }}
      >
        {/* Header moderno (sin cambiar imports, uso sx en el title) */}
        <DialogTitle
          sx={{
            px: 2.6,
            py: 2.1,
            color: '#fff',
            fontWeight: 900,
            letterSpacing: 0.3,
            background: 'linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)',

            // 🔹 clave para eliminar bordes blancos
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        >
          Deshabilitar legajo
        </DialogTitle>

        <DialogContent sx={{ p: 2.4 }}>
          <div
            style={{
              marginTop: 20,              // 👈 más aire desde el header
              borderRadius: 14,
              padding: 16,
              background: 'rgba(211,47,47,0.06)',
              border: '1px solid rgba(211,47,47,0.18)',
            }}
          >

            <DialogContentText
              sx={{
                m: 0,
                fontWeight: 900,
                color: 'rgba(130,0,0,0.88)',
              }}
            >
              Atención
            </DialogContentText>

            <DialogContentText
              sx={{
                mt: 0.6,
                color: 'rgba(10,59,79,0.78)',
                lineHeight: 1.5,
              }}
            >
              Se deshabilitará y por lo tanto se determinará como completo los legajos del cliente.
              Verificá antes de confirmar.
            </DialogContentText>
          </div>

          {/* separador visual suave */}
          <div
            style={{
              height: 1,
              width: '100%',
              background: 'rgba(1,86,124,0.10)',
              margin: '10px 0 4px'
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.4,
            py: 1.6,
            borderTop: '1px solid rgba(1,86,124,0.10)',
            backgroundColor: '#fff',
            gap: 1.2
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontWeight: 900,
              borderRadius: 2,
              px: 2,
              color: 'rgba(10,59,79,0.85)',
              backgroundColor: 'rgba(1,86,124,0.06)',
              border: '1px solid rgba(1,86,124,0.10)',
              '&:hover': { backgroundColor: 'rgba(1,86,124,0.10)' }
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDeterminar}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 900,
              borderRadius: 2,
              px: 2.2,
              backgroundColor: '#148D8D',
              boxShadow: '0 10px 25px rgba(20,141,141,0.24)',
              '&:hover': { backgroundColor: '#0f7a7a' }
            }}
          >
            Deshabilitar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
