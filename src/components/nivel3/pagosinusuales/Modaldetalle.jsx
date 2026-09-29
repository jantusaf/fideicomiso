import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import {
  COLOR_TEXT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxBtnPrimary,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
} from "../../nivel2/detalleclienteIngresos/estilos";

const textoEstado = (proceso) => {
  if (proceso === 'averificarnivel2') return 'Pendiente carga de documentación';
  if (proceso === 'averificarnivel3') return 'Pendiente clasificación de Gerencia';
  if (proceso === 'Inusual') return 'Cerrado (Sin alerta)';
  if (proceso === 'Sospechoso') return 'Cerrado (Con Alerta)';
  return '-';
};

const Dato = ({ label, value }) => (
  <Box sx={{ py: 1.1, borderBottom: `1px solid #eef1f3`, "&:last-of-type": { borderBottom: 0 } }}>
    <Typography sx={{ fontSize: 12, color: COLOR_MUTED, fontWeight: 600 }}>{label}</Typography>
    <Typography sx={{ fontSize: 14.5, color: COLOR_TEXT, fontWeight: 600, mt: 0.25 }}>{value ?? "-"}</Typography>
  </Box>
);

const ModalDetallePago = ({ open, handleClose, data }) => {
  if (!data) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" slotProps={slotPropsDialog}>
      <Box sx={sxDialogTitle}>
        <Typography sx={{ fontSize: 17, fontWeight: 700, color: COLOR_TEXT }}>Detalle del pago</Typography>
      </Box>
      <DialogContent sx={{ px: 3, py: 1 }}>
        <Dato label="Nombre" value={data.Nombre} />
        <Dato label="CUIL/CUIT" value={data.cuil_cuitc} />
        <Dato label="Tipología" value={data.tipologia} />
        <Dato label="Fecha notificación" value={data.fechanotificacion} />
        <Dato label="Fecha vencimiento" value={data.fechavencimiento} />
        <Dato label="Importe" value={`$${Number(data.monto).toFixed(2)}`} />
        <Dato label="Riesgo" value={`${data.riesgo}%`} />
        <Dato label="Estado" value={textoEstado(data.proceso)} />
        <Dato label="Detalle" value={data.detalle} />
      </DialogContent>
      <DialogActions sx={sxDialogActions}>
        <Button onClick={handleClose} variant="contained" sx={sxBtnPrimary}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDetallePago;
