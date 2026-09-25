import * as React from "react";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";

import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import servicioAdmin from "../../../services/Administracion";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { COLOR_TEXT, COLOR_MUTED, sxBtnPrimary, sxBtnOutlined, sxBtnDangerOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "../detalleclienteIngresos/estilos";

export default function SelectTextFields(props) {
  const [open, setOpen] = useState(false);

  const preba = JSON.parse(window.localStorage.getItem("loggedNoteAppUser"));
  const cuil_cuit = preba.cuil_cuit;

  const [pago, setPago] = useState({
    cuil_cuit: cuil_cuit,
    id: props.id,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const borrar = async (event) => {
    console.log(pago);
    try {
      await servicioAdmin.borrarPagoic3(props.id);
      props.traer();
    } catch (error) {
      console.error(error);
      console.log("Error algo sucedio");
    }
    setOpen(false);
  };

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Tooltip title="Borrar pago" arrow>
        <Button
          onClick={handleClickOpen}
          startIcon={<DeleteOutlinedIcon />}
          size="small"
          variant="outlined"
          sx={{ ...sxBtnDangerOutlined, px: 1.5, whiteSpace: "nowrap" }}
        >
          Borrar pago
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 17, color: COLOR_TEXT }}>
                Confirmar borrado
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 500, color: COLOR_MUTED }}>
                Esta acción elimina el pago seleccionado.
              </Typography>
            </Box>
            <Chip variant="outlined" size="small" label={`ID: ${props.id}`} sx={{ fontWeight: 600 }} />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Typography sx={{ fontWeight: 600, color: COLOR_TEXT, mt: 1 }}>
            ¿Seguro que querés borrar este pago?
          </Typography>

          <Typography sx={{ mt: 0.75, fontSize: 13.5, color: COLOR_MUTED }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>
            Cancelar
          </Button>

          <Button onClick={() => borrar()} variant="contained" disableElevation sx={sxBtnPrimary}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
