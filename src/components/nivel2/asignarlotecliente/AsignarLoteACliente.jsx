import React, { useState } from "react";
import servicioClientes from "../../../services/clientes";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Stack,
  Paper,
  InputLabel,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import ModalLote from "./ModalSeguro";

const AsignarLoteACliente = () => {
  const navigate = useNavigate();
  const { cuil_cuit } = useParams();

  const [lotes, setLotes] = useState({
    cuil_cuit: cuil_cuit,
    zona: "IC3",
    fraccion: "IC3",
    estado: "VENDIDO",
    manzana: "",
    parcela: "",
    lote: "",
  });

  const [parque, setParque] = useState(false);

  const designar = async () => {
    console.log(lotes);
    await servicioClientes.ventaLote(lotes);
    navigate("/usuario2/detallecliente/" + cuil_cuit);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setLotes({ ...lotes, [name]: value });
    if (value === "PIT") setParque(true);
    else setParque(false);
  };

  // =========================
  // ESTÉTICA
  // =========================
  const sxPage = {
    minHeight: "100vh",
    width: "100%",
    px: { xs: 2, md: 4 },
    py: { xs: 2.5, md: 3.5 },
    background:
      "linear-gradient(180deg, rgba(20,141,141,0.08) 0%, rgba(255,255,255,0.96) 45%, #fff 100%)",
  };

  const sxWrap = {
    width: "100%",
    maxWidth: 1400,
    mx: "auto",
  };

  const sxHeaderBanner = {
    borderRadius: 3.2,
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 2.4 },
    background: "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
    color: "#fff",
    boxShadow: "0 18px 45px rgba(10,59,79,0.25)",
    display: "flex",
    alignItems: { xs: "flex-start", md: "center" },
    justifyContent: "space-between",
    gap: 2,
    flexWrap: "wrap",
  };

  const sxChip = {
    display: "inline-flex",
    alignItems: "center",
    px: 1.35,
    py: 0.7,
    borderRadius: 999,
    background: alpha("#ffffff", 0.14),
    border: `1px solid ${alpha("#ffffff", 0.18)}`,
    fontWeight: 850,
    fontSize: 12.5,
    whiteSpace: "nowrap",
  };

  const sxPanel = {
    mt: 2.2,
    borderRadius: 3,
    p: 3,
    pt: 4,
    pb: 3,
    overflow: "visible", // CLAVE: no recortar bordes/outlines
    border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
    background:
      "linear-gradient(180deg, rgba(15,127,134,0.08) 0%, rgba(255,255,255,0.96) 60%, #fff 100%)",
    boxShadow: "0 14px 35px rgba(15,127,134,0.10)",
  };

  const sxField = {
    "& .MuiInputLabel-root": { fontWeight: 800 },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: "rgba(255,255,255,0.92)",
      minHeight: 56,
      alignItems: "center",
      overflow: "visible", // CLAVE
      "& fieldset": {
        borderColor: alpha("#0b4f6c", 0.18),
        top: 0, // ayuda a que no “corte” arriba
      },
      "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
      "&.Mui-focused fieldset": {
        borderColor: "#148D8D",
        borderWidth: 2,
      },
    },
  };


  const sxBtnPrimary = {
    borderRadius: 2,
    px: 3,
    py: 1.1,
    textTransform: "none",
    fontWeight: 950,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
    "&:hover": { backgroundColor: "#014a6b" },
  };

  const sxSubBlock = {
    mt: 2,
    borderRadius: 3,
    p: { xs: 1.6, md: 2 },
    border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
    background: alpha("#0f7f86", 0.04),
  };

  const renderElegir = (selected) => (selected ? selected : "Elegir");

  return (
    <Box sx={sxPage}>
      <Box sx={sxWrap}>
        {/* HEADER */}
        <Box sx={sxHeaderBanner}>
          <Box>
            <Typography sx={{ fontWeight: 950, letterSpacing: 0.2, fontSize: 20 }}>
              Asignar lote
            </Typography>
            <Typography sx={{ mt: 0.35, opacity: 0.92, fontWeight: 700, fontSize: 13.5 }}>
              Seleccioná el lote correspondiente a la persona.
            </Typography>
          </Box>

          <Box sx={sxChip}>CUIT/CUIL: {cuil_cuit}</Box>
        </Box>

        {/* BLOQUE INFO */}
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            borderRadius: 2,
            background:
              "linear-gradient(180deg, rgba(191, 201, 206, 0.06) 0%, rgba(44, 155, 162, 0.04) 50%, rgba(255,255,255,0.92) 100%)",
            boxShadow: "0 14px 35px rgba(15,127,134,0.10)",
            p: 3,
            mt: 3,
            mb: 3,
            overflow: "visible",
          }}
        >
          <Typography sx={{ fontWeight: 950, color: "#0a3b4f" }}>Datos del lote</Typography>
          <Typography sx={{ mt: 0.2, fontSize: 13, color: alpha("#0b4f6c", 0.72) }}>
            Completá la zona, manzana y lote/parcela. Luego elegí fracción y estado.
          </Typography>
        </Paper>

        {/* PANEL FORM */}
        <Paper elevation={0} sx={sxPanel}>
          <Stack spacing={1.6}>
            <Grid container spacing={3} sx={{ mt: 0.5, overflow: "visible" }}>
              {/* FILA 1: ZONA + ESTADO */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Zona</InputLabel>
                  <Select
                    name="zona"
                    value={lotes.zona}
                    onChange={handleChange}
                    label="Zona"
                    sx={sxField}
                  >
                    <MenuItem value="PIT">Parque Industrial</MenuItem>
                    <MenuItem value="IC3">IC3</MenuItem>
                  </Select>
                </FormControl>

              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Estado</InputLabel>
                  <Select
                    name="estado"
                    value={lotes.estado}
                    onChange={handleChange}
                    label="Estado"
                    sx={sxField}
                  >
                    <MenuItem value="VENDIDO">Venta</MenuItem>
                    <MenuItem value="RESERVADO">Reservado</MenuItem>
                    <MenuItem value="CANJE">Canje</MenuItem>
                  </Select>
                </FormControl>

              </Grid>

              {/* FILA 2: MANZANA + LOTE/PARCELA + FRACCION */}
              <Grid item xs={12} md={4}>
                <TextField
                  margin="normal"
                  variant="outlined"
                  type="number"
                  label="Manzana"
                  name="manzana"
                  value={lotes.manzana}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...sxField,
                    "& input[type=number]": { MozAppearance: "textfield" },
                    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                      { WebkitAppearance: "none", margin: 0 },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                {lotes.zona == "PIT" ? (
                  <TextField
                    margin="normal"
                    type="number"
                    label="Parcela"
                    name="parcela"
                    value={lotes.parcela}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      ...sxField,
                      "& input[type=number]": { MozAppearance: "textfield" },
                      "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                        { WebkitAppearance: "none", margin: 0 },
                    }}
                  />
                ) : (
                  <TextField
                    margin="normal"
                    label="Lote"
                    name="lote"
                    value={lotes.lote}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={sxField}
                  />
                )}
              </Grid>

<Grid item xs={12} md={4} sx={{ mt: 1 }}>

                <FormControl fullWidth>
                   <InputLabel>Fracción</InputLabel>
                  <Select
                    name="fraccion"
                    value={lotes.fraccion}
                    onChange={handleChange}
                   label="Fracción"
                    sx={sxField}
                    
                  >
                    
                    <MenuItem value={"ID/4"}>ID/4 (Parque Industrial)</MenuItem>
                    <MenuItem value={"A"}>A</MenuItem>
                    <MenuItem value={"B"}>B</MenuItem>
                    <MenuItem value={"C"}>C</MenuItem>
                    <MenuItem value={"D"}>D</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* ACCIONES */}
              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.8 }}>
                  <Button variant="contained" sx={sxBtnPrimary} onClick={designar}>
                    Designar
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {/* Opciones / Seguro */}
            <Box sx={sxSubBlock}>
              <Typography
                sx={{
                  fontWeight: 950,
                  color: "#0a3b4f",
                  mb: 1,
                  fontSize: 13.5,
                }}
              >
                Opciones / Seguro
              </Typography>

              <ModalLote datos={lotes} cuil_cuit={cuil_cuit} />
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

export default AsignarLoteACliente;
