import React, { useState } from "react";
import {
  Alert,
  Box,
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
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import servicioPagos from "../../../services/pagos";

const COLOR_TEXT = "#1a303e";
const COLOR_ACCENT = "#0d3a49";

const formatoARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n) || 0);

// La columna `fecha` de pagos es texto con formatos mezclados (AAAA-MM-DD o DD/MM/AAAA).
// El input type="date" solo entiende AAAA-MM-DD.
export const fechaAISO = (texto) => {
  if (!texto) return "";
  const s = String(texto).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
};

export default function ModalEditarPago({ pago, onGuardado }) {
  const [open, setOpen] = useState(false);
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);

  const abrir = () => {
    setMonto(String(pago.monto ?? ""));
    setFecha(fechaAISO(pago.fecha));
    setMotivo("");
    setError(null);
    setOpen(true);
  };

  const cerrar = () => {
    if (!guardando) setOpen(false);
  };

  const montoNum = Number(monto);
  const montoValido = monto !== "" && Number.isFinite(montoNum) && montoNum > 0;
  const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
  const sinCambios =
    montoValido &&
    Math.abs(montoNum - Number(pago.monto)) < 0.005 &&
    fecha === fechaAISO(pago.fecha);

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await servicioPagos.editarPago({ id: pago.id, monto: montoNum, fecha, motivo });
      setOpen(false);
      if (onGuardado) await onGuardado();
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.error || "No se pudo guardar el cambio. Revisá la conexión con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <Tooltip title="Editar monto o fecha del pago" arrow>
        <Button
          size="small"
          variant="outlined"
          startIcon={<EditRoundedIcon fontSize="small" />}
          onClick={abrir}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 1.5,
            color: COLOR_TEXT,
            borderColor: "#c9d2d8",
            "&:hover": { borderColor: COLOR_ACCENT, backgroundColor: "rgba(13,58,73,0.04)" },
          }}
        >
          Editar
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={cerrar}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: COLOR_TEXT, pb: 0.5 }}>
          Editar pago
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            Pago #{pago.id} · cuota {pago.mes}/{pago.anio}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                Monto
              </Typography>
              <TextField
                fullWidth
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                error={monto !== "" && !montoValido}
                helperText={
                  montoValido
                    ? `Se guardará como ${formatoARS(montoNum)} (antes: ${formatoARS(pago.monto)})`
                    : "Ingresá un monto mayor a 0. Usá punto solo para decimales, sin separador de miles."
                }
                slotProps={{
                  input: { startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography> },
                  htmlInput: { step: "any", min: 0 },
                }}
                sx={{
                  "& input[type=number]": { MozAppearance: "textfield" },
                  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                }}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                Fecha de pago
              </Typography>
              <TextField
                fullWidth
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                error={!fechaValida}
              />
            </Box>

            <Box>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                Motivo del cambio (opcional)
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={2}
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: error de tipeo al cargar el monto"
                slotProps={{ htmlInput: { maxLength: 255 } }}
              />
            </Box>

            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              El cambio queda registrado en el historial de auditoría y la cuota se recalcula automáticamente.
            </Alert>

            {error && (
              <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={cerrar} disabled={guardando} sx={{ textTransform: "none", fontWeight: 700, color: COLOR_TEXT }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={guardar}
            disabled={guardando || !montoValido || !fechaValida || sinCambios}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 1.5,
              px: 3,
              boxShadow: "none",
              backgroundColor: COLOR_TEXT,
              "&:hover": { backgroundColor: COLOR_ACCENT, boxShadow: "none" },
            }}
          >
            {guardando ? <CircularProgress size={20} color="inherit" /> : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
