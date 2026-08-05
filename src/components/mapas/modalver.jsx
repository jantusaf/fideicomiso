import React, { useState, forwardRef, useImperativeHandle } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Formulario from './formulariolotes';
import Componentever from './componenteinfo';

const DialogComponent = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [nivel, setNivel] = useState(false);

  const getClients = async () => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setNivel(user.nivel);
    }
  };

  const openDialog = () => {
    setOpen(true);
    getClients();
  };

  const closeDialog = () => setOpen(false);

  useImperativeHandle(ref, () => ({ openDialog, closeDialog }), []);

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0097a7 0%, #006064 100%)',
        padding: '18px 20px 16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LocationOnIcon style={{ color: '#fff', fontSize: 22 }} />
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 17, letterSpacing: 0.3 }}>
            {nivel == 4 ? 'Agregar detalles' : 'Info del lote'}
          </span>
        </div>
        <IconButton onClick={closeDialog} size="small" sx={{ color: 'rgba(255,255,255,0.8)', '&:hover': { color: '#fff', background: 'rgba(255,255,255,0.15)' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <DialogContent sx={{ p: 0 }}>
        {nivel ? (
          nivel == 4 ? (
            <div style={{ padding: '20px 24px' }}>
              <Formulario
                getClients={props.getClients}
                info={props.info}
                mapa={props.mapa}
                cerrar={closeDialog}
              />
            </div>
          ) : (
            <Componentever
              nivel={nivel}
              info={props.info}
              mapa={props.mapa}
              cerrar={closeDialog}
            />
          )
        ) : null}
      </DialogContent>
    </Dialog>
  );
});

export default DialogComponent;
