import * as React from 'react';
import { useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import servicioPagos from '../../../services/pagos';
import {
  COLOR_TEXT,
  COLOR_MUTED,
  sxBtnPrimary,
  sxBtnOutlined,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
} from "../../nivel2/detalleclienteIngresos/estilos";

export default function FormDialog(props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    id: props.id,
    tipo: '',
    detalle: ''
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "detalle" && value.length > 256) return;

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rta = await servicioPagos.rechazararpagoniv3(form);
    alert(rta);
    props.getPagosi();
    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Clasificar" arrow>
        <Button variant="outlined" size="small" onClick={handleClickOpen} sx={{ ...sxBtnOutlined, px: 1.75, whiteSpace: "nowrap" }}>
          Clasificar
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>Clasificación del pago</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ px: 3, py: 2.5 }}>
            <Typography sx={{ mb: 0.75, fontWeight: 600, color: COLOR_TEXT, fontSize: 14 }}>
              Tipo de pago
            </Typography>
            <NativeSelect
              id="tipo-select"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              fullWidth
            >
              <option value="">Seleccione una opción</option>
              <option value="Inusual">Cerrada sin Ros</option>
              <option value="Sospechoso">Registrado como Ros</option>
            </NativeSelect>

            <TextField
              margin="dense"
              id="detalle"
              name="detalle"
              label="Detalle del motivo"
              placeholder="Ingrese una descripción (máx. 256 caracteres)"
              multiline
              rows={4}
              value={form.detalle}
              onChange={handleChange}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 256 } }}
              variant="outlined"
              sx={{ mt: 2, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <Typography sx={{ mt: 0.75, fontSize: 12.5, color: COLOR_MUTED, textAlign: "right" }}>
              {form.detalle.length} / 256
            </Typography>
          </DialogContent>

          <DialogActions sx={sxDialogActions}>
            <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" sx={sxBtnPrimary}>
              Confirmar clasificación
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
