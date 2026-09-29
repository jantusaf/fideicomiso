import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import { useState } from "react";
import servicionivel3 from '../../../services/nivel3'
import {
  COLOR_TEXT,
  sxBtnPrimary,
  sxBtnOutlined,
  sxBtnDangerOutlined,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
} from "../../nivel2/detalleclienteIngresos/estilos";

export default function ModalIcc() {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const borrar = async () => {
        const rta = await servicionivel3.borrarhistorial()
        alert(rta.data)
        window.location.reload()
        setOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen} sx={sxBtnDangerOutlined}>
                Borrar historial
            </Button>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth slotProps={slotPropsDialog}>
                <Typography component="div" sx={sxDialogTitle}>Borrar historial</Typography>
                <DialogContent sx={{ px: 3, py: 2.5 }}>
                    <Typography sx={{ color: COLOR_TEXT, fontWeight: 500 }}>
                        ¿Estás seguro de borrar el historial?
                    </Typography>
                </DialogContent>

                <DialogActions sx={sxDialogActions}>
                    <Button variant="outlined" sx={sxBtnOutlined} onClick={handleClose}>No</Button>
                    <Button variant="contained" sx={sxBtnPrimary} onClick={borrar}>Sí</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
