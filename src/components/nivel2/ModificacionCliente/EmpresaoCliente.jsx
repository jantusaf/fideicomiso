import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import { useParams } from "react-router-dom";
import servicioClientes from "../../../services/clientes";

export default function Empresaocliente() {
  const [open, setOpen] = useState(false);

  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [establecer, setEstablecer] = useState({
    cuil_cuit,
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setEstablecer({ ...establecer, [e.target.name]: e.target.value });
  };

  const handleDeterminar = async () => {
    await servicioClientes.determinarEmpresa(establecer);
    setOpen(false);
  };

  // ✅ AHORA SÍ: return DENTRO del componente
  return (
    <>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 900,
          px: 2.2,
          py: 1.05,
          backgroundColor: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.22)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
          "&:hover": { backgroundColor: "rgba(255,255,255,0.18)" },
          whiteSpace: "nowrap",
        }}
      >
        Establecer Empresa/Cliente
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <InputLabel variant="standard">Razón</InputLabel>

          <NativeSelect
            defaultValue={"Empresa"}
            onChange={handleChange}
            inputProps={{
              name: "razon",
            }}
          >
            <option value={"Empresa"}>Empresa</option>
            <option value={"Persona"}>Persona</option>
          </NativeSelect>

          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleDeterminar}
              sx={{
                backgroundColor: "#148D8D",
                "&:hover": { backgroundColor: "#0f7a7a" },
                fontWeight: 900,
                borderRadius: 2,
              }}
            >
              Determinar
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={handleClose}
              sx={{
                fontWeight: 900,
                borderRadius: 2,
              }}
            >
              Cancelar
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
