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
  Paper,
  Divider,
  Avatar,
  Chip,
} from "@mui/material";

import ApiIcon from "@mui/icons-material/Api";
import AppsOutageTwoToneIcon from "@mui/icons-material/AppsOutageTwoTone";
import SchemaTwoToneIcon from "@mui/icons-material/SchemaTwoTone";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function InfoRow({ icon, label, value }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.4,
        borderRadius: 2.2,
        border: "1px solid #e8eef5",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        gap: 1.4,
      }}
    >
      <Avatar
        sx={{
          width: 44,
          height: 44,
          bgcolor: "rgba(1,86,124,0.12)",
          color: "#01567c",
          border: "1px solid rgba(1,86,124,0.18)",
        }}
      >
        {icon}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 900, color: "#1f2a33", lineHeight: 1.1 }}>
          {label}
        </Typography>
        <Typography sx={{ mt: 0.2, color: "#5b6b7a", fontWeight: 700 }}>
          {value ?? "--"}
        </Typography>
      </Box>
    </Paper>
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
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          mb: 2,
          px: 2.2,
          py: 1.1,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 800,
          backgroundColor: "#148D8D",
          boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
          "&:hover": { backgroundColor: "#0c7171ff" },
        }}
      >
        Detalles
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
          },
        }}
      >
        {/* HEADER MODERNO */}
        <DialogTitle
          sx={{
            py: 2,
            px: 2.2,
            color: "#fff",
            background:
              "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5 }}>
              
              {tieneTitular ? (
                <Chip
                  size="small"
                  label="Con titular"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    fontWeight: 800,
                  }}
                />
              ) : (
                <Chip
                  size="small"
                  label="Sin titular"
                  sx={{
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.14)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    fontWeight: 800,
                  }}
                />
              )}
            </Box>
            
            <Typography sx={{ opacity: 0.92, fontWeight: 700, fontSize: 19 }}>
              {titulo}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ backgroundColor: "#f4f8fb", p: 2.2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid #e8eef5",
              backgroundColor: "#ffffff",
            }}
          >
            <Typography sx={{ color: "#445", fontWeight: 800, mb: 1.2 }}>
              Información general
            </Typography>

            <Box sx={{ display: "grid", gap: 1.2 }}>
              <InfoRow
                icon={<ApiIcon />}
                label="Superficie"
                value={props.superficie}
              />
              <InfoRow
                icon={<AppsOutageTwoToneIcon />}
                label="Adrema"
                value={props.adrema}
              />
              <InfoRow
                icon={<SchemaTwoToneIcon />}
                label="Mensura"
                value={props.mensura ?? props.adrema}
              />

              <Divider sx={{ my: 0.6 }} />

              {tieneTitular ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.4,
                    borderRadius: 2.2,
                    border: "1px solid #e8eef5",
                    backgroundColor: "#fbfdff",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 44,
                      height: 44,
                      bgcolor: "rgba(20,141,141,0.12)",
                      color: "#148D8D",
                      border: "1px solid rgba(20,141,141,0.20)",
                    }}
                  >
                    <PersonOutlineIcon />
                  </Avatar>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 950, color: "#1f2a33" }}>
                      Titular
                    </Typography>
                    <Typography sx={{ color: "#5b6b7a", fontWeight: 700 }}>
                      {props.nombre}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    onClick={() =>
                      navigate("/usuario2/detallecliente/" + props.cuil_cuit)
                    }
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      borderColor: "rgba(1,86,124,0.35)",
                      color: "#01567c",
                      "&:hover": {
                        borderColor: "#01567c",
                        backgroundColor: "rgba(1,86,124,0.06)",
                      },
                    }}
                  >
                    Ver
                  </Button>
                </Paper>
              ) : (
                <InfoRow
                  icon={<PersonOutlineIcon />}
                  label="Sin titular asignado"
                  value="--"
                />
              )}
            </Box>
          </Paper>
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.2,
            py: 1.6,
            backgroundColor: "#f4f8fb",
            justifyContent: "flex-end",
          }}
        >
          <Button
            onClick={handleClose}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              backgroundColor: "#148D8D",
              "&:hover": { backgroundColor: "#0f7a7a" },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
