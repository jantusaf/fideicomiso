import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from "@mui/material";

import ApiIcon from "@mui/icons-material/Api";
import AppsOutageTwoToneIcon from "@mui/icons-material/AppsOutageTwoTone";
import SchemaTwoToneIcon from "@mui/icons-material/SchemaTwoTone";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {
  COLOR_TEXT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_OK,
  sxBtnPrimary,
  sxBtnOutlined,
  slotPropsDialog,
  sxDialogTitle,
  sxDialogActions,
} from "../detalleclienteIngresos/estilos";

function InfoRow({ icon, label, value, children }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        py: 1.25,
        borderBottom: `1px solid #eef1f3`,
        "&:last-of-type": { borderBottom: 0 },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          flexShrink: 0,
          borderRadius: 1.5,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(13, 58, 73, 0.06)",
          color: COLOR_TEXT,
          "& svg": { fontSize: 19 },
        }}
      >
        {icon}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: COLOR_MUTED, fontWeight: 600, lineHeight: 1.2 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 14.5, color: COLOR_TEXT, fontWeight: 600, mt: 0.25 }}>
          {value ?? "--"}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

export default function SelectTextFields(props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const titulo =
    props.zona === "IC3" ? (
      <>
        Zona: <b>{props.zona}</b> · Fracción: <b>{props.fraccion}</b> · Manzana:{" "}
        <b>{props.manzana}</b> · Lote: <b>{props.lote}</b>
      </>
    ) : (
      <>
        Zona: <b>{props.zona}</b> · Fracción: <b>{props.fraccion}</b> · Manzana:{" "}
        <b>{props.manzana}</b> · Parcela: <b>{props.parcela}</b>
      </>
    );

  const tieneTitular = props.cuil_cuit != 0;

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        onClick={handleClickOpen}
        sx={{ ...sxBtnOutlined, px: 1.75 }}
      >
        Detalles
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        slotProps={slotPropsDialog}
      >
        <DialogTitle sx={sxDialogTitle}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: COLOR_TEXT }}>
            Detalle del lote
          </Typography>
          <Typography sx={{ fontSize: 13, color: COLOR_MUTED, fontWeight: 500, mt: 0.5 }}>
            {titulo}
          </Typography>
          <Chip
            size="small"
            variant="outlined"
            label={tieneTitular ? "Con titular" : "Sin titular"}
            sx={{
              mt: 1.25,
              fontWeight: 600,
              color: tieneTitular ? COLOR_OK : COLOR_MUTED,
              borderColor: tieneTitular ? COLOR_OK : COLOR_BORDER,
            }}
          />
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 1.5 }}>
          <Box sx={{ mt: 1 }}>
            <InfoRow icon={<ApiIcon />} label="Superficie" value={props.superficie} />
            <InfoRow icon={<AppsOutageTwoToneIcon />} label="Adrema" value={props.adrema} />
            <InfoRow
              icon={<SchemaTwoToneIcon />}
              label="Mensura"
              value={props.mensura ?? props.adrema}
            />

            {tieneTitular ? (
              <InfoRow icon={<PersonOutlineOutlinedIcon />} label="Titular" value={props.nombre}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate("/usuario2/detallecliente/" + props.cuil_cuit)}
                  sx={{ ...sxBtnOutlined, px: 1.75 }}
                >
                  Ver
                </Button>
              </InfoRow>
            ) : (
              <InfoRow
                icon={<PersonOutlineOutlinedIcon />}
                label="Sin titular asignado"
                value="--"
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={handleClose} variant="contained" sx={sxBtnPrimary}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
