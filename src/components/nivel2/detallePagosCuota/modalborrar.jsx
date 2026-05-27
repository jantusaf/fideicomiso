import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";

import DeleteIcon from "@mui/icons-material/Delete";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

import servicioAdmin from "../../../services/Administracion";

export default function SelectTextFields(props) {
  const [open, setOpen] = useState(false);

  const preba = JSON.parse(window.localStorage.getItem("loggedNoteAppUser"));
  const cuil_cuit = preba?.cuil_cuit;

  const [pago, setPago] = useState({
    cuil_cuit: cuil_cuit,
    id: props.id,
  });

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const borrar = async (event) => {
    console.log(pago);
    try {
      await servicioAdmin.borrarPago(props.id);
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
          startIcon={<DeleteIcon style={{ color: "#fff" }} />}
          size="small"
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 999,
            px: 1.8,
            color: "#fff",
            background: "linear-gradient(90deg, #b71c1c 0%, #ef5350 100%)",
            boxShadow: "0 10px 22px rgba(239,83,80,0.20)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 14px 30px rgba(239,83,80,0.28)",
            },
            transition: "0.2s ease",
            whiteSpace: "nowrap",
          }}
        >
          Borrar pago
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 22px 60px rgba(15, 127, 134, 0.18)",
          },
        }}
      >
        {/* HEADER */}
        <DialogTitle
          sx={{
            px: 2.5,
            py: 2,
            color: "#fff",
            fontWeight: 900,
            background:
              "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                flexShrink: 0,
              }}
            >
              <WarningAmberRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box sx={{ lineHeight: 1.1 }}>
              <Typography sx={{ fontWeight: 900, fontSize: 16 }}>
                Confirmar borrado
              </Typography>
              <Typography
                sx={{
                  mt: 0.3,
                  fontWeight: 650,
                  opacity: 0.9,
                  fontSize: 12.5,
                }}
              >
                Esta acción elimina el pago seleccionado.
              </Typography>
            </Box>
          </Box>

          <Chip
            label={`ID: ${props.id}`}
            sx={{
              color: "#fff",
              fontWeight: 900,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
            }}
          />
        </DialogTitle>

        <DialogContent
          sx={{
            p: 2.5,
            mt:2,
            background:
              "linear-gradient(180deg, rgba(10,59,79,0.04) 0%, rgba(20,141,141,0.04) 55%, rgba(255,255,255,0.92) 100%)",
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "#0b2b3a" }}>
            ¿Seguro que querés borrar este pago?
          </Typography>

          <Typography
            sx={{
              mt: 0.75,
              fontWeight: 650,
              color: alpha("#0b2b3a", 0.75),
            }}
          >
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 2.5, pb: 2.25, pt: 0.5 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 999,
              px: 2,
              borderColor: alpha("#01567c", 0.35),
              color: "#01567c",
              "&:hover": {
                borderColor: alpha("#148D8D", 0.7),
                backgroundColor: alpha("#148D8D", 0.06),
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={() => borrar()}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 999,
              px: 2.2,
              color: "#fff",
              background: "linear-gradient(90deg, #b71c1c 0%, #ef5350 100%)",
              boxShadow: "0 10px 22px rgba(239,83,80,0.20)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 14px 30px rgba(239,83,80,0.28)",
              },
              transition: "0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
