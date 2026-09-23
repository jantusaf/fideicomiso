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
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import servicioClientes from "../../../services/clientes";
import {
  sxBtnOutlined,
  sxBtnPrimary,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
  COLOR_MUTED,
} from "../detalleclienteIngresos/estilos";

export default function Empresaocliente({ onListo }) {
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  // La razón arranca en "Empresa" (lo que muestra el desplegable), así que
  // apretar "Determinar" sin tocarlo también envía un valor válido.
  const [establecer, setEstablecer] = useState({
    cuil_cuit,
    razon: "Empresa",
  });

  const handleClickOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleClose = () => {
    if (!guardando) setOpen(false);
  };

  const handleChange = (e) => {
    setEstablecer({ ...establecer, [e.target.name]: e.target.value });
  };

  const handleDeterminar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await servicioClientes.determinarEmpresa(establecer);
      setOpen(false);
      if (onListo) await onListo();
    } catch (e) {
      console.error(e);
      setError("No se pudo guardar el cambio. Revisá la conexión con el servidor.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <>
      <Button variant="outlined" onClick={handleClickOpen} sx={{ ...sxBtnOutlined, whiteSpace: "nowrap" }}>
        Establecer empresa/cliente
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>Establecer empresa/cliente</DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ display: "block", mb: 0.5, ml: 0.25, fontWeight: 600, color: "text.secondary" }}>
              Razón
            </Typography>
            <TextField select fullWidth size="small" name="razon" value={establecer.razon} onChange={handleChange}>
              <MenuItem value="Empresa">Empresa</MenuItem>
              <MenuItem value="Persona">Persona</MenuItem>
            </TextField>
            <Typography variant="body2" sx={{ mt: 1.25, color: COLOR_MUTED }}>
              Define si el cliente es una persona humana o una empresa. Cambia los datos que se solicitan y el cálculo
              de riesgo.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={handleClose} disabled={guardando} variant="outlined" sx={sxBtnOutlined}>
            Cancelar
          </Button>
          <Button onClick={handleDeterminar} disabled={guardando} variant="contained" sx={sxBtnPrimary}>
            {guardando ? <CircularProgress size={20} color="inherit" /> : "Determinar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
