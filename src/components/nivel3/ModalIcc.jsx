import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useState } from "react";
import servicionivel3 from '../../services/nivel3'
import { useNavigate } from "react-router-dom";
import {
  COLOR_TEXT,
  COLOR_MUTED,
  sxBtnPrimary,
  sxBtnOutlined,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
} from "../nivel2/detalleclienteIngresos/estilos";

export default function ModalIcc(props) {
    const navigate = useNavigate();
    let params = useParams()
    const [open, setOpen] = React.useState(false);
    const [cargado, setCargado] = useState(null)
    const [respuesta, setRespuesta] = useState()

    const traer = async () => {
        const puede = await servicionivel3.nuevoicc(props.datos)
        setRespuesta(puede)
        setCargado(true)
    };
    const handleClickOpen = () => {
        setOpen(true);
        traer()
    };
    const handleDeterminar = async (event) => {
        event.preventDefault();
        await servicionivel3.agregariccgral(props.datos)
        navigate('/nivel3/icc')
        setOpen(false);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={sxBtnPrimary}>
                Agregar nuevo ICC
            </Button>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs" slotProps={slotPropsDialog}>
                <Box sx={sxDialogTitle}>
                    <Typography sx={{ fontSize: 17, fontWeight: 700, color: COLOR_TEXT }}>
                        Agregar nuevo ICC
                    </Typography>
                </Box>

                <DialogContent sx={{ px: 3, py: 2.5 }}>
                    <Typography sx={{ color: cargado ? COLOR_TEXT : COLOR_MUTED, fontWeight: 500, fontSize: 14.5 }}>
                        {cargado ? respuesta.resp : "Cargando..."}
                    </Typography>
                </DialogContent>

                <DialogActions sx={sxDialogActions}>
                    <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>Cancelar</Button>
                    <Button onClick={handleDeterminar} variant="contained" sx={sxBtnPrimary}>Agregar a todos</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
