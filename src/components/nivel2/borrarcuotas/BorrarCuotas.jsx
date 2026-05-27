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
    boxShadow: '0 20px 60px rgba(10,59,79,0.22)',
   
  };

  const sxDialogTitle = {
    px: 2.4,
    py: 1.8,
    color: '#fff',
    background: 'linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)',
    fontWeight: 900,
    letterSpacing: 0.2,
  };

  const sxDialogContent = {
    px: 2.4,
    py: 2.2,
    backgroundColor: '#ffffff',
  };

  const sxWarnBox = {
    marginTop: 10,
    padding: '12px 14px',
    borderRadius: 12,
    backgroundColor: 'rgba(211,47,47,0.07)',
    border: '1px solid rgba(211,47,47,0.18)',
    color: 'rgba(130,0,0,0.85)',
    fontWeight: 700,
    fontSize: 13,
    lineHeight: 1.35,
  };

  const sxActions = {
    px: 2.4,
    py: 1.6,
    borderTop: '1px solid rgba(1,86,124,0.10)',
    backgroundColor: '#fff',
  };

  const sxCancelBtn = {
    textTransform: 'none',
    fontWeight: 900,
    borderRadius: 2,
    px: 2,
    color: 'rgba(10,59,79,0.85)',
    backgroundColor: 'rgba(1,86,124,0.06)',
    border: '1px solid rgba(1,86,124,0.10)',
    '&:hover': { backgroundColor: 'rgba(1,86,124,0.10)' },
  };

  const sxConfirmBtn = {
    textTransform: 'none',
    fontWeight: 900,
    borderRadius: 2,
    px: 2.2,
    backgroundColor: '#d32f2f',
    boxShadow: '0 10px 25px rgba(211,47,47,0.18)',
    '&:hover': { backgroundColor: '#b71c1c' },
  };

  return (
    <div>
      <Button variant="contained"  sx={{
          mb: 2,
          px: 2.2,
          py: 1.1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 700, 
          backgroundColor: '#01567c',
          boxShadow: '0 10px 25px rgba(1,86,124,0.25)',
          '&:hover': { backgroundColor: '#014a6b' }
        }} onClick={handleClickOpen}>
        Borrar cuotas
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: sxDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={sxDialogTitle}>
          Borrar cuotas del lote
        </DialogTitle>

        <DialogContent sx={sxDialogContent}>
          <DialogContentText sx={{
    fontWeight: 800,
    color: '#0a3b4f',
    mt: 2,   // 🔹 separa del encabezado
    mb: 2    // 🔹 separa del bloque rojo
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
                borderRadius: 2,
                backgroundColor: '#fbfdff',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(1,86,124,0.20)',
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(1,86,124,0.40)',
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#01567c',
                boxShadow: '0 0 0 3px rgba(1,86,124,0.12)',
              },
              '& .MuiInputLabel-root': {
                fontWeight: 800,
                color: '#2b3a42',
              },
            }}
          />

          {error && (
            <div style={{ color: 'crimson', fontWeight: 800, marginTop: 10 }}>
              {error}
            </div>
          )}
        </DialogContent>

        <DialogActions sx={sxActions}>
          <Button onClick={handleClose} variant="contained" 
        style={{
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 900,
          backgroundColor: "#01567c",
          boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
          color: "#fff",
        }}>
            Cancelar
          </Button>

          <Button onClick={borarTodas} variant="contained" 
        style={{
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 900,
          backgroundColor: "#148D8D",
          boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
          color: "#fff",
        }}>
            Confirmar borrado
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
