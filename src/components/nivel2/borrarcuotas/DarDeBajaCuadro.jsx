import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import servicioCuotas from '../../../services/cuotas';
import { sxBtnOutlined } from '../detalleclienteIngresos/estilos';

// Marca con la que el backend archiva las cuotas de un cuadro dado de baja.
export const MARCA_BAJA = 'Archivada';

// Da de baja (o restaura) el cuadro de cuotas de UN lote. No borra nada: las
// cuotas quedan en la base como historial pero dejan de contar como deuda.
export default function DarDeBajaCuadro({ id_lote, cuotas, descripcion, onListo }) {
  const [open, setOpen] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const lista = Array.isArray(cuotas) ? cuotas.filter((c) => c && typeof c === 'object') : [];
  const vigentes = lista.filter((c) => c.cuota_cancelada === 'No').length;
  const archivadas = lista.filter((c) => c.cuota_cancelada === MARCA_BAJA).length;

  // Si el cuadro ya está dado de baja se ofrece restaurarlo.
  const restaurar = vigentes === 0 && archivadas > 0;
  const cantidad = restaurar ? archivadas : vigentes;

  // Sin cuotas vigentes ni archivadas (p. ej. lote cancelado) no hay nada que hacer.
  if (cantidad === 0) return null;

  const handleClose = () => {
    if (cargando) return;
    setOpen(false);
    setError('');
  };

  const confirmar = async () => {
    setCargando(true);
    setError('');
    try {
      const usuario = JSON.parse(window.localStorage.getItem('loggedNoteAppUser') || '{}');
      const datos = { id_lote, cuil_cuit_administrador: usuario.cuil_cuit };
      const rta = restaurar
        ? await servicioCuotas.restaurarCuadro(datos)
        : await servicioCuotas.bajaCuadro(datos);

      if (rta && rta.ok) {
        setOpen(false);
        if (onListo) await onListo();
      } else {
        setError((rta && rta.mensaje) || 'No se pudo completar la operación.');
      }
    } catch (e) {
      console.error(e);
      setError('No se pudo completar la operación.');
    } finally {
      setCargando(false);
    }
  };

  const sxConfirmBtn = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 1.5,
    px: 2.25,
    backgroundColor: restaurar ? '#1a303e' : '#c9791a',
    boxShadow: 'none',
    '&:hover': { backgroundColor: restaurar ? '#0f2230' : '#a86212', boxShadow: 'none' },
  };

  return (
    <div>
      <Button variant="outlined" sx={sxBtnOutlined} onClick={() => setOpen(true)}>
        {restaurar ? 'Restaurar cuadro' : 'Dar de baja'}
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, overflow: 'hidden' } },
          backdrop: { sx: { backgroundColor: 'rgba(15, 34, 48, 0.45)' } },
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, color: '#1a303e', borderBottom: '1px solid #e2e6e9', fontWeight: 700 }}>
          {restaurar ? 'Restaurar el cuadro de cuotas' : 'Dar de baja el cuadro de cuotas'}
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5, backgroundColor: '#ffffff' }}>
          <DialogContentText sx={{ fontWeight: 600, color: '#1a303e', mt: 2, mb: 1.5 }}>
            {descripcion || 'Lote seleccionado'}
          </DialogContentText>

          <DialogContentText sx={{ color: '#41525e', lineHeight: 1.5 }}>
            {restaurar
              ? `Las ${cantidad} cuotas de este cuadro volverán a contar como deuda en Deudores y en los flujos de fondos.`
              : `Las ${cantidad} cuotas de este cuadro se conservan en el sistema como historial, pero dejan de contar como deuda en Deudores y en los flujos de fondos. No se elimina nada ni se registra ningún pago. Podés restaurarlo más adelante. Solo afecta a este lote.`}
          </DialogContentText>

          {error && <div style={{ color: '#c62828', fontWeight: 600, marginTop: 12 }}>{error}</div>}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e6e9', backgroundColor: '#fafbfc' }}>
          <Button onClick={handleClose} disabled={cargando} sx={sxBtnOutlined}>
            Cancelar
          </Button>
          <Button onClick={confirmar} disabled={cargando} variant="contained" sx={sxConfirmBtn}>
            {cargando ? 'Procesando…' : restaurar ? 'Confirmar restauración' : 'Confirmar baja'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
