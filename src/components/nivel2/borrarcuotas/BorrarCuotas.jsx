import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import servicioCuotas from '../../../services/cuotas';

export default function Borrarcuotas(props) {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword('');
    setError('');
  };

  const borarTodas = async () => {
    if (password === 'conpumundohipermegared') {
      await servicioCuotas.borrarcuotas(props.id);
      handleClose();
    } else {
      setError('Contraseña incorrecta');
    }
  };

  // ====== estilos (solo frontend) ======
  const sxDangerBtn = {
    px: 2.2,
    py: 1.1,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 900,
    backgroundColor: '#d32f2f',
    boxShadow: '0 10px 25px rgba(211,47,47,0.18)',
    '&:hover': { backgroundColor: '#b71c1c' },
  };

  const sxDialogPaper = {
    borderRadius: 3,
    overflow: 'hidden',
  };

  const sxDialogTitle = {
    px: 3,
    py: 2,
    color: '#1a303e',
    borderBottom: '1px solid #e2e6e9',
    fontWeight: 700,
  };

  const sxDialogContent = {
    px: 3,
    py: 2.5,
    backgroundColor: '#ffffff',
  };

  const sxWarnBox = {
    marginTop: 10,
    padding: '12px 14px',
    borderRadius: 8,
    backgroundColor: 'rgba(198,40,40,0.05)',
    border: '1px solid rgba(198,40,40,0.2)',
    color: '#8a1c1c',
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1.4,
  };

  const sxActions = {
    px: 3,
    py: 2,
    borderTop: '1px solid #e2e6e9',
    backgroundColor: '#fff',
    gap: 1,
  };

  const sxCancelBtn = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 1.5,
    px: 2.25,
    color: '#1a303e',
    borderColor: '#c9d2d8',
    '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' },
  };

  const sxConfirmBtn = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 1.5,
    px: 2.25,
    backgroundColor: '#c62828',
    boxShadow: 'none',
    '&:hover': { backgroundColor: '#a81f1f', boxShadow: 'none' },
  };

  return (
    <div>
      <Button variant="outlined" sx={{
          px: 2.25,
          borderRadius: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          color: '#c62828',
          borderColor: '#e3b5b5',
          '&:hover': { borderColor: '#c62828', backgroundColor: 'rgba(198, 40, 40, 0.04)' }
        }} onClick={handleClickOpen}>
        Borrar cuotas
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { sx: sxDialogPaper },
          backdrop: { sx: { backgroundColor: 'rgba(15, 34, 48, 0.45)' } },
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={sxDialogTitle}>
          Borrar cuotas del lote
        </DialogTitle>

        <DialogContent sx={sxDialogContent}>
          <DialogContentText sx={{
    fontWeight: 600,
    color: '#1a303e',
    mt: 2,
    mb: 2
  }}>
            Ingresá la contraseña para confirmar la eliminación.
          </DialogContentText>

          <div style={sxWarnBox}>
            Atención: esta acción elimina cuotas. Verificá que sea el lote correcto.
          </div>

          <TextField
            autoFocus
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
              },
            }}
          />

          {error && (
            <div style={{ color: '#c62828', fontWeight: 600, marginTop: 10 }}>
              {error}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={sxActions}>
          <Button onClick={handleClose} variant="outlined" sx={sxCancelBtn}>
            Cancelar
          </Button>

          <Button onClick={borarTodas} variant="contained" sx={sxConfirmBtn}>
            Confirmar borrado
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
