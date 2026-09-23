import React, { useState } from "react";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import servicioPagos from "../../../services/pagos";

const COLOR_TEXT = "#1a303e";

const formatoARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n) || 0);

export default function ModalCancelarPago({ pago, onCancelado }) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState(null);
  const [cancelando, setCancelando] = useState(false);

  const abrir = () => {
    setMotivo("");
    setError(null);
    setOpen(true);
  };

  const cerrar = () => {
    if (!cancelando) setOpen(false);
  };

  const confirmar = async () => {
    setCancelando(true);
    setError(null);
    try {
      await servicioPagos.cancelarPago({ id: pago.id, motivo });
      setOpen(false);
      if (onCancelado) await onCancelado();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.error || "No se pudo cancelar el pago. Revisá la conexión con el servidor.");
    } finally {
      setCancelando(false);
    }
  };

  return (
    <>
      <Tooltip title="Cancelar este pago" arrow>
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineRoundedIcon fontSize="small" />}
          onClick={abrir}
          sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5 }}
        >
          Cancelar
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={cerrar}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: COLOR_TEXT }}>Cancelar pago</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Typography>
              ¿Seguro que querés cancelar el pago de <b>{formatoARS(pago.monto)}</b> (cuota {pago.mes}/{pago.anio})?
            </Typography>
            <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
              El pago se elimina y la cuota vuelve a quedar con ese monto pendiente. Queda una copia completa en el
              historial de auditoría.
            </Alert>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Motivo (opcional)"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              slotProps={{ htmlInput: { maxLength: 255 } }}
            />
            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cerrar} disabled={cancelando} sx={{ textTransform: "none", fontWeight: 700, color: COLOR_TEXT }}>
            Volver
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmar}
            disabled={cancelando}
            sx={{ textTransform: "none", fontWeight: 700, borderRadius: 1.5, px: 3, boxShadow: "none" }}
          >
            {cancelando ? <CircularProgress size={20} color="inherit" /> : "Sí, cancelar pago"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
