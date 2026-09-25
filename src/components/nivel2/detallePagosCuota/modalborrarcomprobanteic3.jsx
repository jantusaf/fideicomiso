import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import servicioPagos from '../../../services/pagos'
import NativeSelect from '@mui/material/NativeSelect';
import useUser from '../../../hooks/useUser'
import servicioAdmin from '../../../services/Administracion'
import Tooltip from "@mui/material/Tooltip";
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import React, { useEffect, useState, Fragment } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Chip } from "@mui/material";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { COLOR_TEXT, COLOR_MUTED, sxBtnPrimary, sxBtnOutlined, sxBtnDangerOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "../detalleclienteIngresos/estilos";
const currencies = [
  {
    value: 'CBU',
    label: 'CBU N°1',
  },
  {
    value: 'CBU',
    label: 'CBU N°2',
  },


  
];



export default function SelectTextFields(props) {
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext

  const [notificacion, setNotidicaciones] = useState()
  const [activo, setActivo] = useState(false)




  const preba = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const cuil_cuit = preba.cuil_cuit

  const [pago, setPago] = useState({

    cuil_cuit: cuil_cuit,
    id:props.id


  })


  const handleClickOpen = () => {
    setOpen(true);
   
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  
  ////
  const borrar = async (event) => {
    // event.preventDefault();

    console.log(pago)
    try {

      await servicioAdmin.borrarcomprobanteic3(
      props.id
      )
      props.getData()

    } catch (error) {
      console.error(error);
      console.log('Error algo sucedio')

    }

    setOpen(false);
  };/////
  const [currency, setCurrency] = React.useState('EUR');

  /*   const handleChange = (event) => {
      setCurrency(event.target.value);
    }; */


  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Tooltip title="Borrar comprobante" arrow>
        <Button
          onClick={handleClickOpen}
          startIcon={<DeleteOutlinedIcon />}
          size="small"
          variant="outlined"
          sx={{ ...sxBtnDangerOutlined, px: 1.5, whiteSpace: "nowrap" }}
        >
          Borrar comprobante
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
                Esta acción elimina el comprobante del pago.
              </Typography>
            </Box>
            <Chip variant="outlined" size="small" label={`ID: ${props.id}`} sx={{ fontWeight: 600 }} />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Typography sx={{ fontWeight: 600, color: COLOR_TEXT, mt: 1 }}>
            ¿Seguro que querés borrar el comprobante?
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
